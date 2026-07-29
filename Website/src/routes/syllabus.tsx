import { createFileRoute, Link } from "@tanstack/react-router";
import { topics } from "@/data/topics";
import { useProgress } from "@/hooks/use-platform";
import { Check, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/syllabus")({
  head: () => ({
    meta: [
      { title: "Syllabus — FAST DSA Platform" },
      { name: "description", content: "Complete FAST-NUCES Data Structures & Algorithms syllabus broken down by module, weeks, contact hours, and CLO." },
      { property: "og:title", content: "Syllabus — FAST DSA" },
      { property: "og:description", content: "Complete FAST-NUCES Data Structures & Algorithms syllabus." },
    ],
  }),
  component: SyllabusPage,
});

function SyllabusPage() {
  const { progress } = useProgress();
  const modules: ("Mid-term 1" | "Mid-term 2" | "Final")[] = ["Mid-term 1", "Mid-term 2", "Final"];
  const completedCount = topics.filter((t) => progress[t.slug]?.completed).length;

  return (
    <div className="px-6 md:px-12 lg:px-16 py-12 max-w-5xl mx-auto">
      <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">Syllabus</div>
      <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">FAST-NUCES Data Structures & Algorithms</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">Sixteen weeks · 48 contact hours · Three CLO-aligned modules. Track your progress below.</p>

      <Card className="mt-8 p-5 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Your progress</div>
          <div className="font-display text-2xl mt-1">{completedCount} / {topics.length} lessons</div>
        </div>
        <div className="h-2 w-48 rounded-full bg-muted overflow-hidden">
          <div className="h-full gradient-amber transition-all" style={{ width: `${(completedCount / topics.length) * 100}%` }} />
        </div>
      </Card>

      <div className="mt-12 space-y-12">
        {modules.map((mod) => (
          <section key={mod}>
            <h2 className="font-display text-2xl mb-5">{mod}</h2>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-secondary-foreground">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium w-12">#</th>
                    <th className="text-left px-4 py-3 font-medium">Topic</th>
                    <th className="text-center px-4 py-3 font-medium hidden md:table-cell">Weeks</th>
                    <th className="text-center px-4 py-3 font-medium hidden md:table-cell">Hours</th>
                    <th className="text-center px-4 py-3 font-medium hidden md:table-cell">CLO</th>
                    <th className="text-center px-4 py-3 font-medium w-16">Done</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.filter((t) => t.module === mod).map((t) => {
                    const done = progress[t.slug]?.completed;
                    return (
                      <tr key={t.slug} className="border-t border-border hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{t.order}</td>
                        <td className="px-4 py-3">
                          <Link to="/lessons/$slug" params={{ slug: t.slug }} className="font-medium text-foreground hover:text-accent-foreground story-link">
                            {t.title}
                          </Link>
                          <div className="text-xs text-muted-foreground mt-0.5">{t.short}</div>
                        </td>
                        <td className="px-4 py-3 text-center hidden md:table-cell">{t.weeks}</td>
                        <td className="px-4 py-3 text-center hidden md:table-cell">{t.hours}</td>
                        <td className="px-4 py-3 text-center hidden md:table-cell"><code className="text-xs">{t.clo}</code></td>
                        <td className="px-4 py-3 text-center">
                          {done ? <Check className="h-4 w-4 text-success inline" /> : <Circle className="h-4 w-4 text-muted-foreground/40 inline" />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
