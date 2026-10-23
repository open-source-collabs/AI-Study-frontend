"use client";

import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";

// Last-resort screen for an unexpected crash. Never prints the error itself, it can contain internals.
export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return <main className="error-page"><Card className="empty-card">
    <h2>Something went wrong</h2>
    <p>Your study sets are safe in this browser. Try again, and if it keeps happening, reload the page.</p>
    <div className="empty-actions"><Button onClick={() => retry()}>Try again</Button></div>
  </Card></main>;
}
