'use client'

import { useCallback, useMemo, useState, useTransition } from "react";
import { handleLargePayload } from "./actions";

export default function Home() {
  const [isPending, startTransition] = useTransition()
  const [responseMessage, setResponseMessage] = useState<string | null>(null)

  // Generate large payload on client side
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
    <div>
      <main>
        <h1>
          Large Payload Test
        </h1>

        <form>
          <button
            type="button"
            disabled={isPending}
            onClick={handleClick}
          >
            {isPending ? 'Sending Large Payload...' : 'Send Large Payload'}
          </button>
        </form>

        {responseMessage && (
          <div>
            {responseMessage}
          </div>
        )}
      </main>
    </div>
  );
}
