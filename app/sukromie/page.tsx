"use client";

import { useEffect, useState } from "react";
import { DICTS, LANGS, type Lang } from "@/lib/i18n";
import { PRIVACY } from "@/lib/privacy";

export default function PrivacyPage() {
  const [lang, setLang] = useState<Lang>("sk");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("lang");
    let l: string | null = q;
    if (!l) {
      try { l = localStorage.getItem("lang"); } catch { /* storage unavailable */ }
    }
    if (l && (LANGS as readonly string[]).includes(l)) setLang(l as Lang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${PRIVACY[lang].title} – time2go`;
  }, [lang]);

  const p = PRIVACY[lang];
  const t = DICTS[lang];

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="logo" aria-hidden>⏱</span>
          <span>time<span className="accent">2</span>go</span>
        </a>
      </header>
      <main className="doc">
        <a className="back" href="/">← {t.back}</a>
        <h1>{p.title}</h1>
        <p className="lead">{p.intro}</p>
        {p.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </section>
        ))}
        <p className="updated">{p.updated}</p>
      </main>
    </div>
  );
}
