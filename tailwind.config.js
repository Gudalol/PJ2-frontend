/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#219653",       // Botões principais
        secondary: "#1A5632",     // Fundo escuro, botões secundários
        background: "#F1F7FA",    // Fundo geral
        card: "#FFFFFF",          // Fundo de cards
        cardBorder: "#D9E2EC",    // Bordas suaves de cards
        hover: "#EAF6EE",         // Hover de card ou botão
        text: "#333333",          // Texto principal
        textMuted: "#6B7280",     // Texto de descrição ou secundário
      },
    },
  },
  plugins: [],
};
