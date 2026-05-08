import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Double Check — וידוא משלוחים",
    short_name: "Double Check",
    description:
      "אפליקציה לוידוא משלוחים: צלם קבלה, סמן מה הגיע, שלח דוח פערים בלחיצה.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f6fb",
    theme_color: "#1e3a8a",
    lang: "he",
    dir: "rtl",
    categories: ["productivity", "shopping", "utilities"],
    icons: [
      { src: "/icon.svg", sizes: "32x32", type: "image/svg+xml" },
      { src: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "צלם קבלה חדשה",
        short_name: "צלם",
        url: "/delivery/new",
        description: "פתח את המצלמה לצילום קבלה",
      },
      {
        name: "Inbox Magic",
        short_name: "Inbox",
        url: "/inbox",
        description: "כתובת המייל הקסומה שלך",
      },
      {
        name: "היסטוריה",
        short_name: "היסטוריה",
        url: "/history",
        description: "כל המשלוחים הקודמים",
      },
    ],
  };
}
