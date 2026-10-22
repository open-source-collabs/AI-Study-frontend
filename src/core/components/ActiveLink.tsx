"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

type ActiveLinkProps = { href: string; className: string; activeClassName: string; children: ReactNode };

function CurrentLink({ href, className, activeClassName, children }: ActiveLinkProps) {
  const active = usePathname() === href;
  return <Link aria-current={active ? "page" : undefined} className={active ? `${className} ${activeClassName}` : className} href={href}>{children}</Link>;
}

// usePathname() is runtime-only data, so it must sit inside Suspense; the fallback is the same link, just not highlighted.
export function ActiveLink(props: ActiveLinkProps) {
  return <Suspense fallback={<Link className={props.className} href={props.href}>{props.children}</Link>}><CurrentLink {...props} /></Suspense>;
}
