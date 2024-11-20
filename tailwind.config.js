// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // add other directories where Tailwind should look for classes
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0099FF', 
        'primary-foreground': '#FFFFFF', 
        secondary: '#2563eb', 
        destructive: '#ff4d4d', // red for "destructive"
        'destructive-foreground': '#ffffff', 
        card: '#f0f0f0', // color for `bg-card`
        'card-foreground': '#333333', // text color for `text-card-foreground`
      }
    },
  },
  plugins: [],
};
