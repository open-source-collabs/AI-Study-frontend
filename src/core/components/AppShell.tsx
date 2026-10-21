"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useStoredStudySets } from "@/core/hooks/use-stored-study-sets";

const primaryNavigation = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/sets/demo/summary", label: "My library", icon: "□" },
  { href: "/sets/demo/flashcards", label: "Flashcards", icon: "◇" },
  { href: "/sets/demo/quiz", label: "Quizzes", icon: "✓" },
];

const utilityNavigation = [
  { href: "/help", label: "Help & guide", icon: "?" },
  { href: "/setting/provider", label: "Provider settings", icon: "⚙" },
];

type NavigationItem = { href: string; label: string; icon: string; active: boolean };

function NavigationLink({ href, label, icon, active }: NavigationItem) {
  return <Link className={`nav-link ${active ? "nav-link-active" : ""}`} href={href}>
    <span className="nav-icon" aria-hidden="true">{icon}</span><span>{label}</span>
  </Link>;
}

function SavedStudySets() {
  const { isLoading, studySets } = useStoredStudySets();
  return <nav className="nav-group saved-set-nav" aria-label="Saved study sets"><span className="nav-label">Study sets</span>{isLoading && <span className="nav-link"><span>Loading...</span></span>}{!isLoading && !studySets.length && <span className="nav-link"><span>No sets yet</span></span>}{studySets.map((studySet) => <NavigationLink active={false} href={`/sets/${studySet.id}/summary`} icon="•" key={studySet.id} label={studySet.title} />)}</nav>;
}

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="app-shell">
    <div className="mobile-topbar">
      <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>StudyOS</span></Link>
      <span className="status-dot-label"><span className="status-dot" aria-hidden="true" />Ready</span>
    </div>

    <aside className="sidebar" aria-label="Primary navigation">
      <div>
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>StudyOS<small>AI study companion</small></span>
        </Link>
        <div className="search-hint" aria-label="Search shortcut"><span>Search guides...</span><kbd>⌘K</kbd></div>
        <nav className="nav-group" aria-label="Study workspace">
          <span className="nav-label">Workspace</span>
          {primaryNavigation.map((item) => <NavigationLink key={item.href} {...item} active={false} />)}
        </nav>
        <SavedStudySets />
        <nav className="nav-group" aria-label="Support and settings">
          <span className="nav-label">Support</span>
          {utilityNavigation.map((item) => <NavigationLink key={item.href} {...item} active={false} />)}
        </nav>
      </div>
      <div className="workspace-status">
        <span className="avatar">AS</span>
        <span><strong>AI Study</strong><small>Frontend workspace</small></span>
        <span className="status-dot" aria-label="Local workspace ready" />
      </div>
    </aside>

    <main className="workspace-main">{children}</main>

    <aside className="context-dock" aria-label="Study focus">
      <div className="dock-heading"><span className="eyebrow">Study focus</span><span className="status-dot-label"><span className="status-dot" aria-hidden="true" />Local</span></div>
      <div className="dock-card">
        <span className="dock-icon" aria-hidden="true">◒</span>
        <h2>Build a study habit</h2>
        <p>Complete one short session today. Your progress will appear here once study data is connected.</p>
        <div className="progress-track" aria-label="Study progress"><span style={{ width: "24%" }} /></div>
        <div className="metric-row"><span>Today</span><strong>24%</strong></div>
      </div>
      <div className="shortcut-list"><span className="eyebrow">Shortcuts</span><div><span>Upload material</span><kbd>⌘U</kbd></div><div><span>Open help</span><kbd>?</kbd></div></div>
    </aside>
  </div>;
}
