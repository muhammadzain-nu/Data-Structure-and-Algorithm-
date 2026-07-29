export interface CodeBlock { lang: "cpp" | "java" | "text"; title?: string; code: string; explain?: string }
export interface ComplexityRow { operation: string; best: string; average: string; worst: string; space: string }
export interface Comparison { a: string; b: string; rows: { criterion: string; a: string; b: string }[] }
export interface WorkedExample { difficulty: "Easy" | "Medium" | "Hard"; question: string; solution: string }
export interface Problem { q: string; hint?: string }
export interface MCQ { q: string; options: string[]; answer: number; explain?: string }
export interface TFItem { q: string; answer: boolean; explain?: string }

export interface Lesson {
  slug: string;
  title: string;
  tagline: string;
  overview: {
    what: string;
    why: string;
    applications: string[];
    prerequisites: string[];
  };
  outcomes: string[];
  concept: { heading: string; body: string }[];
  visual: { title: string; description: string }[];
  code: CodeBlock[];
  complexity: ComplexityRow[];
  comparisons: Comparison[];
  worked: WorkedExample[];
  practice: { easy: Problem[]; medium: Problem[]; hard: Problem[]; fast: Problem[]; interview: Problem[] };
  challenges: Problem[];
  interactive: { title: string; description: string }[];
  assessment: { mcqs: MCQ[]; truefalse: TFItem[]; coding: Problem[]; dryrun: Problem[]; conceptual: Problem[] };
  commonMistakes: string[];
}
