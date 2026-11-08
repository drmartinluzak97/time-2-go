import type { Lang } from "@/lib/i18n";

// Simplified inline SVG flags (emoji flags don't render on Windows).
export default function Flag({ lang }: { lang: Lang }) {
  const common = { width: 24, height: 16, viewBox: "0 0 30 20", "aria-hidden": true, className: "flag" } as const;
  switch (lang) {
    case "sk":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#ee1c25" />
          <rect width="30" height="13.33" fill="#0b4ea2" />
          <rect width="30" height="6.67" fill="#fff" />
          <path d="M6 4.5h7v6.2c0 3-3.5 4.6-3.5 4.6S6 13.7 6 10.7z" fill="#ee1c25" stroke="#fff" strokeWidth="0.8" />
          <path d="M9.5 6v6.5M8 7.6h3M7.4 9.4h4.2" stroke="#fff" strokeWidth="0.9" />
          <path d="M6.6 12.4c1-1 1.9-1 2.9 0 1-1 1.9-1 2.9 0" fill="#0b4ea2" />
        </svg>
      );
    case "cs":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#d7141a" />
          <rect width="30" height="10" fill="#fff" />
          <path d="M0 0l15 10L0 20z" fill="#11457e" />
        </svg>
      );
    case "de":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#ffce00" />
          <rect width="30" height="13.33" fill="#dd0000" />
          <rect width="30" height="6.67" fill="#000" />
        </svg>
      );
    case "hu":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#436f4d" />
          <rect width="30" height="13.33" fill="#fff" />
          <rect width="30" height="6.67" fill="#cd2a3e" />
        </svg>
      );
    case "pl":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#dc143c" />
          <rect width="30" height="10" fill="#fff" />
        </svg>
      );
    case "en":
      return (
        <svg {...common}>
          <clipPath id="uk-clip"><rect width="30" height="20" /></clipPath>
          <g clipPath="url(#uk-clip)">
            <rect width="30" height="20" fill="#012169" />
            <path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
            <path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" strokeWidth="1.5" />
            <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" />
            <path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3.4" />
          </g>
        </svg>
      );
  }
}
