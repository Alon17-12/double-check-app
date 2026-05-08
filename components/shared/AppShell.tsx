"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Clock, Mail, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  /** Hide bottom nav (e.g. on full-screen capture/loading) */
  hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <div className="mx-auto max-w-[480px] min-h-screen bg-bg relative md:my-6 md:rounded-[28px] md:overflow-hidden md:shadow-[0_30px_80px_rgba(15,23,42,0.15)] md:min-h-[calc(100vh-48px)]">
      <main className={cn("min-h-screen", !hideNav && "pb-[100px]")}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/", label: "בית", icon: Home, match: (p: string) => p === "/" },
    { href: "/history", label: "היסטוריה", icon: Clock, match: (p: string) => p.startsWith("/history") },
    { href: "/inbox", label: "Inbox 📨", icon: Mail, match: (p: string) => p.startsWith("/inbox") },
    { href: "/settings", label: "הגדרות", icon: Settings, match: (p: string) => p.startsWith("/settings") },
  ];

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface border-t border-border flex px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-50"
      aria-label="ניווט ראשי"
    >
      {items.map((item) => {
        const isActive = item.match(pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center gap-[3px] py-2 px-1 text-[10px] font-semibold transition-colors",
              isActive ? "text-navy" : "text-text-muted hover:text-navy-light",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={22} strokeWidth={2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function BackButton({ href, onClick, label = "חזרה" }: { href?: string; onClick?: () => void; label?: string }) {
  const router = useRouter();
  const handle = () => {
    if (onClick) return onClick();
    if (href) return router.push(href);
    router.back();
  };
  return (
    <button
      onClick={handle}
      aria-label={label}
      className="w-9 h-9 rounded-[10px] bg-bg flex items-center justify-center text-navy hover:bg-[rgba(30,58,138,0.08)] transition-colors"
    >
      <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
