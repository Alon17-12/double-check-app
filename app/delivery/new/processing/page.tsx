"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, X } from "lucide-react";

const STAGES = [
  { id: "upload", label: "תמונה הועלתה ועובדה", duration: 1200 },
  { id: "store", label: "מזהה חנות", duration: 1200 },
  { id: "extract", label: "מחלץ פריטים", duration: 2200 },
  { id: "math", label: "בודק חישוב מתמטי", duration: 1000 },
  { id: "finish", label: "מסיים", duration: 600 },
];

export default function OcrProcessingPage() {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < STAGES.length; i++) {
        if (cancelled) return;
        setActiveIdx(i);
        await new Promise((r) => setTimeout(r, STAGES[i].duration));
      }
      if (!cancelled) {
        // OCR not yet wired to Gemini — go back to home for now.
        router.push("/?ocr=demo");
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const progressPct = Math.round(((activeIdx + 0.5) / STAGES.length) * 100);

  return (
    <div className="mx-auto max-w-[480px] min-h-screen bg-gradient-to-b from-navy to-navy-dark text-white relative overflow-hidden md:my-6 md:rounded-[28px] md:shadow-[0_30px_80px_rgba(0,0,0,0.4)] md:min-h-[calc(100vh-48px)]">
      {/* ambient glow */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-cyan/25 blur-3xl pointer-events-none" />

      <div className="relative px-6 py-8 flex flex-col min-h-screen">
        {/* TOP */}
        <div className="flex justify-between items-center mb-8">
          <div className="font-display text-lg font-bold">
            Double<span className="text-cyan">Check</span>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
          >
            <X size={14} /> ביטול
          </button>
        </div>

        {/* RECEIPT PREVIEW */}
        <ScanningReceipt />

        {/* PROGRESS */}
        <div className="mt-6">
          <div className="text-center mb-6">
            <h2 className="text-[22px] font-bold mb-1.5 tracking-tight">
              מחלץ פריטים מהקבלה
            </h2>
            <p className="text-[13px] opacity-75">זה לוקח בערך 5–10 שניות</p>
          </div>

          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-l from-green to-cyan rounded-full transition-[width] duration-500 shadow-[0_0_12px_rgba(56,196,242,0.6)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            {STAGES.map((s, i) => {
              const done = i < activeIdx;
              const active = i === activeIdx;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border text-sm transition-all ${
                    done
                      ? "bg-green/10 border-green/30"
                      : active
                        ? "bg-cyan/10 border-cyan/40 shadow-[0_4px_14px_rgba(56,196,242,0.2)]"
                        : "bg-white/5 border-white/10 opacity-50"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done ? "bg-green" : active ? "bg-cyan" : "bg-white/10"
                    }`}
                  >
                    {done ? (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    ) : active ? (
                      <span
                        className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white"
                        style={{ animation: "spin 0.8s linear infinite" }}
                      />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-white/30" />
                    )}
                  </div>
                  <span className="flex-1 font-medium">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI HINT */}
        <div className="mt-auto pt-6">
          <div className="px-4 py-3.5 bg-cyan/10 border border-cyan/20 rounded-2xl flex gap-3 items-start text-xs leading-relaxed">
            <Sparkles size={20} className="text-cyan flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-cyan">בינה מלאכותית בעבודה.</strong>
              {" "}Gemini מחלץ את הפריטים בדיוק של 95%+. תוכל לערוך הכל אחרי שזה ייגמר.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanningReceipt() {
  return (
    <div className="relative w-[70%] max-w-[240px] aspect-[3/4] mx-auto bg-white/95 rounded-lg p-4 shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-[2]">
      <div
        className="text-center text-navy font-bold text-[11px] mb-1"
        style={{ fontFamily: "Heebo, sans-serif" }}
      >
        רמי לוי
      </div>
      <div className="text-center text-[7px] opacity-70 mb-2 text-slate-700" style={{ fontFamily: "Heebo, sans-serif" }}>
        הזמנה 2019794
      </div>
      <div className="border-t border-dashed border-slate-400 mb-1" />
      <div style={{ fontFamily: "Courier New, monospace", fontSize: 8, color: "#1e293b", lineHeight: 1.5 }}>
        {[
          ["עגבניה", "6.11"],
          ["מלפפון", "5.68"],
          ["פלפל אדום", "9.29"],
          ["בצל יבש", "3.56"],
          ["לימון", "9.06"],
          ["אורז סוגת", "15.00"],
          ["סלט מטבוחה", "14.90"],
          ["פסטרמה 600ג", "27.40"],
          ["חומוס צבר", "13.30"],
          ["מגבונים", "18.90"],
        ].map(([n, p]) => (
          <div key={n} className="flex justify-between py-[1.5px]">
            <span style={{ fontFamily: "Heebo, sans-serif" }}>{n}</span>
            <span>{p}</span>
          </div>
        ))}
        <div className="border-t border-dashed border-slate-400 my-1" />
        <div className="flex justify-between font-bold">
          <span style={{ fontFamily: "Heebo, sans-serif" }}>סה&quot;כ</span>
          <span>₪373.77</span>
        </div>
      </div>

      {/* Scanning line */}
      <div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan to-transparent shadow-[0_0_30px_var(--color-cyan)] rounded"
        style={{ animation: "scan-progress 2.2s ease-in-out infinite alternate" }}
      />
    </div>
  );
}
