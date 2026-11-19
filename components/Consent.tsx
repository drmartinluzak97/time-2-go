"use client";

import "klaro/dist/klaro.min.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { useEffect, useRef, useState } from "react";
import { CONSENT_TEXTS, type ConsentTexts } from "@/lib/consent";

/**
 * Cookie consent (Klaro). Optional services – Umami and Vercel Analytics –
 * load only after consent. The consent cookie is per site on purpose: Klaro
 * drops unknown services when saving, so sharing one cookie between
 * martinluzak.sk and its subdomains would wipe each other's choices.
 */

const STORAGE_NAME = "time2go_consent";
const OPEN_EVENT = "consent:open";

const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://martin-luzak.vercel.app/script.js";

type Service = "umami" | "vercel-analytics";
type Consents = Partial<Record<Service, boolean>>;

interface KlaroManager {
  confirmed: boolean;
  consents: Record<string, boolean>;
  watch(w: { update(obj: unknown, name: string, data: { consents?: Record<string, boolean> }): void }): void;
  unwatch(w: unknown): void;
}
interface KlaroModule {
  render(config: unknown, opts?: unknown): void;
  show(config: unknown, modal?: boolean): void;
  getManager(config: unknown): KlaroManager;
}

/** Opens the consent settings (used by the footer link). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function currentLang(): string {
  const l = (document.documentElement.lang || "sk").slice(0, 2).toLowerCase();
  return l in CONSENT_TEXTS ? l : "en";
}

function buildConfig(lang: string) {
  const t: ConsentTexts = CONSENT_TEXTS[lang] ?? CONSENT_TEXTS.en;
  const services = [
    ...(UMAMI_ID ? [{ name: "umami", purposes: ["analytics"] }] : []),
    { name: "vercel-analytics", purposes: ["analytics"] },
  ];
  const translation: Record<string, unknown> = {
    ...(t.ui ?? {}),
    decline: t.buttons.decline,
    ok: t.buttons.ok,
    consentNotice: {
      ...((t.ui?.consentNotice as object) ?? {}),
      description: t.notice,
      learnMore: t.buttons.learnMore,
      "learnMore|capitalize": t.buttons.learnMore,
    },
    privacyPolicyUrl: t.privacyUrl,
    purposes: { analytics: t.analytics },
    umami: t.umami,
    "vercel-analytics": t.vercel,
  };
  return {
    version: 1,
    elementID: "klaro",
    storageMethod: "cookie",
    storageName: STORAGE_NAME,
    cookieExpiresAfterDays: 365,
    lang,
    fallbackLang: "en",
    htmlTexts: false,
    groupByPurpose: true,
    default: false,
    mustConsent: false,
    acceptAll: true,
    hideDeclineAll: false,
    noticeAsModal: false,
    disablePoweredBy: true,
    styling: {
      theme: ["bottom", "wide"],
      "button-text-color": "var(--accent-text)",
      dark1: "var(--panel)",
      dark2: "var(--muted)",
      dark3: "var(--muted)",
      light1: "var(--text)",
      light2: "var(--muted)",
      light3: "var(--muted)",
      white1: "var(--text)",
      white2: "var(--muted)",
      white3: "var(--muted)",
      green1: "var(--accent)",
      green2: "var(--accent)",
      green3: "var(--accent)",
      blue1: "var(--muted)",
      blue2: "var(--accent)",
      blue3: "var(--accent)",
      "font-family": "inherit",
      "title-font-family": "inherit",
      "border-radius": "var(--radius)",
    },
    translations: { [lang]: translation },
    services,
  };
}

export function Consent() {
  const [consents, setConsents] = useState<Consents>({});
  const [lang, setLang] = useState<string | null>(null);
  const klaroRef = useRef<KlaroModule | null>(null);
  const configRef = useRef<ReturnType<typeof buildConfig> | null>(null);
  const savedRef = useRef<Consents>({});

  // Follow the page language (<html lang>), which the app updates on switch.
  useEffect(() => {
    setLang(currentLang());
    const obs = new MutationObserver(() => setLang(currentLang()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!lang) return;
    let cancelled = false;
    const config = buildConfig(lang);
    configRef.current = config;
    const watcher = {
      update(_o: unknown, name: string, data: { consents?: Record<string, boolean> }) {
        if (name !== "saveConsents" || !data.consents) return;
        const next = data.consents as Consents;
        // Loaded scripts cannot be unloaded: reload when consent is withdrawn.
        const revoked = (Object.keys(savedRef.current) as Service[]).some((k) => savedRef.current[k] && !next[k]);
        savedRef.current = { ...next };
        if (revoked) window.location.reload();
        else setConsents({ ...next });
      },
    };
    import("klaro/dist/klaro-no-css").then((mod) => {
      if (cancelled) return;
      const klaro = ((mod as { default?: KlaroModule }).default ?? mod) as KlaroModule;
      klaroRef.current = klaro;
      const manager = klaro.getManager(config);
      manager.watch(watcher);
      if (manager.confirmed) {
        savedRef.current = { ...(manager.consents as Consents) };
        setConsents({ ...(manager.consents as Consents) });
      }
      klaro.render(config);
    });
    return () => {
      cancelled = true;
      klaroRef.current?.getManager(config).unwatch(watcher);
    };
  }, [lang]);

  useEffect(() => {
    const open = () => {
      if (klaroRef.current && configRef.current) klaroRef.current.show(configRef.current, true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  return (
    <>
      {consents["vercel-analytics"] && <Analytics />}
      {consents.umami && UMAMI_ID && <Script src={UMAMI_SRC} data-website-id={UMAMI_ID} strategy="afterInteractive" />}
    </>
  );
}
