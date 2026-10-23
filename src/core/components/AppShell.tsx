"use client";

import { BookOpen, CircleHelp, FileText, Layers, LayoutDashboard, ListChecks, Settings, Target, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useStoredStudySets } from "@/core/hooks/use-stored-study-sets";
import type { StudySet } from "@/core/storage";
import { ActiveLink } from "./ActiveLink";

const utilityNavigation = [
  { href: "/help", label: "Help & guide", icon: CircleHelp },
  { href: "/setting/provider", label: "Provider settings", icon: Settings },
];

type NavigationItem = { href: string; label: string; icon: LucideIcon };

function NavigationLink({ href, label, icon: Icon }: NavigationItem) {
  return <ActiveLink activeClassName="nav-link-active" className="nav-link" href={href}>
    <span className="nav-icon" aria-hidden="true"><Icon size={18} /></span><span>{label}</span>
  </ActiveLink>;
}

function SavedStudySets({ error, isLoading, studySets }: { error: string | null; isLoading: boolean; studySets: StudySet[] }) {
  return <nav className="nav-group saved-set-nav" aria-label="Saved study sets"><span className="nav-label">Study sets</span>{isLoading && <span className="nav-link"><span>Loading...</span></span>}{!isLoading && error && <span className="nav-link"><span>Could not load sets</span></span>}{!isLoading && !error && !studySets.length && <span className="nav-link"><span>No sets yet</span></span>}{studySets.map((studySet) => <NavigationLink href={`/sets/${studySet.id}/summary`} icon={FileText} key={studySet.id} label={studySet.title} />)}</nav>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { error, isLoading, studySets } = useStoredStudySets();
  // Study modes belong to a set, so these links only exist once a set does (newest first).
  const latestId = studySets[0]?.id;
  const primaryNavigation: NavigationItem[] = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    ...(latestId ? [
      { href: `/sets/${latestId}/summary`, label: "Latest set", icon: BookOpen },
      { href: `/sets/${latestId}/flashcards`, label: "Flashcards", icon: Layers },
      { href: `/sets/${latestId}/quiz`, label: "Quizzes", icon: ListChecks },
    ] : []),
  ];

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="mobile-topbar">
      <Link aria-label="StudyOS home" className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>StudyOS</span></Link>
      <span className="status-dot-label"><span className="status-dot" aria-hidden="true" />Ready</span>
    </div>

    <aside className="sidebar" aria-label="Primary navigation">
      <div>
        <Link aria-label="StudyOS home" className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>StudyOS<small>AI study companion</small></span>
        </Link>
        <div className="search-hint" aria-label="Search shortcut"><span>Search guides.</span></div>
        <nav className="nav-group" aria-label="Study workspace">
          <span className="nav-label">Workspace</span>
          {primaryNavigation.map((item) => <NavigationLink key={item.href} {...item} />)}
        </nav>
        <SavedStudySets error={error} isLoading={isLoading} studySets={studySets} />
        <nav className="nav-group" aria-label="Support and settings">
          <span className="nav-label">Support</span>
          {utilityNavigation.map((item) => <NavigationLink key={item.href} {...item} />)}
        </nav>
      </div>
      <div className="workspace-status">
        <span className="avatar">AS</span>
        <span><strong>AI Study</strong><small>Learning workspace</small></span>
        <span className="status-dot" aria-label="Local workspace ready" />
      </div>
    </aside>

    <main className="workspace-main" id="main-content" tabIndex={-1}>{children}</main>

    {/* The sidebar is hidden on phones, so the essentials move to a bottom bar. */}
    <nav aria-label="Main" className="mobile-nav">
      {[...primaryNavigation.slice(0, 2), ...utilityNavigation].map((item) => <NavigationLink key={item.href} {...item} />)}
    </nav>

    <aside className="context-dock" aria-label="Study focus">
      <div className="dock-heading"><span className="eyebrow">Study focus</span></div>
      <div className="dock-card">
        <span className="dock-icon" aria-hidden="true"><Target size={20} /></span>
        <h2>Build a study habit</h2>
        <p>Complete one short session today. Your progress and where you left off are on the dashboard.</p>
      </div>
    </aside>
  </div>;
}
