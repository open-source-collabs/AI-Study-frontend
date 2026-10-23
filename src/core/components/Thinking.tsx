"use client";

import { useEffect, useState } from "react";

type ThinkingProps = { steps: string[]; skeleton?: boolean };

// Shown while the AI works. The visible text moves through `steps` and stops on the last one; screen readers get one
// fixed message instead of a new announcement every few seconds.
export function Thinking({ steps, skeleton = false }: ThinkingProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((current) => Math.min(current + 1, steps.length - 1)), 3000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return <div className="thinking" role="status">
    <span className="visually-hidden">Working on it, please wait.</span>
    <div aria-hidden="true" className="thinking-row">
      <span className="thinking-dots"><i /><i /><i /></span>
      <span>{steps[step]}</span>
    </div>
    {skeleton && <div aria-hidden="true" className="skeleton-lines"><span /><span /><span /></div>}
  </div>;
}
