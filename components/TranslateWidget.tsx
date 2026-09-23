"use client";

import { useEffect } from "react";

/**
 * Google Translate widget — English is the source language; visitors can
 * auto-translate the whole site into 100+ languages via the footer selector.
 */
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement?: new (...args: unknown[]) => unknown; InlineLayout?: { SIMPLE: number } } };
  }
}

export default function TranslateWidget() {
  useEffect(() => {
    if (document.getElementById("gt-widget-script")) return;
    window.googleTranslateElementInit = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages:
            "pt,es,fr,de,it,ja,zh-CN,zh-TW,ko,ru,ar,hi,tr,pl,nl,sv,id,th,vi,cs,el,he,uk,ro,hu,da,fi,no",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
    const s = document.createElement("script");
    s.id = "gt-widget-script";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] tracking-dossier text-ash/70">LANGUAGE</span>
      <div id="google_translate_element" className="gt-inline text-[10px]" />
    </div>
  );
}
