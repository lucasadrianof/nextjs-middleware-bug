# Next.js Middleware Body Race Condition Bug

This project demonstrates a race condition bug in Next.js (verified on 15 and 16) when using middleware (proxy) that reads the request body along with server actions that expect to receive large payloads.

## The Bug

When a Next.js proxy reads the request body and then passes the request to a server action, there's a race condition because `requestData.body.finalize()` in `next-server.js` is **not awaited**. This causes the request body buffer to be replaced asynchronously, and if the server action tries to read the body before the finalization completes, it may receive an incomplete or empty body.

### Root Cause

In `/node_modules/next/dist/server/next-server.js` (line ~1248):

```javascript
finally {
  if (hasRequestBody) {
    requestData.body.finalize();  // ❌ Missing await
  }
}
```

The `finalize()` method is async but not awaited, creating a race condition when:
1. Middleware/proxy reads the request body
2. The body needs to be cloned/buffered for the next handler
3. A server action tries to read the body before finalization completes

## Testing the Bug

Follow these steps to reproduce the bug and verify the fix:

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build the Project

```bash
pnpm build
```

This will:
- Build the Next.js app in standalone mode
- Copy static assets
- **Inject a random delay** into `body-streams.js` to emulate network overhead.

### 3. Start the Server

```bash
pnpm start
```

The server will start at [http://localhost:3000](http://localhost:3000)

### 4. Reproduce the Bug

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. The page displays the payload size in bytes (should be ~50KB)
3. Click the **"Send Large Payload"** button
4. **Expected Result (with bug)**: Error message or failure due to the race condition
   - You should a `SyntaxError: Unexpected end of JSON input` in your terminal.

### 5. Stop the Server

```bash
# Press Ctrl+C or Cmd+C to stop the server
```

### 6. Apply the Bugfix

```bash
pnpm bugfix
```

This will add `await` before `requestData.body.finalize();` in `next-server.js`

### 7. Restart the Server

```bash
pnpm start
```

### 8. Verify the Fix

1. Open [http://localhost:3000](http://localhost:3000) again
2. Click the **"Send Large Payload"** button
3. **Expected Result (with fix)**: Success!
   - You should see: `✓ Successfully processed [number] bytes of data`
   - Both the proxy and the server action successfully process the body
   - No race condition


## Requirements

- Node.js 20 or 22+ (for `--experimental-strip-types` flag)
- pnpm

## Notes

- The random delay in `patch-body-streams.mts` it used to easily emulate network overheads locally.
