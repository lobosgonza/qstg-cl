QSTG.cl - Live Events Aggregator Chile
A high-performance, mobile-first web platform built with Next.js 16 (App Router) and Tailwind CSS v4 that aggregates, filters, and displays live entertainment, sports, and cultural events across Chile. The project architecture focuses on optimal user experience by offloading heavy data computations outside of the React render cycle using precise memory structures.

🚀 Tech Stack & Architecture
Framework: Next.js 16.2.6 (utilizing React 19.2.4 Server and Client Components Architecture).

Styling: Tailwind CSS v4.3.0 (leveraging the new @tailwindcss/postcss engine for ultra-fast utility compilation).

Database: Local flat JSON storage (eventos.json) acting as a normalized data layer compiled from production ticket web scrapers.

Automation & Scripts: Prepared with Puppeteer and JSDOM for advanced server-side automation and crawling capabilities.

🛠️ Project Structure
Bash
├── src/
│ ├── app/
│ │ ├── components/
│ │ │ ├── EventCard.tsx # Individual event UI component
│ │ │ ├── FilterBar.tsx # Global search and category picker
│ │ │ └── MainBanner.tsx #
│ │ ├── page.tsx # Main landing page (Reactive filtering grid)
│ │ ├── layout.tsx # Root layout with Geist font configurations
│ │ ├── globals.css # Tailwind v4 entry point
│ │ └── [slug]/
│ │ └── page.tsx # Dynamic Server Component for event details
│ ├── eventos.json # Local normalized event database
└── package.json # Project dependencies and script runners
⚙️ Core Engineering Features

1. Multi-Condition Cross-Filtering System
   The landing page implements a high-efficiency memory filtering pipe via React’s useMemo hook. It processes 5 distinct conditions simultaneously (Text Search, Category, Month, and City) without re-instantiating the data array, ensuring O(N) algorithmic complexity during real-time inputs:

TypeScript
// Core conceptual processing pipeline
const filteredEvents = useMemo(() => {
return eventList.filter(event => {
const matchesText = event.Title.includes(searchQuery);
const matchesCategory = category === 'TODOS' || event.Category === category;
const matchesMonth = month === 'TODOS' || parseMonth(event.FilterDate) === month;
return matchesText && matchesCategory && matchesMonth;
});
}, [searchQuery, category, month]); 2. Reverse Chronological Sorting & Dynamic Pagination
Chronological Order: Events are naturally sorted from the most recent date to the furthest in the future using standardized ISO 8601 strings (YYYY-MM-DD), preventing computational sorting lag on low-end mobile devices.

Mobile-First Progressive Loading: To protect mobile browser memory and DOM node limits, data is segmented into chunks of 12. Clicking "Ver Más" expands the visible window seamlessly without resetting previous filtering parameters.

3. Dynamic Server-Side Event Detail Routing
   Concert details use Next.js dynamic routing (/[slug]/page.tsx). The page leverages asynchronous parameters matching standard web crawler slugs directly against the flat database, delivering immediate server responses optimized for SEO indexability.

📥 Getting Started
Prerequisites
Node.js >= 20.9.0

npm or vnm

Installation
Clone the repository:

Bash
git clone https://github.com/your-username/qstg-cl.git
cd qstg-cl
Install the production dependencies:

Bash
npm install
Run the local development server:

Bash
npm run dev
Open http://localhost:3000 inside your browser to view the application.

Build for production compilation:

Bash
npm run build
🔒 Environment & Production Guardrails
All infrastructure endpoints and sensitive API connection credentials are strictly isolated from the client-side bundle via .gitignore rules mapping execution blocks for .env.local.

Asset processing handles third-party image referencing securely by preventing raw referrers through hardcoded fallback wrappers.
