import type { HTMLAttributes, ReactNode } from "react";

type ChipProps = HTMLAttributes<HTMLSpanElement> & { children: ReactNode };

export function Chip({ children, className = "", ...props }: ChipProps) {
  return <span className={`chip ${className}`.trim()} {...props}>{children}</span>;
}
