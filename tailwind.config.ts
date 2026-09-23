import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0A0908",
        coal: "#141210",
        bone: "#E8E3D9",
        ash: "#8A8578",
        gold: "#C9A227",
        redact: "#B3271E",
        manila: "#C8B98A",
        sage: "#9BC08B",
        ember: "#D96C3A",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        dossier: "0.18em",
      },
      boxShadow: {
        card: "0 1px 0 rgba(232,227,217,0.06), 0 12px 32px rgba(0,0,0,0.55)",
        goldglow: "0 0 24px rgba(201,162,39,0.28)",
        emberglow: "0 0 28px rgba(217,108,58,0.35)",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%,100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.4" },
          "94%": { opacity: "1" },
          "97%": { opacity: "0.7" },
          "98%": { opacity: "1" },
        },
      },
      animation: {
        scanline: "scanline 1.6s linear infinite",
        flicker: "flicker 6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
