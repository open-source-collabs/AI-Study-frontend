"use client";

import { useState } from "react";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { Chip } from "@/core/components/Chip";
import { OutputStates } from "@/core/components/OutputStates";
import { useQuiz } from "../hooks/useQuiz";
import { useQuizSession } from "../hooks/useQuizSession";
import type { Quiz } from "../types";

type PlayerProps = Quiz & {
  initialIndex: number;
  initialScore: number;
  onProgress: (index: number, score: number) => void;
  onFinish: (score: number) => void;
};

function QuizPlayer({ questions, initialIndex, initialScore, onProgress, onFinish }: PlayerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(initialScore);
  const [finished, setFinished] = useState(false);
  const question = questions[index];
  const isLast = index === questions.length - 1;

  function pick(option: number) {
    if (picked !== null) return;
    setPicked(option);
    if (option === question.answerIndex) setScore((current) => current + 1);
  }

  // Saved on "Next", not on the click, so a resumed question is answered (and scored) once.
  function next() {
    if (isLast) {
      setFinished(true);
      return onFinish(score);
    }
    setIndex(index + 1);
    setPicked(null);
    onProgress(index + 1, score);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
    onProgress(0, 0);
  }

  if (finished) {
    return <Card className="empty-card"><h2>Quiz complete</h2><p>You scored {score} out of {questions.length}.</p><div className="empty-actions"><Button onClick={restart}>Retake quiz</Button></div></Card>;
  }

  return <Card className="quiz-card">
    <div className="deck-metrics"><Chip>Question {index + 1} / {questions.length}</Chip><Chip className="chip-teal">Score {score}</Chip></div>
    <h2>{question.question}</h2>
    <div className="quiz-options">
      {question.options.map((option, optionIndex) => {
        const isAnswer = optionIndex === question.answerIndex;
        const state = picked === null ? "" : isAnswer ? "quiz-option-correct" : optionIndex === picked ? "quiz-option-wrong" : "";
        return <button aria-disabled={picked !== null} className={`quiz-option ${state}`.trim()} key={optionIndex} onClick={() => pick(optionIndex)} type="button">
          {option}
          {picked !== null && isAnswer && <strong> · Correct</strong>}
          {picked !== null && !isAnswer && optionIndex === picked && <strong> · Your answer</strong>}
        </button>;
      })}
    </div>
    {picked !== null && <div aria-live="polite" className="quiz-feedback">
      <p>{picked === question.answerIndex ? "Correct." : "Not quite."} {question.explanation}</p>
      <Button onClick={next}>{isLast ? "See score" : "Next question"}</Button>
    </div>}
  </Card>;
}

// Mounts the player only after the saved position is read, so it starts exactly where the student left off.
function ResumableQuiz({ setId, questions }: { setId: string; questions: Quiz["questions"] }) {
  const session = useQuizSession(setId, questions.length);
  if (!session.isReady) return <div className="loading-state" role="status">Loading...</div>;
  return <QuizPlayer initialIndex={session.initialIndex} initialScore={session.initialScore} onFinish={session.finish} onProgress={session.saveProgress} questions={questions} />;
}

export function QuizView({ setId }: { setId: string }) {
  const { data, error, generate, status, canGenerate } = useQuiz(setId);
  return <OutputStates canGenerate={canGenerate} error={error} label="quiz" onGenerate={generate} status={status}>
    {data && <ResumableQuiz questions={data.questions} setId={setId} />}
  </OutputStates>;
}
