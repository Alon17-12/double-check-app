"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Camera, AlertCircle } from "lucide-react";

export interface CameraStreamHandle {
  /**
   * Captures the current video frame.
   * Returns null if the stream isn't ready (caller can fall back to a native picker).
   */
  capture: () => Promise<File | null>;
}

type Status = "idle" | "starting" | "ready" | "denied" | "unavailable";

interface Props {
  /** When true, the component pauses & releases the camera (e.g. after capture). */
  paused?: boolean;
}

export const CameraStream = forwardRef<CameraStreamHandle, Props>(function CameraStream(
  { paused = false },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (paused) {
      stopStream();
      return;
    }

    let cancelled = false;

    async function start() {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setStatus("unavailable");
        return;
      }

      setStatus("starting");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to be ready to play before marking ready.
          await videoRef.current.play().catch(() => {});
          setStatus("ready");
        }
      } catch (err) {
        if (cancelled) return;
        const name = (err as { name?: string })?.name;
        if (name === "NotAllowedError" || name === "SecurityError") {
          setStatus("denied");
        } else {
          setStatus("unavailable");
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      async capture() {
        const video = videoRef.current;
        if (!video || status !== "ready") return null;
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (!w || !h) return null;

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(video, 0, 0, w, h);

        return new Promise<File | null>((resolve) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(null);
              resolve(new File([blob], `receipt-${Date.now()}.jpg`, { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.92,
          );
        });
      },
    }),
    [status],
  );

  return (
    <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
      {/* Live video — shown when stream is ready */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Loading state */}
      {(status === "starting" || status === "idle") && !paused && (
        <div className="relative z-1 text-center text-white/70">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-white/20 border-t-cyan animate-spin" />
          <div className="text-[13px] font-medium">פותח מצלמה...</div>
        </div>
      )}

      {/* Permission denied */}
      {status === "denied" && (
        <FallbackMessage
          icon={<AlertCircle size={28} className="text-yellow" />}
          title="אין גישה למצלמה"
          desc="הענק לדפדפן הרשאת מצלמה בהגדרות, או השתמש בכפתור 'גלריה' כדי להעלות תמונה קיימת."
        />
      )}

      {/* No camera hardware */}
      {status === "unavailable" && (
        <FallbackMessage
          icon={<Camera size={28} className="text-white/60" />}
          title="המצלמה לא זמינה"
          desc="במחשב — השתמש בכפתורי גלריה / קובץ כדי להעלות צילום קבלה."
        />
      )}
    </div>
  );
});

function FallbackMessage({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="relative z-1 text-center text-white px-6 max-w-[300px]">
      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-[15px] font-bold mb-1.5">{title}</div>
      <div className="text-[12px] text-white/70 leading-relaxed">{desc}</div>
    </div>
  );
}
