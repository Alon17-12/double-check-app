"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, Zap, Image as ImageIcon, Repeat } from "lucide-react";

export default function CapturePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"receipt" | "pdf" | "manual">("receipt");

  const handleCapture = () => {
    // Demo: just trigger the loading screen
    router.push("/delivery/new/processing");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="mx-auto max-w-[480px] min-h-screen bg-black text-white relative overflow-hidden md:my-6 md:rounded-[28px] md:max-h-[calc(100vh-48px)]">
      {/* TOP BAR */}
      <div
        className="absolute top-0 left-0 right-0 z-10 px-4 pt-4 pb-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent"
        style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
      >
        <button
          onClick={() => router.back()}
          aria-label="חזרה"
          className="w-[42px] h-[42px] rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="text-base font-bold tracking-tight">צלם קבלה</div>
        <button
          aria-label="פלאש"
          className="w-[42px] h-[42px] rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center"
        >
          <Zap size={20} strokeWidth={2} />
        </button>
      </div>

      {/* PAGES INDICATOR */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-cyan border border-cyan/30">
        📄 דף 1 מתוך 1 (לחץ + להוסיף)
      </div>

      {/* CAMERA VIEW */}
      <div className="relative w-full h-screen md:h-[calc(100vh-48px)] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <Image src={previewUrl} alt="תצוגה מקדימה" fill style={{ objectFit: "contain" }} unoptimized />
        ) : (
          <ReceiptMockup />
        )}

        {/* Scan frame */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] max-w-[360px] aspect-[3/4] pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-[3px] border-cyan border-r-0 border-b-0 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-[3px] border-cyan border-l-0 border-b-0 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-[3px] border-cyan border-r-0 border-t-0 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-[3px] border-cyan border-l-0 border-t-0 rounded-br-lg" />
          <div
            className="absolute left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-cyan to-transparent shadow-[0_0_12px_var(--color-cyan)]"
            style={{ animation: "scan-progress 2.5s ease-in-out infinite alternate" }}
          />
        </div>

        {/* Tip banner */}
        <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur-lg px-4 py-2.5 rounded-full text-xs flex items-center gap-2 border border-cyan/30 whitespace-nowrap z-[5]">
          <span className="w-2 h-2 rounded-full bg-cyan" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
          <span>החזק יציב — הקבלה מזוהה</span>
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-6 pt-6 bg-gradient-to-t from-black/85 to-transparent"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-center gap-1 mb-4">
          {(["receipt", "pdf", "manual"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3.5 py-2 rounded-full text-[11px] font-semibold transition-colors ${
                mode === m
                  ? "bg-cyan text-slate-900"
                  : "bg-white/10 text-white/70"
              }`}
            >
              {m === "receipt" ? "קבלה" : m === "pdf" ? "PDF" : "ידני"}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="גלריה"
            className="w-[52px] h-[52px] rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center"
          >
            <ImageIcon size={22} strokeWidth={2} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />

          <button
            onClick={handleCapture}
            aria-label="צלם"
            className="w-[78px] h-[78px] rounded-full bg-white border-[5px] border-white/30 active:scale-95 transition shadow-[0_0_0_3px_rgba(56,196,242,0.5)]"
          />

          <button
            aria-label="המצלמה השנייה"
            className="w-[52px] h-[52px] rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center"
          >
            <Repeat size={22} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* Demo receipt — shown until user captures */
function ReceiptMockup() {
  return (
    <div
      className="w-[76%] max-w-[320px] bg-white text-slate-800 px-3.5 py-4 rounded shadow-[0_30px_60px_rgba(0,0,0,0.6)] -rotate-[1.5deg]"
      style={{ fontFamily: "Courier New, monospace", fontSize: 9, lineHeight: 1.5 }}
    >
      <div className="text-center text-navy font-bold text-[13px] mb-1" style={{ fontFamily: "Heebo, sans-serif" }}>
        רמי לוי
      </div>
      <div className="text-center text-[8px] text-slate-500 mb-1" style={{ fontFamily: "Heebo, sans-serif" }}>
        סניף שילת • הזמנה 2019794
      </div>
      <div className="border-t border-dashed border-slate-400 my-1" />
      {[
        ["עגבניה 1.04 ק\"ג", "6.11"],
        ["מלפפון 0.96 ק\"ג", "5.68"],
        ["פלפל אדום 1.04", "9.29"],
        ["בצל יבש 0.91", "3.56"],
        ["לימון 1.02 ק\"ג", "9.06"],
        ["אורז סוגת 1 ק\"ג", "15.00"],
        ["סלט מטבוחה 500ג", "14.90"],
        ["פסטרמה 600ג", "27.40"],
        ["חומוס צבר 400ג", "13.30"],
        ["מגבונים 400 יח׳", "18.90"],
      ].map(([n, p]) => (
        <div key={n} className="flex justify-between py-[1px] border-b border-dashed border-slate-300 last:border-0">
          <span style={{ fontFamily: "Heebo, sans-serif" }}>{n}</span>
          <span>{p}</span>
        </div>
      ))}
      <div className="border-t border-dashed border-slate-400 my-1" />
      <div className="flex justify-between font-bold">
        <span style={{ fontFamily: "Heebo, sans-serif" }}>סה&quot;כ כולל מע&quot;מ</span>
        <span>₪373.77</span>
      </div>
    </div>
  );
}
