# Lahiru Enterprises Website

## Overview
A React-based landing page for Lahiru Enterprises, a company specializing in murukku industry machineries in Sri Lanka.

## Tech Stack
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Radix UI (component primitives)

## Project Structure
```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI components (button, toast, etc.)
│   ├── Header.jsx   # Navigation header
│   ├── Hero.jsx     # Hero section
│   ├── About.jsx    # About section
│   ├── Products.jsx # Products showcase
│   ├── Industries.jsx
│   ├── WhyChooseUs.jsx
│   ├── Testimonials.jsx
│   ├── Contact.jsx
│   ├── Footer.jsx
│   └── WhatsAppButton.jsx
├── lib/
│   └── utils.js     # Utility functions
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Development
- Run with: `npm run dev`
- Build with: `npm run build`
- Preview build: `npm run preview`

## Configuration
- Vite configured to run on port 5000 with all hosts allowed
- Path alias `@` points to `src/` directory
