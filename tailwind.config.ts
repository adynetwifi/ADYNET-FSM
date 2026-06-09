import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#2563EB", dark: "#1D4ED8", light: "#3B82F6" },
        sidebar: { DEFAULT: "#0F172A", hover: "#1E293B", active: "#1E40AF" },
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.25rem" },
      fontFamily: { sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
