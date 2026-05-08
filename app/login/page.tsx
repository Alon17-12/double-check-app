"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const errorCode = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-dark via-navy to-cyan flex items-center justify-center p-5 text-white">
      <div className="w-full max-w-[400px]">
        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="inline-flex w-20 h-20 rounded-[22px] bg-white/15 backdrop-blur-md border-2 border-white/30 items-center justify-center text-4xl font-bold mb-5">
            ✓
          </div>
          <div className="font-display text-[36px] font-bold tracking-tight mb-1">
            Double<span className="text-cyan">Check</span>
          </div>
          <p className="text-[14px] opacity-85 leading-relaxed">
            וודא משלוחים בלחיצת כפתור.
            <br />
            מצא פערים, חסוך כסף.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white text-text-main rounded-[22px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <h1 className="text-[18px] font-bold text-navy text-center mb-1.5">
            התחבר כדי להמשיך
          </h1>
          <p className="text-[12px] text-text-sub text-center mb-5 leading-relaxed">
            התחברות מהירה עם חשבון Google.
            <br />
            המידע שלך פרטי ומאובטח.
          </p>

          {errorCode && (
            <div className="bg-coral/10 border border-coral/30 text-coral rounded-[12px] px-3 py-2.5 text-[12px] mb-4 text-center">
              שגיאה בהתחברות: {decodeURIComponent(errorCode)}. נסה שוב.
            </div>
          )}

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full bg-white border-[1.5px] border-border hover:border-cyan hover:bg-bg active:scale-[0.99] py-3.5 rounded-[14px] font-semibold text-[14px] text-text-main flex items-center justify-center gap-3 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-text-sub border-t-transparent rounded-full"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
                מעביר ל-Google...
              </>
            ) : (
              <>
                <GoogleIcon />
                התחבר עם Google
              </>
            )}
          </button>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] text-text-sub">
            <Feature emoji="📷" label="צלם קבלה" />
            <Feature emoji="📨" label="קליטה במייל" />
            <Feature emoji="🌎" label="גם חו״ל" />
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] opacity-70">
          בהתחברות אתה מאשר שמירה של נתוני המשלוחים שלך באופן מאובטח.
          <br />
          אין שיתוף עם צד שלישי. אפשר למחוק חשבון בכל עת.
        </p>
      </div>
    </div>
  );
}

function Feature({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="bg-bg rounded-lg py-2">
      <div className="text-base mb-0.5">{emoji}</div>
      <div className="font-semibold">{label}</div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
