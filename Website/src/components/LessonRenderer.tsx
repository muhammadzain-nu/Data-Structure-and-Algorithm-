import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Quiz } from "./Quiz";
import { useProgress } from "@/hooks/use-platform";
import type { Lesson, CodeBlock, Problem } from "@/data/lesson-types";
import {
  BookOpen, Target, Brain, Eye, Code2, Gauge, GitCompare, Lightbulb,
  Dumbbell, Flame, Hand, ClipboardCheck, AlertTriangle, ChevronRight,
} from "lucide-react";

const sections = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "outcomes", label: "Outcomes", icon: Target },
  { id: "concept", label: "Concept", icon: Brain },
  { id: "visual", label: "Visualize", icon: Eye },
  { id: "code", label: "Code", icon: Code2 },
  { id: "complexity", label: "Complexity", icon: Gauge },
  { id: "compare", label: "Compare", icon: GitCompare },
  { id: "worked", label: "Examples", icon: Lightbulb },
  { id: "practice", label: "Practice", icon: Dumbbell },
  { id: "challenges", label: "Challenges", icon: Flame },
  { id: "interactive", label: "Interactive", icon: Hand },
  { id: "assess", label: "Assessment", icon: ClipboardCheck },
  { id: "mistakes", label: "Pitfalls", icon: AlertTriangle },
] as const;

