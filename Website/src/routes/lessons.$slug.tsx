import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { getLesson } from "@/data/lessons";
import { topics } from "@/data/topics";
import { LessonRenderer } from "@/components/LessonRenderer";
import { useProgress } from "@/hooks/use-platform";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/lessons/$slug")({
  loader: ({ params }) => {
    const lesson = getLesson(params.slug);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.lesson.title} — FAST DSA` },
          { name: "description", content: loaderData.lesson.tagline },
          { property: "og:title", content: `${loaderData.lesson.title} — FAST DSA` },
          { property: "og:description", content: loaderData.lesson.tagline },
        ]
      : [],
  }),
  component: LessonPage,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h1 className="font-display text-3xl">Lesson not found</h1>
      <Link to="/" className="mt-4 inline-block text-accent-foreground underline">Back to home</Link>
    </div>
  ),
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const { markVisited } = useProgress();
  useEffect(() => { markVisited(lesson.slug); }, [lesson.slug, markVisited]);

  const idx = topics.findIndex((t) => t.slug === lesson.slug);
  const prev = idx > 0 ? topics[idx - 1] : null;
  const next = idx < topics.length - 1 ? topics[idx + 1] : null;

  return (
    <div className="px-6 md:px-12 lg:px-16 py-10 max-w-5xl mx-auto">
      <LessonRenderer lesson={lesson} />
      <nav className="mt-20 flex items-center justify-between gap-4 border-t border-border pt-8">
        {prev ? (
          <Button asChild variant="ghost" className="h-auto p-3 text-left flex-col items-start max-w-xs">
            <Link to="/lessons/$slug" params={{ slug: prev.slug }}>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1"><ChevronLeft className="h-3 w-3" /> Previous</span>
              <span className="font-display text-sm mt-1 truncate">{prev.title}</span>
            </Link>
          </Button>
        ) : <span />}
        {next ? (
          <Button asChild variant="ghost" className="h-auto p-3 text-right flex-col items-end max-w-xs">
            <Link to="/lessons/$slug" params={{ slug: next.slug }}>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">Next <ChevronRight className="h-3 w-3" /></span>
              <span className="font-display text-sm mt-1 truncate">{next.title}</span>
            </Link>
          </Button>
        ) : <span />}
      </nav>
    </div>
  );
}
