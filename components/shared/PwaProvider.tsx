"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = "dc-install-dismissed-at";
const DISMISS_TTL_DAYS = 7;

export function PwaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => console.warn("SW registration failed:", err));
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return (
    <>
      {children}
      <InstallPrompt />
    </>
  );
}

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed?
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // navigator.standalone is iOS-specific.
    if ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone) return;

    // Recently dismissed?
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_TTL_DAYS * 86400000) return;

    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    setIsIOS(ios);

    if (ios) {
      // iOS: show after 2.5s if user hasn't dismissed
      const t = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(t);
    }

    // Android / desktop Chrome
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setShow(false);
    } else {
      dismiss();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-[110px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[448px] bg-surface rounded-[18px] shadow-[0_20px_50px_rgba(15,23,42,0.25)] border border-border z-[60] overflow-hidden animate-[slideUp_0.4s_ease-out]">
      <button
        onClick={dismiss}
        aria-label="סגור"
        className="absolute top-2 left-2 w-7 h-7 rounded-full bg-bg flex items-center justify-center text-text-sub hover:text-text-main"
      >
        <X size={14} strokeWidth={2.5} />
      </button>

      <div className="p-4 pt-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-navy to-cyan flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            ✓
          </div>
          <div>
            <div className="text-[14px] font-bold text-navy">התקן את Double Check</div>
            <div className="text-[11px] text-text-sub">גישה מהירה ממסך הבית • עובד גם offline</div>
          </div>
        </div>

        {isIOS ? (
          <div className="bg-bg rounded-[12px] p-3 text-[12px] text-text-sub leading-relaxed">
            <div className="flex items-center gap-1.5 text-navy font-semibold mb-1">
              <Share size={14} className="text-cyan" />
              <span>הוראות התקנה ב-iPhone:</span>
            </div>
            <ol className="pr-4 space-y-0.5">
              <li>1. לחץ על אייקון השיתוף בסרגל ה-Safari</li>
              <li>2. בחר &quot;Add to Home Screen&quot;</li>
              <li>3. אשר → האייקון יתווסף למסך הבית</li>
            </ol>
          </div>
        ) : (
          <button
            onClick={install}
            className="w-full bg-gradient-to-br from-navy to-navy-light text-white py-3 rounded-[12px] font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(30,58,138,0.25)]"
          >
            <Download size={16} strokeWidth={2.5} />
            התקן עכשיו
          </button>
        )}
      </div>
    </div>
  );
}
