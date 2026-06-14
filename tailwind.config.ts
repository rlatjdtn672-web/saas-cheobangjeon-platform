import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0d1117",
        paper: "#0a0c10",
        accent: "#5b8cff",
        accent2: "#22c55e",
        muted: "#8b949e",
        card: "#11151c",
        border: "#1f2630",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Pretendard", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
