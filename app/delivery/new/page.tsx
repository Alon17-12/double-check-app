"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense, useRef, useState } from "react";
import {
  ChevronLeft,
  Zap,
  Image as ImageIcon,
  Repeat,
  FileText,
  Upload,
  X,
  ArrowLeft,
  Pencil,
} from "lucide-react";

type Mode = "receipt" | "pdf" | "manual";

function isMode(value: string | null): value is Mode {
  return value === "receipt" || value === "pdf" || value === "manual";
}

export default function CapturePage() {
  return (
    <Suspense fallback={null}>
      <CaptureInner />
    </Suspense>
  );
}

function CaptureInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<Mode>(isMode(initialMode) ? initialMode : "receipt");

  const handleCapture = () => router.push("/delivery/new/processing");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePdf = (file: File | null | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("אנא בחר קובץ PDF בלבד");
      return;
    }
    setPdfFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handlePdf(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      className={`mx-auto max-w-[480px] min-h-screen relative overflow-hidden md:my-6 md:rounded-[28px] md:max-h-[calc(100vh-48px)] ${
        mode === "receipt" ? "bg-black text-white" : "bg-bg text-text-main"
      }`}
    >
      {/* TOP BAR */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 px-4 pt-4 pb-4 flex justify-between items-center ${
          mode === "receipt" ? "bg-gradient-to-b from-black/60 to-transparent" : "bg-surface border-b border-border"
        }`}
        style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
      >
        <button
          onClick={() => router.back()}
          aria-label="חזרה"
          className={`w-[42px] h-[42px] rounded-full flex items-center justify-center ${
            mode === "receipt"
              ? "bg-black/50 backdrop-blur-md border border-white/10 text-white"
              : "bg-bg text-navy"
          }`}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="text-base font-bold tracking-tight">
          {mode === "receipt" ? "צלם קבלה" : mode === "pdf" ? "העלה PDF" : "הוספה ידנית"}
        </div>
        {mode === "receipt" ? (
          <button
            aria-label="פלאש"
            className="w-[42px] h-[42px] rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
          >
            <Zap size={20} strokeWidth={2} />
          </button>
        ) : (
          <span className="w-[42px]" />
        )}
      </div>

      {/* MODE-SPECIFIC CONTENT */}
      {mode === "receipt" && (
        <CameraMode previewUrl={previewUrl} />
      )}
      {mode === "pdf" && (
        <PdfMode
          file={pdfFile}
          isDragging={isDragging}
          onPick={() => pdfInputRef.current?.click()}
          onClear={() => setPdfFile(null)}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        />
      )}
      {mode === "manual" && <ManualMode onContinue={handleCapture} />}

      {/* HIDDEN INPUTS */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImage}
        className="hidden"
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={(e) => handlePdf(e.target.files?.[0])}
        className="hidden"
      />

      {/* BOTTOM CONTROLS */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 px-6 pt-6 ${
          mode === "receipt"
            ? "bg-gradient-to-t from-black/85 to-transparent"
            : "bg-surface border-t border-border"
        }`}
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
      >
        {/* MODE TABS */}
        <div className="flex justify-center gap-1 mb-4">
          <ModeTab active={mode === "receipt"} onClick={() => setMode("receipt")} icon="📷" label="קבלה" />
          <ModeTab active={mode === "pdf"} onClick={() => setMode("pdf")} icon="📄" label="PDF" />
          <ModeTab active={mode === "manual"} onClick={() => setMode("manual")} icon="✏️" label="ידני" />
        </div>

        {/* MODE-SPECIFIC ACTION ROW */}
        {mode === "receipt" && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="גלריה"
              className="w-[52px] h-[52px] rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center text-white"
            >
              <ImageIcon size={22} strokeWidth={2} />
            </button>
            <button
              onClick={handleCapture}
              aria-label="צלם"
              className="w-[78px] h-[78px] rounded-full bg-white border-[5px] border-white/30 active:scale-95 transition shadow-[0_0_0_3px_rgba(56,196,242,0.5)]"
            />
            <button
              aria-label="המצלמה השנייה"
              className="w-[52px] h-[52px] rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center text-white"
            >
              <Repeat size={22} strokeWidth={2} />
            </button>
          </div>
        )}

        {mode === "pdf" && (
          <div className="flex gap-2">
            <button
              onClick={() => pdfInputRef.current?.click()}
              className="flex-shrink-0 px-5 py-3.5 bg-bg text-navy rounded-[14px] font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              {pdfFile ? "החלף" : "בחר קובץ"}
            </button>
            <button
              disabled={!pdfFile}
              onClick={handleCapture}
              className="flex-1 bg-gradient-to-br from-navy to-navy-light text-white py-3.5 rounded-[14px] font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(30,58,138,0.25)] disabled:opacity-40 disabled:shadow-none"
            >
              עבד את ה-PDF
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/* CAMERA MODE                                  */
/* ─────────────────────────────────────────── */
function CameraMode({ previewUrl }: { previewUrl: string | null }) {
  return (
    <>
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-cyan border border-cyan/30">
        📄 דף 1 מתוך 1 (לחץ + להוסיף)
      </div>
      <div className="relative w-full h-screen md:h-[calc(100vh-48px)] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <Image src={previewUrl} alt="תצוגה מקדימה" fill style={{ objectFit: "contain" }} unoptimized />
        ) : (
          <ReceiptMockup />
        )}

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

        <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur-lg px-4 py-2.5 rounded-full text-xs flex items-center gap-2 border border-cyan/30 whitespace-nowrap z-[5] text-white">
          <span className="w-2 h-2 rounded-full bg-cyan" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
          <span>החזק יציב — הקבלה מזוהה</span>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────── */
/* PDF UPLOAD MODE                              */
/* ─────────────────────────────────────────── */
function PdfMode({
  file,
  isDragging,
  onPick,
  onClear,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  file: File | null;
  isDragging: boolean;
  onPick: () => void;
  onClear: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div className="pt-[calc(72px+env(safe-area-inset-top))] pb-[200px] px-5 min-h-screen md:min-h-[calc(100vh-48px)] flex flex-col">
      {!file ? (
        <button
          onClick={onPick}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex-1 my-6 rounded-[24px] border-[2px] border-dashed flex flex-col items-center justify-center gap-4 px-6 py-12 transition-all ${
            isDragging
              ? "bg-cyan/[0.08] border-cyan scale-[1.01]"
              : "bg-surface border-[rgba(30,58,138,0.25)] hover:border-cyan hover:bg-cyan/[0.03]"
          }`}
        >
          <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-cyan to-cyan-dark flex items-center justify-center shadow-[0_12px_32px_rgba(56,196,242,0.35)]">
            <Upload size={36} className="text-white" strokeWidth={2} />
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-navy mb-1.5">
              {isDragging ? "שחרר את הקובץ כאן" : "העלה קובץ PDF"}
            </div>
            <div className="text-[13px] text-text-sub leading-relaxed">
              גרור לכאן או לחץ לבחירת קובץ מהמחשב
              <br />
              <span className="text-text-muted text-[11px]">תומך ב-PDF עד 10MB</span>
            </div>
          </div>
        </button>
      ) : (
        <div className="flex-1 my-6 flex flex-col">
          {/* PDF Preview Card */}
          <div className="bg-surface rounded-[20px] border border-border p-5 shadow-[0_4px_14px_rgba(15,23,42,0.08)]">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-coral to-[#d63384] flex items-center justify-center flex-shrink-0 shadow-md">
                <FileText size={28} className="text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-navy truncate">{file.name}</div>
                <div className="text-[11px] text-text-sub mt-0.5">
                  {formatBytes(file.size)} • {file.type.split("/").pop()?.toUpperCase()}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-green font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green" />
                  מוכן לעיבוד
                </div>
              </div>
              <button
                onClick={onClear}
                aria-label="הסר קובץ"
                className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center text-text-sub hover:bg-coral/10 hover:text-coral transition flex-shrink-0"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* What happens next */}
          <div className="mt-4 p-4 bg-cyan/[0.06] border border-cyan/20 rounded-[16px]">
            <div className="text-[13px] font-bold text-navy mb-2 flex items-center gap-1.5">
              ✨ מה יקרה בלחיצה על &quot;עבד את ה-PDF&quot;?
            </div>
            <ol className="space-y-1.5 text-[12px] text-text-sub leading-relaxed pr-4">
              <li>1. הקובץ יישלח ל-Gemini Vision לחילוץ פריטים</li>
              <li>2. כל פריט יזוהה אוטומטית עם מחיר וכמות</li>
              <li>3. תוכל לסקור ולערוך לפני שתתחיל לסמן את המשלוח</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────── */
/* MANUAL MODE (placeholder for now)            */
/* ─────────────────────────────────────────── */
function ManualMode({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="pt-[calc(72px+env(safe-area-inset-top))] pb-[180px] px-5 min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-navy to-navy-light flex items-center justify-center shadow-[0_12px_32px_rgba(30,58,138,0.25)]">
        <Pencil size={36} className="text-white" strokeWidth={2} />
      </div>
      <div className="text-center max-w-[320px]">
        <div className="text-lg font-bold text-navy mb-2">הוספה ידנית</div>
        <div className="text-[13px] text-text-sub leading-relaxed">
          תוכל להזין פריטים ידנית — שימושי כשאין קבלה צילומית או מייל. הוסף פריט אחד בכל פעם, סמן את החנות והסכום הכולל.
        </div>
      </div>
      <button
        onClick={onContinue}
        className="mt-4 px-6 py-3 bg-bg text-navy rounded-[12px] font-semibold text-sm border border-border"
      >
        המשך עם דמו (יישום מלא ב-Phase 2)
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/* HELPERS                                       */
/* ─────────────────────────────────────────── */
function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
        active ? "bg-cyan text-slate-900" : "bg-bg text-text-sub border border-border hover:bg-[rgba(30,58,138,0.04)]"
      }`}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
