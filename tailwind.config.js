/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.tsx"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        frosted: "rgba(255, 255, 255, 0.08)",
        "frosted-hover": "rgba(255, 255, 255, 0.12)",
        "x-blue": "#1D9BF0",
        "text-primary": "#FFFFFF",
        "text-secondary": "rgba(255, 255, 255, 0.6)",
        border: "rgba(255, 255, 255, 0.12)",
      },
      fontFamily: {
        cooper: ["CooperOldStyle-Regular"],
        "cooper-medium": ["CooperOldStyle-Medium"],
        "cooper-bold": ["CooperOldStyle-Bold"],
      },
    },
  },
  plugins: [],
};
