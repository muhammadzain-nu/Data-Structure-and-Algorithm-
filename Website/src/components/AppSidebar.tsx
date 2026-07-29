import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { topics } from "@/data/topics";
import { useProgress } from "@/hooks/use-platform";
import { BookOpen, Check, Circle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const modules = ["Mid-term 1", "Mid-term 2", "Final"] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { progress } = useProgress();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return topics;
    return topics.filter((t) => t.title.toLowerCase().includes(needle) || t.short.toLowerCase().includes(needle));
  }, [q]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md gradient-amber text-sidebar-primary-foreground font-bold">
            <BookOpen className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base text-sidebar-foreground">FAST DSA</span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Learning Platform</span>
            </div>
          )}
        </Link>
        {!collapsed && (
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sidebar-foreground/50" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search topics…"
              className="h-8 pl-8 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
            />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {modules.map((mod) => {
          const list = filtered.filter((t) => t.module === mod);
          if (list.length === 0) return null;
          return (
            <SidebarGroup key={mod}>
              <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase tracking-widest text-[10px]">{mod}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {list.map((t) => {
                    const url = `/lessons/${t.slug}`;
                    const active = pathname === url;
                    const done = progress[t.slug]?.completed;
                    return (
                      <SidebarMenuItem key={t.slug}>
                        <SidebarMenuButton asChild isActive={active}>
                          <Link to="/lessons/$slug" params={{ slug: t.slug }} className="flex items-center gap-2">
                            {done ? <Check className="h-3.5 w-3.5 text-accent" /> : <Circle className="h-3.5 w-3.5 text-sidebar-foreground/40" />}
                            {!collapsed && <span className="truncate">{t.title}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
