"use client";

import { Card } from "@/core/components/Card";
import { useProgress } from "../hooks/useProgress";

export function ProgressOverview() {
  const progress = useProgress();
  if (!progress) return <Card><div className="loading-state" role="status">Loading progress...</div></Card>;

  const isEmpty = !progress.days.some((day) => day.count) && !progress.quizzes.length && !progress.mastery.length;
  const busiest = Math.max(1, ...progress.days.map((day) => day.count));

  return <Card className="progress-card">
    <div className="section-heading compact"><div><span className="eyebrow">Progress</span><h2>Your study activity</h2></div></div>
    {isEmpty && <p className="field-help">Nothing yet. Mark some flashcards or finish a quiz and your progress will show up here.</p>}
    {!isEmpty && <>
      <ul aria-label="Reviews and quiz answers in the last 7 days" className="activity-bars">
        {progress.days.map((day) => <li key={day.key}><span className="activity-bar" style={{ height: `${Math.max(4, (day.count / busiest) * 56)}px` }} /><span className="muted-text">{day.label}</span><span className="visually-hidden">{day.count} activities</span></li>)}
      </ul>
      {progress.mastery.length > 0 && <section><h3>Flashcard mastery</h3>
        {progress.mastery.map((item) => <div className="mastery-row" key={item.setTitle}><div className="metric-row"><span>{item.setTitle}</span><strong>{item.known} / {item.total}</strong></div><div aria-hidden="true" className="progress-track"><span style={{ width: `${item.total ? (item.known / item.total) * 100 : 0}%` }} /></div></div>)}
      </section>}
      {progress.quizzes.length > 0 && <section><h3>Recent quiz scores</h3>
        <ul className="score-list">{progress.quizzes.map((quiz) => <li key={quiz.at}><span>{quiz.setTitle}</span><strong>{quiz.score} / {quiz.total}</strong></li>)}</ul>
      </section>}
    </>}
  </Card>;
}
