# Influenza

A full-stack influencer marketing platform that connects brands and creators — discovery, campaign management, collaboration workflows, real-time messaging, and data-backed pricing, all in one workspace.

Influenza gives **brands** the tools to launch campaigns, search and vet creators, and manage collaborations end-to-end, while giving **influencers** a dashboard to build their profile, manage a public portfolio, price their content fairly, and track their reputation — all backed by live data with no hardcoded placeholders.

---

## Features

### For Brands
- Company & product profile management (multiple products per brand)
- Campaign (Opportunity) creation, editing, and status tracking
- Creator search and discovery, filterable by platform and follower count
- Collaboration request workflow (send, accept/reject, track)
- Collaboration lifecycle tracking — deliverables, payment status, stage
- Real-time dashboard stats (active campaigns, total collaborations)

### For Influencers
- Persistent dashboard with live stats, no fabricated data
- Multi-platform social account management (Instagram, YouTube, Twitter)
- Up-to-3 niche/category selection for discoverability
- **Match Profile** — collaboration formats, payment preferences, audience targeting, bio
- **Rate Card Calculator** — data-driven pricing engine based on follower tier, engagement rate, niche, format, and market (India ₹ / Global $)
- **Insider Rate** — a performance-adjusted rate multiplier calculated from real completed collaborations, ratings, and response time
- **Content Gallery / Portfolio** — upload photos & videos, highlight up to 10 items, publicly browsable with no login required
- **Reviews** — aggregate rating and individual brand reviews after completed collaborations
- Campaign browsing and one-click applications

### Platform-wide
- JWT-based authentication with role-based protected routing (`brand` / `influencer`)
- Real-time messaging between brands and influencers (Socket.IO)
- Public, no-login Content Gallery and Category browsing
- Instagram handle lookup for auto-filling rate card stats (via Apify)
- Fully responsive, custom design system built on Tailwind CSS v4

---

## Tech Stack

**Frontend**
- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first `@theme` config, no `tailwind.config.js`)
- React Router v7
- Axios
- Socket.IO Client
- Framer Motion
- Lucide React / React Icons

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT (`jsonwebtoken`) authentication + `bcryptjs` password hashing
- Multer (file uploads)
- Apify Client (Instagram profile scraping)

**Deployment**
- Frontend: [Vercel](https://vercel.com/)
- Backend: [Render](https://render.com/)
- Database: [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## Project Structure

```
influenza/
├── src/                        # Frontend (React + Vite)
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── influencer/     # Influencer dashboard components
│   │   │   └── brand/          # Brand dashboard components
│   │   ├── auth/, common/, ui/, layout/, hero/, howItWorks/
│   │   ├── product/, trust/, FAQ/, footer/, gallery/, pricing/
│   │   └── creators/, categories/
│   ├── pages/                  # Route-level pages
│   ├── context/                # AuthContext, SocketContext
│   ├── routes/                 # AppRoutes, ProtectedRoute
│   ├── constants/               # Static data (niches, nav menu, etc.)
│   ├── utils/                   # pricingEngine.js and other helpers
│   ├── config/api.js            # Centralized API URL config
│   └── theme/                   # colors.css, typography.css design tokens
│
├── backend/
│   ├── models/                  # Mongoose schemas
│   ├── controllers/             # Route handlers
│   ├── routes/                  # Express routers
│   ├── middleware/               # Auth + file upload middleware
│   ├── services/                # Stats computation, Instagram scraping
│   ├── socket/                  # Socket.IO server (real-time messaging)
│   └── server.js                # App entry point
│
└── public/                      # Static assets, icons
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas cluster (or local MongoDB instance)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/influenza.git
cd influenza
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/influenza
JWT_SECRET=replace_this_with_a_long_random_string
PORT=5000
IG_BUSINESS_ACCOUNT_ID=your_facebook_page_linked_ig_business_account_id
FB_PAGE_ACCESS_TOKEN=your_long_lived_page_access_token
```

Run the backend:

```bash
npm run dev     # starts with nodemon on http://localhost:5000
```

### 3. Set up the frontend

From the project root:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev      # starts Vite dev server, default http://localhost:5173
```

> **Note:** If you're on a restricted network (e.g. certain campus/corporate Wi-Fi), MongoDB Atlas SRV DNS resolution can fail locally. `backend/config/db.js` already forces public DNS resolvers (`8.8.8.8`, `1.1.1.1`) to work around this. If issues persist, prefer deploying to Render/Vercel over local development.

---

## Available Scripts

**Frontend** (project root)

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

**Backend** (`backend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the API with nodemon (auto-restart) |
| `npm start` | Start the API in production mode |

---

## Environment Variables

**Backend (`backend/.env`)**

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `PORT` | Port the API server runs on (default `5000`) |
| `IG_BUSINESS_ACCOUNT_ID` | Instagram Business Account ID (for the Instagram lookup feature) |
| `FB_PAGE_ACCESS_TOKEN` | Long-lived Facebook Page access token |
| `APIFY_TOKEN` | Apify API token, used to scrape public Instagram profile stats |

**Frontend (`.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api` or your deployed Render URL) |

---

## API Overview

All routes are mounted under `/api`.

| Base path | Purpose |
|---|---|
| `/api/auth` | Register, login, get current user |
| `/api/influencer` | Influencer profile, match profile, dashboard stats, rate cards, insider rate, gallery/portfolio, reviews, opportunities |
| `/api/brand` | Brand profile, company info, products, campaigns, creator search, collaborations |
| `/api/collaboration-requests` | Send/accept/reject collaboration requests (shared by both roles) |
| `/api/messages` | Conversations and message history (real-time delivery via Socket.IO) |
| `/api/public` | Public, no-auth endpoints — Instagram lookup, creators by category, content gallery |

Authenticated routes expect a bearer token:

```
Authorization: Bearer <token>
```

---

## Deployment

- **Frontend** is deployed on **Vercel**, with `VITE_API_URL` pointed at the live backend.
- **Backend** is deployed on **Render**, connected to a **MongoDB Atlas** cluster.
- Uploaded files (product images, gallery content) are currently written to local disk via Multer, which is ephemeral on Render — plan to migrate to persistent cloud storage (e.g. Cloudinary or S3) for production durability.

---

## Design System

Influenza uses a token-based design system rather than hardcoded styles:

- `src/theme/colors.css` — CSS custom properties for brand colors, surfaces, text, borders, and status colors
- `src/theme/typography.css` — font family, size, and weight tokens
- Tailwind v4 `@theme` blocks in `src/index.css` map these tokens into Tailwind's utility system
- No `tailwind.config.js` — Tailwind v4 uses CSS-first configuration exclusively

---

## Roadmap

- [ ] Brand dashboard sidebar parity with the influencer sidebar
- [ ] Migrate uploaded media from local disk to persistent cloud storage
- [ ] Expand supported platforms beyond Instagram/YouTube/Twitter
- [ ] Verified account badges and brand verification flow

---

## License

This project does not yet specify a license. Add a `LICENSE` file to declare one (e.g. MIT, Apache-2.0) before open-sourcing or distributing.

---

## Acknowledgments

- Design and UX inspired by [Social Cat](https://thesocialcat.com)