export function LessonRenderer({ lesson }: { lesson: Lesson }) {
  const { markCompleted } = useProgress();

  return (
    <article className="prose-lesson max-w-4xl">
      <header className="mb-10 border-b border-border pb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Lesson</div>
        <h1 className="text-4xl md:text-5xl font-display font-semibold leading-tight text-foreground">
          {lesson.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground italic">{lesson.tagline}</p>
      </header>

      <nav className="mb-12 flex flex-wrap gap-2 sticky top-0 bg-background/80 backdrop-blur py-3 z-10 -mx-2 px-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent hover:text-accent-foreground hover:bg-accent/10 transition-colors flex items-center gap-1.5"
          >
            <s.icon className="h-3 w-3" />
            {s.label}
          </a>
        ))}
      </nav>

      <Section id="overview" title="1. Topic Overview" icon={BookOpen}>
        <SubHead>What is it?</SubHead>
        <p>{lesson.overview.what}</p>
        <SubHead>Why does it matter?</SubHead>
        <p>{lesson.overview.why}</p>
        <SubHead>Real-world applications</SubHead>
        <ul>{lesson.overview.applications.map((a, i) => <li key={i}>{a}</li>)}</ul>
        <SubHead>Prerequisites</SubHead>
        <ul>{lesson.overview.prerequisites.map((p, i) => <li key={i}>{p}</li>)}</ul>
      </Section>

      <Section id="outcomes" title="2. Learning Outcomes" icon={Target}>
        <p>By the end of this lesson, you will be able to:</p>
        <ul>{lesson.outcomes.map((o, i) => <li key={i}>{o}</li>)}</ul>
      </Section>

      <Section id="concept" title="3. Conceptual Explanation" icon={Brain}>
        {lesson.concept.map((c, i) => (
          <div key={i} className="mb-5">
            <h3 className="font-display text-xl text-foreground mb-1.5">{c.heading}</h3>
            <p>{c.body}</p>
          </div>
        ))}
      </Section>

      <Section id="visual" title="4. Visual Learning" icon={Eye}>
        <p className="text-sm text-muted-foreground">Interactive visualizations to build mental models. Each panel describes the on-screen behavior.</p>
        <div className="grid gap-4 sm:grid-cols-2 mt-4 not-prose">
          {lesson.visual.map((v, i) => (
            <Card key={i} className="p-5 border-l-4 border-l-accent">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md gradient-amber text-accent-foreground font-display font-bold">
                  {i + 1}
                </div>
                <div>
                  <div className="font-display font-medium text-foreground">{v.title}</div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{v.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="code" title="5. Implementation" icon={Code2}>
        <CodeTabs blocks={lesson.code} />
      </Section>

      <Section id="complexity" title="6. Complexity Analysis" icon={Gauge}>
        <div className="not-prose rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary">
                <TableHead>Operation</TableHead>
                <TableHead>Best</TableHead>
                <TableHead>Average</TableHead>
                <TableHead>Worst</TableHead>
                <TableHead>Space</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lesson.complexity.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.operation}</TableCell>
                  <TableCell><code className="text-xs">{r.best}</code></TableCell>
                  <TableCell><code className="text-xs">{r.average}</code></TableCell>
                  <TableCell><code className="text-xs">{r.worst}</code></TableCell>
                  <TableCell><code className="text-xs">{r.space}</code></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section id="compare" title="7. Comparative Analysis" icon={GitCompare}>
        {lesson.comparisons.map((c, i) => (
          <div key={i} className="not-prose mb-6 rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary">
                  <TableHead>Criterion</TableHead>
                  <TableHead className="text-accent-foreground">{c.a}</TableHead>
                  <TableHead className="text-accent-foreground">{c.b}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {c.rows.map((r, j) => (
                  <TableRow key={j}>
                    <TableCell className="font-medium">{r.criterion}</TableCell>
                    <TableCell className="text-sm">{r.a}</TableCell>
                    <TableCell className="text-sm">{r.b}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </Section>

      <Section id="worked" title="8. Worked Examples" icon={Lightbulb}>
        <Accordion type="single" collapsible className="not-prose">
          {lesson.worked.map((w, i) => (
            <AccordionItem key={i} value={`w${i}`}>
              <AccordionTrigger className="font-display">
                <span className="flex items-center gap-3">
                  <span className={
                    "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded " +
                    (w.difficulty === "Easy" ? "bg-success/15 text-success" :
                     w.difficulty === "Medium" ? "bg-amber/30 text-amber-foreground" :
                     "bg-destructive/15 text-destructive")
                  }>{w.difficulty}</span>
                  <span>{w.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground/85 leading-7">
                <strong className="block mb-2 text-foreground">Solution:</strong>
                {w.solution}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <Section id="practice" title="9. Practice Problems" icon={Dumbbell}>
        <Tabs defaultValue="easy" className="not-prose">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="easy">Easy</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="hard">Hard</TabsTrigger>
            <TabsTrigger value="fast">FAST Exam</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
          </TabsList>
          {(["easy","medium","hard","fast","interview"] as const).map((k) => (
            <TabsContent key={k} value={k}>
              <ProblemList items={lesson.practice[k]} />
            </TabsContent>
          ))}
        </Tabs>
      </Section>

      <Section id="challenges" title="10. Challenging Problems" icon={Flame}>
        <p className="text-sm text-muted-foreground">FAST-University-style questions combining multiple concepts, dry-runs, and debugging.</p>
        <ProblemList items={lesson.challenges} />
      </Section>

      <Section id="interactive" title="11. Interactive Exercises" icon={Hand}>
        <div className="grid gap-4 sm:grid-cols-2 not-prose">
          {lesson.interactive.map((x, i) => (
            <Card key={i} className="p-5">
              <div className="font-display font-medium text-foreground mb-1.5">{x.title}</div>
              <p className="text-sm text-muted-foreground">{x.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="assess" title="12. Assessment" icon={ClipboardCheck}>
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-xl mb-4">MCQs & True/False</h3>
            <div className="not-prose">
              <Quiz mcqs={lesson.assessment.mcqs} truefalse={lesson.assessment.truefalse}
                onComplete={(s, t) => markCompleted(lesson.slug, Math.round((s / t) * 100))} />
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl mb-3">Coding Questions</h3>
            <ProblemList items={lesson.assessment.coding} />
          </div>
          <div>
            <h3 className="font-display text-xl mb-3">Dry-Run Questions</h3>
            <ProblemList items={lesson.assessment.dryrun} />
          </div>
          <div>
            <h3 className="font-display text-xl mb-3">Conceptual Questions</h3>
            <ProblemList items={lesson.assessment.conceptual} />
          </div>
        </div>
      </Section>

      <Section id="mistakes" title="13. Common Mistakes" icon={AlertTriangle}>
        <ul>{lesson.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}</ul>
      </Section>

      <div className="mt-16 flex justify-end">
        <Button onClick={() => markCompleted(lesson.slug)} className="gradient-amber text-accent-foreground hover:opacity-90">
          Mark lesson complete <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}

function Section({ id, title, icon: Icon, children }: { id: string; title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-14 scroll-mt-20">
      <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-display font-semibold text-foreground mb-5 pb-2 border-b border-border">
        <Icon className="h-5 w-5 text-accent" />
        {title}
      </h2>
      {children}
    </section>
  );
}
function SubHead({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-lg mt-5 mb-1 text-foreground">{children}</h3>;
}
function ProblemList({ items }: { items: Problem[] }) {
  return (
    <ol className="not-prose mt-4 space-y-2.5">
      {items.map((p, i) => (
        <li key={i} className="rounded-md border border-border p-3.5 text-sm flex gap-3 hover:border-accent/50 transition-colors">
          <span className="font-display font-semibold text-accent-foreground bg-accent/20 h-6 w-6 rounded-full grid place-items-center text-xs shrink-0">{i + 1}</span>
          <div>
            <div className="text-foreground/90 leading-6">{p.q}</div>
            {p.hint && <div className="text-xs text-muted-foreground mt-1.5">Hint: {p.hint}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function CodeTabs({ blocks }: { blocks: CodeBlock[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="not-prose">
      <div className="flex gap-1 border-b border-border mb-0">
        {blocks.map((b, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={
              "px-3 py-1.5 text-xs font-medium transition-colors border-b-2 -mb-px " +
              (active === i
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            {b.title || b.lang.toUpperCase()}
          </button>
        ))}
      </div>
      <pre className="rounded-b-md bg-primary text-primary-foreground p-4 overflow-x-auto text-[12.5px] leading-relaxed">
        <code>{blocks[active].code}</code>
      </pre>
      {blocks[active].explain && (
        <p className="text-sm text-muted-foreground mt-3 italic">{blocks[active].explain}</p>
      )}
    </div>
  );
}
