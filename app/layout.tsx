import type { Metadata, Viewport } from "next";
import { Heebo, Fredoka } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Double Check — וידוא משלוחים",
  description:
    "אפליקציה לוידוא משלוחים אונליין — צלם קבלה, סמן מה הגיע, שלח דוח פערים בלחיצת כפתור.",
  applicationName: "Double Check",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Double Check",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-text-main">{children}</body>
    </html>
  );
}
