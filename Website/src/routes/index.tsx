import { createFileRoute, Link } from "@tanstack/react-router";
import { topics } from "@/data/topics";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, Code2, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FAST DSA — Deep Data Structures & Algorithms Learning" },
      { name: "description", content: "Master Data Structures & Algorithms the way FAST University teaches it. Deep theory, code in C++/Java, visualizations, and challenging exam-style problems." },
      { property: "og:title", content: "FAST DSA Learning Platform" },
      { property: "og:description", content: "Master DSA with FAST-style rigor — theory, code, visualizations, and challenging problems." },
    ],
  }),
  component: Index,
});

function Index() {
  const modules: Record<string, typeof topics> = {
    "Mid-term 1": topics.filter((t) => t.module === "Mid-term 1"),
    "Mid-term 2": topics.filter((t) => t.module === "Mid-term 2"),
    "Final": topics.filter((t) => t.module === "Final"),
  };
  const totalHours = topics.reduce((s, t) => s + t.hours, 0);

  return (
    <div className="px-6 md:px-12 lg:px-16 py-12 md:py-20 max-w-6xl mx-auto">
      {/* Hero */}
      <section className="relative">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
          <Sparkles className="h-3 w-3 text-accent" />
          FAST-NUCES · Data Structures & Algorithms
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold leading-[1.05] tracking-tight">
          Learn DSA the way a <span className="text-gradient-amber">FAST professor</span> teaches it.
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
          Eleven deep lessons covering the complete FAST University Data Structures course — from
          pointers to graph algorithms — with rigorous theory, dual C++/Java implementations,
          interactive visualizations, and challenging exam-style problems.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" className="gradient-amber text-accent-foreground hover:opacity-90">
            <Link to="/lessons/$slug" params={{ slug: "adt-pointers" }}>
              Start the first lesson <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/syllabus">View full syllabus</Link>
          </Button>
        </div>

        <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-8">
          <Stat label="Lessons" value={`${topics.length}`} />
          <Stat label="Contact hours" value={`${totalHours}`} />
          <Stat label="Practice problems" value="250+" />
          <Stat label="Code samples" value="C++ · Java" />
        </dl>
      </section>

      {/* Pillars */}
      <section className="mt-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Pillar icon={Brain} title="First-principles theory" body="Build intuition before formalism. Every concept derived from scratch with edge cases and common mistakes." />
        <Pillar icon={Code2} title="Real C++ & Java code" body="Production-style implementations with line-by-line explanations — not pseudocode." />
        <Pillar icon={BookOpen} title="Visual learning" body="Detailed descriptions of animations: memory diagrams, tree rotations, hash collisions, graph traversals." />
        <Pillar icon={Trophy} title="Exam & interview ready" body="FAST-style mid/final questions, dry-runs, debugging exercises, and top-tier interview problems." />
      </section>

      {/* Modules */}
      <section className="mt-24">
        <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight mb-2">Course modules</h2>
        <p className="text-muted-foreground max-w-xl mb-10">Aligned to the FAST-NUCES DSA syllabus — Mid-term 1, Mid-term 2, and Final exam coverage.</p>
        <div className="space-y-10">
          {Object.entries(modules).map(([name, list]) => (
            <div key={name}>
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-display text-xl text-foreground">{name}</h3>
                <span className="text-xs text-muted-foreground">{list.length} lessons</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {list.map((t) => (
                  <Link key={t.slug} to="/lessons/$slug" params={{ slug: t.slug }}>
                    <Card className="p-5 h-full hover:border-accent transition-all hover:shadow-lg hover:-translate-y-0.5 group">
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent/20 text-accent-foreground font-display font-semibold">
                          {String(t.order).padStart(2, "0")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-display font-medium text-foreground group-hover:text-gradient-amber transition-colors">{t.title}</div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.short}</p>
                          <div className="mt-2.5 flex gap-3 text-[11px] text-muted-foreground uppercase tracking-wider">
                            <span>{t.weeks}w</span><span>·</span><span>{t.hours}h</span><span>·</span><span>CLO {t.clo}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-28 text-center border-t border-border pt-16">
        <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">Ready to begin?</h2>
        <p className="text-muted-foreground mt-3 mb-8">Start with foundations and progress through the full FAST-NUCES syllabus.</p>
        <Button asChild size="lg" className="gradient-amber text-accent-foreground hover:opacity-90">
          <Link to="/lessons/$slug" params={{ slug: "adt-pointers" }}>
            Start lesson 1 — ADT & Pointers <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-2xl md:text-3xl text-foreground">{value}</dd>
    </div>
  );
}
function Pillar({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <Card className="p-6">
      <Icon className="h-5 w-5 text-accent mb-4" />
      <div className="font-display font-medium text-foreground mb-1.5">{title}</div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </Card>
  );
}
