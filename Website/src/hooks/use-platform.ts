import { useEffect, useState, useCallback } from "react";

const KEY = "fast-dsa-progress-v1";
const THEME_KEY = "fast-dsa-theme-v1";

type Progress = Record<string, { completed?: boolean; quizScore?: number; visitedAt?: number }>;

function read(): Progress {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => { setProgress(read()); }, []);

  const save = useCallback((next: Progress) => {
    setProgress(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }, []);

  const markVisited = useCallback((slug: string) => {
    const cur = read();
    cur[slug] = { ...cur[slug], visitedAt: Date.now() };
    save(cur);
  }, [save]);

  const markCompleted = useCallback((slug: string, score?: number) => {
    const cur = read();
    cur[slug] = { ...cur[slug], completed: true, quizScore: score, visitedAt: Date.now() };
    save(cur);
  }, [save]);

  return { progress, markVisited, markCompleted };
}

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(THEME_KEY)) as "light" | "dark" | null;
    const initial = saved ?? (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      try { localStorage.setItem(THEME_KEY, next); } catch {}
      return next;
    });
  }, []);

  return { theme, toggle };
}
