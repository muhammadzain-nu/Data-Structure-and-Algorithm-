import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import type { MCQ, TFItem } from "@/data/lesson-types";
import { cn } from "@/lib/utils";

interface QuizProps {
  mcqs: MCQ[];
  truefalse: TFItem[];
  onComplete?: (score: number, total: number) => void;
}

export function Quiz({ mcqs, truefalse, onComplete }: QuizProps) {
  const total = mcqs.length + truefalse.length;
  const [mcqAns, setMcqAns] = useState<Record<number, number>>({});
  const [tfAns, setTfAns] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const score =
    mcqs.reduce((s, m, i) => s + (mcqAns[i] === m.answer ? 1 : 0), 0) +
    truefalse.reduce((s, t, i) => s + (tfAns[i] === t.answer ? 1 : 0), 0);

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete?.(score, total);
  };

  return (
    <div className="space-y-6">
      {mcqs.map((m, i) => (
        <Card key={`m${i}`} className="p-5">
          <div className="font-medium mb-3">{i + 1}. {m.q}</div>
          <div className="space-y-2">
            {m.options.map((opt, j) => {
              const chosen = mcqAns[i] === j;
              const correct = submitted && j === m.answer;
              const wrong = submitted && chosen && j !== m.answer;
              return (
                <button
                  key={j}
                  onClick={() => !submitted && setMcqAns({ ...mcqAns, [i]: j })}
                  className={cn(
                    "w-full text-left rounded-md border px-3 py-2 text-sm transition-colors",
                    chosen && !submitted && "border-accent bg-accent/10",
                    correct && "border-success bg-success/10 text-success-foreground",
                    wrong && "border-destructive bg-destructive/10",
                    !chosen && !submitted && "hover:bg-muted",
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {submitted && correct && <Check className="h-3.5 w-3.5" />}
                    {submitted && wrong && <X className="h-3.5 w-3.5" />}
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
          {submitted && m.explain && (
            <p className="mt-3 text-xs text-muted-foreground italic">{m.explain}</p>
          )}
        </Card>
      ))}

      {truefalse.map((t, i) => {
        const idx = mcqs.length + i + 1;
        const chosen = tfAns[i];
        const correct = submitted && chosen === t.answer;
        const wrong = submitted && chosen !== undefined && chosen !== t.answer;
        return (
          <Card key={`t${i}`} className="p-5">
            <div className="font-medium mb-3">{idx}. {t.q}</div>
            <div className="flex gap-2">
              {[true, false].map((v) => {
                const isChosen = chosen === v;
                const isCorrect = submitted && v === t.answer;
                const isWrong = submitted && isChosen && v !== t.answer;
                return (
                  <button
                    key={String(v)}
                    onClick={() => !submitted && setTfAns({ ...tfAns, [i]: v })}
                    className={cn(
                      "px-4 py-2 rounded-md border text-sm transition-colors",
                      isChosen && !submitted && "border-accent bg-accent/10",
                      isCorrect && "border-success bg-success/10",
                      isWrong && "border-destructive bg-destructive/10",
                      !isChosen && !submitted && "hover:bg-muted",
                    )}
                  >
                    {v ? "True" : "False"}
                  </button>
                );
              })}
            </div>
            {submitted && t.explain && (
              <p className="mt-3 text-xs text-muted-foreground italic">{t.explain}</p>
            )}
          </Card>
        );
      })}

      <div className="flex items-center gap-4 pt-2">
        {!submitted ? (
          <Button onClick={handleSubmit} variant="default" className="gradient-amber text-accent-foreground hover:opacity-90">
            Submit answers
          </Button>
        ) : (
          <>
            <div className="text-lg font-display">
              Score: <span className="text-gradient-amber font-bold">{score} / {total}</span>
            </div>
            <Button variant="outline" onClick={() => { setSubmitted(false); setMcqAns({}); setTfAns({}); }}>
              Reset
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
