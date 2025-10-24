'use client'

import { useCallback, useMemo, useState, useTransition } from "react";
import { handleLargePayload } from "./actions";

export default function Home() {
  const [isPending, startTransition] = useTransition()
  const [responseMessage, setResponseMessage] = useState<string | null>(null)

  // Generate large payload on client side (5MB)
  const largePayload = useMemo(() =>
    new Array(10 * 1024)
      .fill(null)
      .map((_, idx) => idx),
    []
  );

  const handleClick = useCallback(() => {
    startTransition(async() => {
      setResponseMessage(null)
      const { message} = await handleLargePayload(largePayload)
      setResponseMessage(message)
    })
  }, [largePayload])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Large Payload Test
        </h1>

        <form  className="flex flex-col gap-4 w-full">
          <button
            type="button"
            disabled={isPending}
            onClick={handleClick}
            className="flex h-12 items-center justify-center rounded-lg bg-blue-600 px-5 text-white font-semibold transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Sending Large Payload...' : 'Send Large Payload (5MB)'}
          </button>
        </form>

        {responseMessage && (
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 w-full">
            {responseMessage}
          </div>
        )}
      </main>
    </div>
  );
}
