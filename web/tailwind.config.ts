import type { Config } from 'tailwindcss'


export default {
content: [
'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
theme: {
extend: {
colors: {
primary: '#14532d', // deep green
accent: '#22c55e' // spring green
},
boxShadow: {
glass: '0 8px 32px rgba(0,0,0,0.1)'
},
backdropBlur: {
xs: '2px'
}
},
},
plugins: [],
} satisfies Config