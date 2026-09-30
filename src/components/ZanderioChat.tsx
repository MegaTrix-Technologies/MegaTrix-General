import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

interface ZanderioChatProps {
  widgetId?: string;
  brandColorDark?: string;
  brandColorLight?: string;
  isPreloaderActive?: boolean;
  homeOnly?: boolean;
}

const WIDGET_SCRIPT_SRC = "https://cdn.zanderio.ai/widget/loader.js";
const WIDGET_HOST_ID = "zanderio-widget-host";
const THEME_STYLE_ID = "megatrix-zanderio-custom-theme";

export function ZanderioChat({
  widgetId = "wdg_syVY0LCtrvDcFj5AP76bGebJ",
  brandColorDark = "#0055FF",
  brandColorLight = "#0044DD",
  isPreloaderActive = false,
  homeOnly = true,
}: ZanderioChatProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Show ONLY on home page when preloader is finished and not on admin
  const shouldShow = (!homeOnly || isHomePage) && !isPreloaderActive && !isAdminRoute;

  // 1. Script injection & mounting lifecycle (only inject once shouldShow is true)
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (!shouldShow) return;

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGET_SCRIPT_SRC}"]`
    );

    if (!script) {
      script = document.createElement("script");
      script.src = WIDGET_SCRIPT_SRC;
      script.dataset.id = widgetId;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [widgetId, shouldShow]);

  // 2. Control widget visibility (Hide during preloader and on non-home pages)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const updateVisibility = () => {
      const host = document.getElementById(WIDGET_HOST_ID);
      if (!host) return;

      if (shouldShow) {
        host.style.setProperty("display", "block", "important");
        host.style.setProperty("visibility", "visible", "important");
        host.style.setProperty("opacity", "1", "important");
        host.style.setProperty("pointer-events", "auto", "important");
        host.style.setProperty("transition", "opacity 0.25s ease", "important");
      } else {
        host.style.setProperty("display", "none", "important");
        host.style.setProperty("visibility", "hidden", "important");
        host.style.setProperty("opacity", "0", "important");
        host.style.setProperty("pointer-events", "none", "important");
      }
    };

    updateVisibility();

    const interval = setInterval(updateVisibility, 100);
    const timeout = setTimeout(() => clearInterval(interval), 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [shouldShow]);

  // 3. Dynamic Shadow DOM theme & responsive layout synchronization
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const getThemeCSS = (isLight: boolean) => {
      const brandColor = isLight ? brandColorLight : brandColorDark;

      if (isLight) {
        return `
          /* ============================================================
             LIGHT THEME OVERRIDES — MEGARIX INFO-SITE
             ============================================================ */
          :host, #zanderio-root {
            color-scheme: light !important;
            --z-primary: #0044DD !important;
            --z-primary-dark: #0030A0 !important;
            --z-bg: #FFFFFF !important;
            --z-bg-muted: #F1F5FD !important;
            --z-border: #D1D9EE !important;
            --z-text: #0D1524 !important;
            --z-text-secondary: #475569 !important;
            --z-text-disabled: #94A3B8 !important;
            --z-font: "Inter", "Share Tech Mono", ui-sans-serif, system-ui, sans-serif !important;
            --z-shadow-md: 0 0 0 1px #D1D9EE, 0 14px 35px -10px rgba(0, 68, 221, 0.18) !important;
            --z-shadow-brand: 0 0 20px rgba(0, 68, 221, 0.25) !important;
          }

          /* --- 1. FLOATING LAUNCHER BUTTON (GLOWING CIRCULAR AVATAR TARGET STYLE) --- */
          #zanderio-root > button[aria-label="Open chat"],
          :not([role="dialog"]) > button[aria-label="Open chat"] {
            position: fixed !important;
            bottom: 24px !important;
            right: 24px !important;
            z-index: 2147483640 !important;
            width: 58px !important;
            height: 58px !important;
            background: #000000 !important;
            border: 1.5px solid #0055FF !important;
            box-shadow: 0 0 16px 2px rgba(0, 85, 255, 0.55), 0 0 32px rgba(0, 85, 255, 0.25) !important;
            padding: 0 !important;
            color: #FFFFFF !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 9999px !important;
            overflow: hidden !important;
            cursor: pointer !important;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, border-color 0.2s ease !important;
          }

          #zanderio-root > button[aria-label="Open chat"]:hover,
          :not([role="dialog"]) > button[aria-label="Open chat"]:hover {
            transform: scale(1.08) !important;
            border-color: #3388FF !important;
            box-shadow: 0 0 24px 4px rgba(0, 102, 255, 0.8), 0 0 45px rgba(0, 85, 255, 0.45) !important;
          }

          #zanderio-root > button[aria-label="Open chat"] img,
          :not([role="dialog"]) > button[aria-label="Open chat"] img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 9999px !important;
            display: block !important;
          }

          @media (max-width: 640px) {
            #zanderio-root > button[aria-label="Open chat"],
            :not([role="dialog"]) > button[aria-label="Open chat"] {
              bottom: calc(24px + env(safe-area-inset-bottom, 0px)) !important;
              right: 20px !important;
              width: 52px !important;
              height: 52px !important;
            }
          }

          /* HIDE DUPLICATE EXTERNAL FLOATING CLOSE BUTTON WHEN DIALOG IS OPEN */
          #zanderio-root > button[aria-label="Close chat"],
          :not([role="dialog"]) > button[aria-label="Close chat"] {
            display: none !important;
          }

          /* --- 2. HIDE PROACTIVE NUDGE / GREETING SPEECH BUBBLE IN MEGATRIX --- */
          div[role="button"][aria-label="Open chat"] {
            display: none !important;
          }

          /* --- 3. DIALOG CONTAINER --- */
          [role="dialog"] {
            background: #FFFFFF !important;
            border: 1px solid #D1D9EE !important;
            box-shadow: 0 0 0 1px #D1D9EE, 0 20px 40px -12px rgba(0, 68, 221, 0.18) !important;
            backdrop-filter: blur(12px) !important;
            font-family: var(--z-font) !important;
            z-index: 2147483645 !important;
          }

          /* Desktop View (> 640px) */
          @media (min-width: 641px) {
            [role="dialog"] {
              width: 400px !important;
              max-width: calc(100vw - 32px) !important;
              height: min(630px, calc(100dvh - 48px)) !important;
              max-height: calc(100dvh - 48px) !important;
              bottom: 24px !important;
              right: 24px !important;
              border-radius: 16px !important;
            }
          }

          /* Mobile Screen Full View (< 641px) */
          @media (max-width: 640px) {
            [role="dialog"] {
              inset: 0 !important;
              width: 100vw !important;
              height: 100dvh !important;
              max-height: 100dvh !important;
              border-radius: 0 !important;
              border: none !important;
              position: fixed !important;
              z-index: 2147483647 !important;
            }
          }

          /* --- 4. HEADER BAR & ACTION BUTTONS --- */
          [role="dialog"] > div > div:first-child,
          [role="dialog"] header,
          div:has(> button[aria-label="Close chat"]) {
            background: linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%) !important;
            border-bottom: 1px solid #D1D9EE !important;
            padding: 14px 16px !important;
            color: #0D1524 !important;
          }

          [role="dialog"] header span,
          [role="dialog"] > div > div:first-child span {
            color: #0D1524 !important;
            font-family: "Share Tech Mono", monospace !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            letter-spacing: 0.05em !important;
            text-transform: uppercase !important;
          }

          /* Header Action Buttons (STAYS INSIDE HEADER) */
          [role="dialog"] header button,
          [role="dialog"] button[aria-label="Close chat"],
          [role="dialog"] button[aria-label="Expand chat"],
          [role="dialog"] button[aria-label="Shrink chat"],
          [role="dialog"] button[aria-label="Open full view"],
          [role="dialog"] button[aria-label="Exit full view"] {
            position: static !important;
            width: 30px !important;
            height: 30px !important;
            background: rgba(0, 68, 221, 0.06) !important;
            border: 1px solid rgba(0, 68, 221, 0.12) !important;
            border-radius: 6px !important;
            color: #0D1524 !important;
            padding: 4px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.15s ease !important;
            box-shadow: none !important;
            cursor: pointer !important;
          }

          [role="dialog"] header button:hover,
          [role="dialog"] button[aria-label="Close chat"]:hover,
          [role="dialog"] button[aria-label="Expand chat"]:hover,
          [role="dialog"] button[aria-label="Open full view"]:hover {
            background: rgba(0, 68, 221, 0.15) !important;
            border-color: #0044DD !important;
            color: #0044DD !important;
            transform: scale(1.04) !important;
          }

          /* --- 5. MESSAGES & CHAT STREAM --- */
          [role="dialog"] div:has(> div > div[style*="border-radius"]),
          div[style*="overflow-y: auto"] {
            background: #FFFFFF !important;
            padding: 16px !important;
            gap: 14px !important;
          }

          /* Assistant Bubble */
          div[style*="flex-start"] > div {
            background: #F1F5FD !important;
            border: 1px solid #D1D9EE !important;
            color: #0D1524 !important;
            font-size: 13.5px !important;
            line-height: 1.55 !important;
            border-radius: 12px 12px 12px 2px !important;
          }

          /* User Bubble */
          div[style*="flex-end"] > div {
            background: #0044DD !important;
            color: #FFFFFF !important;
            font-size: 13.5px !important;
            line-height: 1.55 !important;
            border-radius: 12px 12px 2px 12px !important;
            box-shadow: 0 3px 10px rgba(0, 68, 221, 0.25) !important;
          }

          /* --- 6. STARTER / SUGGESTED QUESTIONS --- */
          div[role="group"][aria-label="Suggested questions"] {
            padding: 4px 16px 12px !important;
            gap: 8px !important;
          }

          div[role="group"][aria-label="Suggested questions"] button,
          button:has(.z-suggest-arrow) {
            background: #F8FAFC !important;
            border: 1px solid #CBD5E1 !important;
            border-radius: 10px !important;
            color: #0F172A !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            line-height: 1.4 !important;
            padding: 10px 14px !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
            cursor: pointer !important;
            text-align: left !important;
          }

          div[role="group"][aria-label="Suggested questions"] button span,
          button:has(.z-suggest-arrow) span {
            color: #0F172A !important;
            font-weight: 500 !important;
          }

          div[role="group"][aria-label="Suggested questions"] button:hover,
          button:has(.z-suggest-arrow):hover {
            background: #EEF2FF !important;
            border-color: #0044DD !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 14px rgba(0, 68, 221, 0.15) !important;
          }

          div[role="group"][aria-label="Suggested questions"] button:hover span,
          button:has(.z-suggest-arrow):hover span {
            color: #0044DD !important;
          }

          .z-suggest-arrow {
            fill: #0044DD !important;
            stroke: #0044DD !important;
            opacity: 0.8 !important;
          }

          /* --- 7. INPUT COMPOSER --- */
          div:has(> div > textarea) {
            background: #FFFFFF !important;
            border-top: 1px solid #D1D9EE !important;
            padding: 12px 14px !important;
          }

          div:has(> textarea) {
            background: #F8FAFC !important;
            border: 1px solid #CBD5E1 !important;
            border-radius: 12px !important;
            transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
          }

          div:has(> textarea):focus-within {
            border-color: #0044DD !important;
            box-shadow: 0 0 0 1px #0044DD, 0 0 12px rgba(0, 68, 221, 0.15) !important;
          }

          textarea {
            color: #0D1524 !important;
            font-size: 13.5px !important;
            font-family: var(--z-font) !important;
          }
          textarea::placeholder {
            color: #64748B !important;
          }

          button[aria-label="Send"] {
            background: #0044DD !important;
            color: #FFFFFF !important;
            border-radius: 8px !important;
            transition: transform 0.15s ease, background 0.15s ease !important;
          }
          button[aria-label="Send"]:hover:not(:disabled) {
            background: #1A55EE !important;
            transform: scale(1.05) !important;
          }
        `;
      }

      // ============================================================
      // DARK THEME OVERRIDES — MEGARIX CYBERPUNK AESTHETIC
      // ============================================================
      return `
        :host, #zanderio-root {
          color-scheme: dark !important;
          --z-primary: #0055FF !important;
          --z-primary-dark: #0038B8 !important;
          --z-bg: #090A0F !important;
          --z-bg-muted: #111728 !important;
          --z-border: #1E2538 !important;
          --z-text: #F8FAFC !important;
          --z-text-secondary: #94A3B8 !important;
          --z-text-disabled: #455270 !important;
          --z-font: "Inter", "Share Tech Mono", ui-sans-serif, system-ui, sans-serif !important;
          --z-shadow-md: 0 0 0 1px #1E2538, 0 20px 48px -15px rgba(0, 85, 255, 0.3), 0 10px 30px -10px rgba(0, 0, 0, 0.8) !important;
          --z-shadow-brand: 0 0 24px rgba(0, 85, 255, 0.45) !important;
        }

        /* --- 1. FLOATING LAUNCHER BUTTON (GLOWING CIRCULAR AVATAR TARGET STYLE) --- */
        #zanderio-root > button[aria-label="Open chat"],
        :not([role="dialog"]) > button[aria-label="Open chat"] {
          position: fixed !important;
          bottom: 24px !important;
          right: 24px !important;
          z-index: 2147483640 !important;
          width: 58px !important;
          height: 58px !important;
          background: #000000 !important;
          border: 1.5px solid #0055FF !important;
          box-shadow: 0 0 16px 2px rgba(0, 85, 255, 0.55), 0 0 32px rgba(0, 85, 255, 0.25) !important;
          padding: 0 !important;
          color: #FFFFFF !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 9999px !important;
          overflow: hidden !important;
          cursor: pointer !important;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, border-color 0.2s ease !important;
        }

        #zanderio-root > button[aria-label="Open chat"]:hover,
        :not([role="dialog"]) > button[aria-label="Open chat"]:hover {
          transform: scale(1.08) !important;
          border-color: #3388FF !important;
          box-shadow: 0 0 24px 4px rgba(0, 102, 255, 0.8), 0 0 45px rgba(0, 85, 255, 0.45) !important;
        }

        #zanderio-root > button[aria-label="Open chat"] img,
        :not([role="dialog"]) > button[aria-label="Open chat"] img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 9999px !important;
          display: block !important;
        }

        @media (max-width: 640px) {
          #zanderio-root > button[aria-label="Open chat"],
          :not([role="dialog"]) > button[aria-label="Open chat"] {
            bottom: calc(24px + env(safe-area-inset-bottom, 0px)) !important;
            right: 20px !important;
            width: 52px !important;
            height: 52px !important;
          }
        }

        /* HIDE DUPLICATE EXTERNAL FLOATING CLOSE BUTTON WHEN DIALOG IS OPEN */
        #zanderio-root > button[aria-label="Close chat"],
        :not([role="dialog"]) > button[aria-label="Close chat"] {
          display: none !important;
        }

        /* --- 2. HIDE PROACTIVE NUDGE / GREETING SPEECH BUBBLE IN MEGATRIX --- */
        div[role="button"][aria-label="Open chat"] {
          display: none !important;
        }

        /* --- 3. DIALOG CONTAINER --- */
        [role="dialog"] {
          background: #090A0F !important;
          border: 1px solid #1E2538 !important;
          box-shadow: 0 0 0 1px #1E2538, 0 24px 56px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 85, 255, 0.25) !important;
          backdrop-filter: blur(16px) !important;
          font-family: var(--z-font) !important;
          z-index: 2147483645 !important;
        }

        /* Desktop & Tablet View (> 640px) */
        @media (min-width: 641px) {
          [role="dialog"] {
            width: 400px !important;
            max-width: calc(100vw - 32px) !important;
            height: min(630px, calc(100dvh - 48px)) !important;
            max-height: calc(100dvh - 48px) !important;
            bottom: 24px !important;
            right: 24px !important;
            border-radius: 16px !important;
          }
        }

        /* Mobile Screen Full View (< 641px) */
        @media (max-width: 640px) {
          [role="dialog"] {
            inset: 0 !important;
            width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            border-radius: 0 !important;
            border: none !important;
            position: fixed !important;
            z-index: 2147483647 !important;
          }
        }

        /* --- 4. CYBERPUNK HEADER BAR & ACTION BUTTONS --- */
        [role="dialog"] > div > div:first-child,
        [role="dialog"] header,
        div:has(> button[aria-label="Close chat"]) {
          background: linear-gradient(180deg, #11172B 0%, #090D17 100%) !important;
          border-bottom: 1px solid #1E2538 !important;
          padding: 14px 16px !important;
          color: #FFFFFF !important;
        }

        [role="dialog"] header span,
        [role="dialog"] > div > div:first-child span {
          color: #FFFFFF !important;
          font-family: "Share Tech Mono", monospace !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
        }

        /* Header Action Buttons (STAYS INSIDE HEADER) */
        [role="dialog"] header button,
        [role="dialog"] button[aria-label="Close chat"],
        [role="dialog"] button[aria-label="Expand chat"],
        [role="dialog"] button[aria-label="Shrink chat"],
        [role="dialog"] button[aria-label="Open full view"],
        [role="dialog"] button[aria-label="Exit full view"] {
          position: static !important;
          width: 30px !important;
          height: 30px !important;
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 6px !important;
          color: #CBD5E1 !important;
          padding: 4px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.15s ease !important;
          box-shadow: none !important;
          cursor: pointer !important;
        }

        [role="dialog"] header button:hover,
        [role="dialog"] button[aria-label="Close chat"]:hover,
        [role="dialog"] button[aria-label="Expand chat"]:hover,
        [role="dialog"] button[aria-label="Open full view"]:hover {
          background: rgba(0, 85, 255, 0.25) !important;
          border-color: #0055FF !important;
          color: #FFFFFF !important;
          transform: scale(1.04) !important;
        }

        /* --- 5. MESSAGES STREAM --- */
        [role="dialog"] div:has(> div > div[style*="border-radius"]),
        div[style*="overflow-y: auto"] {
          background: #090A0F !important;
          padding: 16px !important;
          gap: 14px !important;
        }

        /* Assistant Bubble */
        div[style*="flex-start"] > div {
          background: #111728 !important;
          border: 1px solid #1E2538 !important;
          color: #F8FAFC !important;
          font-size: 13.5px !important;
          line-height: 1.6 !important;
          border-radius: 12px 12px 12px 2px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4) !important;
        }

        /* User Bubble */
        div[style*="flex-end"] > div {
          background: #0055FF !important;
          color: #FFFFFF !important;
          font-size: 13.5px !important;
          line-height: 1.6 !important;
          border-radius: 12px 12px 2px 12px !important;
          box-shadow: 0 4px 14px rgba(0, 85, 255, 0.35) !important;
        }

        /* --- 6. STARTER / SUGGESTED QUESTIONS --- */
        div[role="group"][aria-label="Suggested questions"] {
          padding: 4px 16px 12px !important;
          gap: 8px !important;
        }

        div[role="group"][aria-label="Suggested questions"] button,
        button:has(.z-suggest-arrow) {
          background: #0F1424 !important;
          border: 1px solid #1E2538 !important;
          border-radius: 10px !important;
          color: #E2E8F0 !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          line-height: 1.4 !important;
          padding: 10px 14px !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35) !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
          cursor: pointer !important;
          text-align: left !important;
        }

        div[role="group"][aria-label="Suggested questions"] button span,
        button:has(.z-suggest-arrow) span {
          color: #E2E8F0 !important;
          font-weight: 500 !important;
        }

        div[role="group"][aria-label="Suggested questions"] button:hover,
        button:has(.z-suggest-arrow):hover {
          background: #162038 !important;
          border-color: #0055FF !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 16px rgba(0, 85, 255, 0.3) !important;
        }

        div[role="group"][aria-label="Suggested questions"] button:hover span,
        button:has(.z-suggest-arrow):hover span {
          color: #FFFFFF !important;
        }

        .z-suggest-arrow {
          fill: #0055FF !important;
          stroke: #0055FF !important;
          opacity: 0.9 !important;
        }

        /* --- 7. INPUT COMPOSER --- */
        div:has(> div > textarea) {
          background: #090A0F !important;
          border-top: 1px solid #1E2538 !important;
          padding: 12px 14px !important;
        }

        div:has(> textarea) {
          background: #0F1424 !important;
          border: 1px solid #1E2538 !important;
          border-radius: 12px !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
        }

        div:has(> textarea):focus-within {
          border-color: #0055FF !important;
          box-shadow: 0 0 0 1px #0055FF, 0 0 14px rgba(0, 85, 255, 0.25) !important;
        }

        textarea {
          color: #FFFFFF !important;
          font-size: 13.5px !important;
          font-family: var(--z-font) !important;
        }
        textarea::placeholder {
          color: #64748B !important;
        }

        button[aria-label="Send"] {
          background: #0055FF !important;
          color: #FFFFFF !important;
          border-radius: 8px !important;
          transition: transform 0.15s ease, background 0.15s ease !important;
        }
        button[aria-label="Send"]:hover:not(:disabled) {
          background: #1A66FF !important;
          transform: scale(1.05) !important;
        }

        /* --- 8. SCROLLBAR STYLING --- */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #090A0F;
        }
        ::-webkit-scrollbar-thumb {
          background: #1E2538;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${brandColor};
        }
      `;
    };

    const applyThemeToShadowRoot = () => {
      const host = document.getElementById(WIDGET_HOST_ID);
      if (!host || !host.shadowRoot) return false;

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const css = getThemeCSS(isLight);

      let styleEl = host.shadowRoot.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = THEME_STYLE_ID;
        host.shadowRoot.appendChild(styleEl);
      } else if (styleEl.nextSibling) {
        // Keep style tag at bottom of shadowRoot
        host.shadowRoot.appendChild(styleEl);
      }

      if (styleEl.textContent !== css) {
        styleEl.textContent = css;
      }

      if (shouldShow) {
        host.style.setProperty("display", "block", "important");
        host.style.setProperty("visibility", "visible", "important");
        host.style.setProperty("opacity", "1", "important");
        host.style.setProperty("pointer-events", "auto", "important");
      } else {
        host.style.setProperty("display", "none", "important");
        host.style.setProperty("visibility", "hidden", "important");
        host.style.setProperty("opacity", "0", "important");
        host.style.setProperty("pointer-events", "none", "important");
      }

      return true;
    };

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const applied = applyThemeToShadowRoot();
      if (applied || attempts > 80) {
        clearInterval(interval);
      }
    }, 200);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          applyThemeToShadowRoot();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let shadowObserver: MutationObserver | null = null;
    const attachShadowObserver = () => {
      const host = document.getElementById(WIDGET_HOST_ID);
      if (host && host.shadowRoot && !shadowObserver) {
        shadowObserver = new MutationObserver(() => {
          applyThemeToShadowRoot();
        });
        shadowObserver.observe(host.shadowRoot, {
          childList: true,
          subtree: true,
        });
      }
    };

    const shadowCheckInterval = setInterval(() => {
      attachShadowObserver();
      if (shadowObserver) {
        clearInterval(shadowCheckInterval);
      }
    }, 250);

    return () => {
      clearInterval(interval);
      clearInterval(shadowCheckInterval);
      observer.disconnect();
      shadowObserver?.disconnect();
    };
  }, [brandColorDark, brandColorLight, shouldShow]);

  return null;
}

export default ZanderioChat;
