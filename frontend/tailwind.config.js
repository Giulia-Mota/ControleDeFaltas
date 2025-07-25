/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AQUI ESTÁ A ALTERAÇÃO: Trocamos o vermelho anterior pelo novo #8B0000
        'custom-red': {
          DEFAULT: '#fe3e67', // A nova cor principal (Dark Red)
          'hover': '#790000'  // Um tom um pouco mais escuro para o efeito hover
        }
      }
    },
  },
  plugins: [],
}