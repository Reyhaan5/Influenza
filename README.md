# Influenza 🚀✨

[![Node Version](https://img.shields.io/badge/node-18%2B-339933.svg?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101.svg?logo=socketdotio&logoColor=white)](https://socket.io)

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,react,vite,tailwind,docker,jenkins,vercel,git" alt="Tech Stack Logos" />
</p>

A full-stack influencer marketing platform that connects **brands** and **creators**. Built with **React 19**, **Node.js / Express**, **MongoDB** and **Socket.IO**, Influenza covers the whole collaboration journey: creator discovery, multi-step campaign creation, deliverable review, real-time chat, and data-backed pricing, all in one workspace and all backed by live data (no hardcoded placeholders).

> 🎓 Built as a Final Year Project for the Diploma in Information Technology.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Collaboration Lifecycle](#-collaboration-lifecycle)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
  - [3. Run Everything with Docker (Optional)](#3-run-everything-with-docker-optional)
  - [4. Seed Demo Creators (Optional)](#4-seed-demo-creators-optional)
- [Configuration & Environment Variables](#-configuration--environment-variables)
- [Available Scripts](#-available-scripts)
- [CI/CD & DevOps](#-cicd--devops)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Design System](#-design-system)
- [Roadmap](#-roadmap)
- [Team](#-team)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Key Features

### For Brands
- **Multi-Brand Organizations**: Manage several sub-brands under one account, each with its own logo, category and campaigns.
- **Team Management**: Invite teammates with role-based access (Full Access, Campaign Manager, Reviewer, Viewer).
- **Product Catalog**: Multiple products per brand (physical or digital) with image galleries.
- **Campaign Wizard**: Guided 5-step campaign creation: core details → campaign info (goal, platform, visibility) → creator targeting → deliverable specs (format, length, content type, creative guide) → payment terms & commissions.
- **Creator Search & Discovery**: Filter by platform, follower count, location, price, gender, age, ethnicity and language.
- **Saved Creators**: Bookmark creators into lists for later outreach.
- **Collaboration Pipeline**: Kanban board with drag-and-drop stages, plus a table view.
- **Deliverable Review**: Approve drafts, request revisions with feedback, and approve live posts. Stages advance automatically.
- **Creative Library**: Browse every campaign deliverable and product asset in one place.
- **Ratings & Reviews**: Review creators after a completed collaboration.

### For Influencers
- **Guided Onboarding**: 3-step wizard for profile & demographics, pricing packages and payout setup.
- **Social Account Sync**: Instagram follower and engagement stats pulled live via Apify.
- **Niche Selection**: Pick up to 10 categories for discoverability on public browse pages.
- **Match Profile**: Collaboration formats, payment preferences (gifted / paid / affiliate), audience targeting and bio.
- **Rate Card Calculator**: Data-driven pricing from follower tier, engagement rate, niche, format and market (India ₹ / Global $).
- **Insider Rate Benchmark**: A performance-adjusted rate multiplier based on real completed collaborations, ratings and response time, with one-click "apply to packages".
- **Deliverable Submission**: Submit draft previews or live post URLs, receive feedback, and resubmit.
- **Content Gallery**: Upload photos and videos, highlight up to 10, and share a public portfolio.
- **Campaign Browsing**: One-click applications with profile-completeness gating.

### Platform-Wide
- **JWT Authentication** with role-based protected routing (`brand` / `influencer`).
- **Real-Time Messaging** via Socket.IO, with typing indicators, read receipts and conversation deletion.
- **Public Pages**: Content gallery, category browsing and creator profiles need no login.
- **Partnerships Hub**: One role-adapted view of invitations, active deals and completed collaborations.
- **API Hardening**: Rate limiting, NoSQL-injection sanitization and strict CORS.
- **Resilient Instagram Lookup**: Multi-token Apify failover, MongoDB caching and fallback data.

---

## 🏗 System Architecture

```
                 ┌──────────────────────────────────────────────┐
                 │        React 19 + Vite SPA  (Vercel)         │
                 │  Brand Dashboard · Creator Dashboard · Public│
                 └───────────────┬──────────────────┬───────────┘
                                 │ REST (Axios+JWT) │ WebSocket (JWT)
                                 ▼                  ▼
                 ┌──────────────────────────────────────────────┐
                 │      Express API + Socket.IO  (Render)       │
                 │ CORS → Rate Limit → JSON → mongoSanitize     │
                 │ → Routes → protect / requireRole → Controllers│
                 └───────┬──────────────────┬───────────────┬───┘
                         ▼                  ▼               ▼
              ┌────────────────┐  ┌──────────────────┐  ┌──────────────┐
              │ MongoDB Atlas  │  │ Apify Instagram  │  │ Local Uploads│
              │ (Mongoose, 18  │  │ Scraper (token   │  │ (Multer)     │
              │  models)       │  │ rotation + cache)│  │              │
              └────────────────┘  └──────────────────┘  └──────────────┘
```

---

## 🔄 Collaboration Lifecycle

```
 Request (brand invite / creator application)
        │  accepted
        ▼
 Collaboration created ──► content_creation
        │  creator submits a draft
        ▼
      review ──► Brand: Request Revision ──► back to content_creation
        │  Brand: Approve draft
        ▼
     posting ──► creator submits live post URL ──► review
        │  Brand: Approve live post
        ▼
 deliverablesCompleted + 1 ──► all done? ──► completed ──► Ratings & Reviews
```

---

## 💻 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,react,vite,tailwind,docker,nginx,jenkins,vercel,git" alt="Tech Stack Logos Banner" />
</p>

### Frontend
<p align="left">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/React_Router_7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Socket.IO_Client-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO" />
</p>

- **Core & Build**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/), plain JavaScript/JSX
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first `@theme`, no `tailwind.config.js`)
- **Routing & Data**: React Router v7, Axios with a JWT interceptor
- **Real-Time**: Socket.IO client
- **UI & Animation**: Framer Motion, Lucide React, React Icons, Radix UI (Avatar), `clsx` + `tailwind-merge`

### Backend
<p align="left">
  <img src="https://img.shields.io/badge/Node.js_20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose_8-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

- **Framework**: [Express](https://expressjs.com/) on Node.js (ES modules)
- **Database & ODM**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/)
- **Auth & Security**: `jsonwebtoken`, `bcryptjs`, `express-rate-limit`, `express-mongo-sanitize`, `cors`
- **Real-Time**: [Socket.IO](https://socket.io/) attached to the same HTTP server
- **Uploads**: Multer
- **Instagram Data**: `apify-client`, with multi-token failover

### DevOps & Hosting
<p align="left">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white" alt="Jenkins" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
</p>

---

## ⚙️ Prerequisites

- **Node.js**: Version 18 or higher (Node 20 recommended)
- **Package Manager**: `npm`
- **Database**: A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or a local MongoDB instance
- **API Keys** *(optional)*: An [Apify](https://apify.com/) token for live Instagram lookups
- **Docker** *(optional)*: For the one-command container setup

---

## 🚀 Installation & Setup

### 1. Backend Setup

1. Clone the repository and open the backend folder:
   ```bash
   git clone https://github.com/Reyhaan5/Influenza.git
   cd Influenza/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env

   # Linux / macOS
   cp .env.example .env
   # Edit .env with your MongoDB URI, JWT secret and Apify token
   ```

4. Start the API in development mode (auto-restart with nodemon):
   ```bash
   npm run dev
   ```
   *The API will run at `http://localhost:5000`.*

> **Note:** On restricted networks (some campus or corporate Wi-Fi), MongoDB Atlas SRV DNS lookups can fail. If you see connection errors, check `backend/config/db.js`: it should force public DNS resolvers (`8.8.8.8`, `1.1.1.1`) and prefer IPv4. Do not remove that workaround during refactors.

---

### 2. Frontend Setup

1. Open a new terminal in the project root:
   ```bash
   cd Influenza
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The web client will launch at `http://localhost:5173`.*

---

### 3. Run Everything with Docker (Optional)

`docker-compose.yml` starts MongoDB, the backend and an Nginx-served frontend together:

1. Create a root `.env` (see `.env.example`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   CLIENT_URL=http://localhost:3000
   JWT_SECRET=change_this_to_a_long_secure_random_string
   ```

2. Build and start:
   ```bash
   docker compose up --build
   ```

| Service | Container | URL |
|---------|-----------|-----|
| Frontend (Nginx) | `influenza_frontend` | `http://localhost:3000` |
| Backend (Express) | `influenza_backend` | `http://localhost:5000` |
| MongoDB 7 | `influenza_mongodb` | `mongodb://localhost:27017` |

---

### 4. Seed Demo Creators (Optional)

Populate the discovery pages with sample creators:

```bash
cd backend
node scripts/seedMumbaiInfluencers.js
node scripts/seedMicroInfluencers.js
```

---

## 🔧 Configuration & Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example / Default |
|----------|-------------|-------------------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/influenza` |
| `JWT_SECRET` | Secret used to sign JWTs | *(use a long random string)* |
| `PORT` | API port | `5000` |
| `CLIENT_URL` | Allowed frontend origin(s), comma-separated | `http://localhost:5173` |
| `APIFY_TOKEN` | Single Apify token (legacy) | `your_apify_api_token_here` |
| `APIFY_TOKENS` | Comma-separated list of Apify tokens | `token1,token2,token3` |
| `APIFY_TOKEN_1` … `APIFY_TOKEN_10` | Numbered Apify tokens | `your_apify_token_1` |
| `IG_BUSINESS_ACCOUNT_ID` | Instagram business account linked to a Facebook Page | `1784...` |
| `FB_PAGE_ACCESS_TOKEN` | Long-lived Facebook Page access token | `EAAB...` |

> 💡 **Apify failover:** if one token hits a rate limit, credit limit or auth error (401 / 402 / 403 / 429), the service automatically moves to the next token.

### Frontend (root `.env`)

| Variable | Description | Example / Default |
|----------|-------------|-------------------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

> ⚠️ Never commit real `.env` files or secrets. Pass `JWT_SECRET` at runtime rather than hardcoding it in a Dockerfile.

---

## 📜 Available Scripts

**Frontend** (project root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

**Backend** (`backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the API with nodemon (auto-restart) |
| `npm start` | Start the API in production mode |

---

## 🔁 CI/CD & DevOps

- **Jenkins** (`Jenkinsfile`): A 3-stage Windows pipeline named *Install → Build → Run*. It runs `npm ci`, then `npm run build`, then serves the production build with `vite preview` on port `4173`.
- **Docker** (`Dockerfile.frontend`): Multi-stage build that compiles the Vite app on Node 20, then serves `dist/` from Nginx.
- **Docker** (`backend/Dockerfile.backend`): Node 20 Alpine image running `node server.js` on port `5000`.
- **Docker Compose**: Three containers (MongoDB, backend, frontend) on one bridge network with a persistent database volume.
- **Hosting**: Frontend on Vercel, backend on Render, database on MongoDB Atlas.

---

## 📡 API Reference

All routes are prefixed with `/api`. Routes marked 🔒 need an `Authorization: Bearer <token>` header.

### Authentication
- `POST /auth/register`: Create a brand or influencer account.
- `POST /auth/login`: Log in and receive a JWT.
- `GET /auth/me` 🔒: Get the current user.
- `PUT /auth/update-password` 🔒: Change password.

### Public (no login)
- `GET /public/creator-discovery`: Search and filter creators.
- `GET /public/creators-by-category`: Browse creators by niche.
- `GET /public/creators/:id`: Public creator profile.
- `GET /public/gallery`: Public content gallery.
- `GET /public/instagram-lookup`: Look up an Instagram handle's stats.
- `POST /public/influrate/calculate`: Calculate a rate card from stats.

### Influencer 🔒
- `GET | PUT /influencer/profile`: View and update the profile.
- `PUT /influencer/match-profile`: Update collaboration preferences.
- `GET /influencer/dashboard`: Dashboard stats.
- `POST | DELETE /influencer/social-accounts`: Connect or remove social accounts.
- `GET | POST | PUT /influencer/rate-card`: Manage rate cards.
- `GET /influencer/insider-rate`: Performance-adjusted market rate.
- `POST /influencer/refresh-instagram-stats`: Re-sync Instagram data.
- `GET /influencer/opportunities`: Open campaigns to apply to.
- `GET /influencer/collaborations` and `GET /influencer/reviews`: Deals and reviews.
- `POST | GET | DELETE /influencer/gallery`, `PATCH /influencer/gallery/:id/highlight`: Portfolio management.

### Brand 🔒
- `GET /brand/profile`, `GET /brand/dashboard`, `PUT /brand/profile/company`: Profile and stats.
- `GET | POST | PUT | DELETE /brand/brands`: Sub-brands.
- `GET | POST | DELETE /brand/team`: Team members and invitations.
- `GET | POST | PUT | DELETE /brand/products`: Product catalog.
- `GET | POST | PUT | DELETE /brand/campaigns`: Campaigns.
- `GET /brand/search-creators`: Creator search.
- `GET | POST | DELETE /brand/saved-creators`: Saved creators.
- `GET | PUT /brand/collaborations`: Collaboration pipeline.
- `POST /brand/reviews` and `GET /brand/reviews/:collabId`: Creator reviews.
- `GET /brand/creatives`: Creative library.

### Collaboration Requests 🔒
- `POST /collaboration-requests`: Send an invite or application.
- `GET /collaboration-requests`: List my requests.
- `PUT /collaboration-requests/:id`: Accept or reject.

### Deliverables 🔒
- `GET /collaborations/:collabId/deliverables`: List deliverables.
- `POST /collaborations/:collabId/deliverables`: Creator submits a draft or live post.
- `PATCH /collaborations/:collabId/deliverables/:deliverableId/review`: Brand approves or requests a revision.

### Messaging 🔒
- `POST | GET /messages/conversations`: Create or list conversations.
- `GET /messages/conversations/:id/messages`: Message history.
- `DELETE /messages/conversations/:id`: Delete a conversation.

### Socket.IO Events
| Event | Direction | Purpose |
|-------|-----------|---------|
| `joinConversation` / `leaveConversation` | Client → Server | Enter or leave a chat room |
| `sendMessage` | Client → Server | Save and broadcast a message |
| `typing` / `stopTyping` | Both | Typing indicators |
| `markRead` | Client → Server | Read receipts |
| `newMessage` | Server → Client | A new message in the room |
| `conversationUpdated` | Server → Client | Update conversation list previews |

---

## 🗂 Project Structure

```
Influenza/
├── src/                          # Frontend (React + Vite)
│   ├── components/
│   │   ├── dashboard/            # brand/ (incl. campaign-wizard/), influencer/, common/
│   │   ├── auth/ chat/ gallery/ hero/ onboarding/ profile/ ui/ ...
│   ├── pages/                    # Route-level pages
│   ├── context/                  # AuthContext, SocketContext, BrandContext
│   ├── routes/                   # AppRoutes, ProtectedRoute
│   ├── utils/                    # pricingEngine, influRateCalculator, influRateEngine
│   ├── config/api.js             # Axios instance + API URL config
│   └── theme/                    # colors.css, typography.css (design tokens)
│
├── backend/
│   ├── config/                   # db.js, cors.js
│   ├── models/                   # 18 Mongoose schemas
│   ├── controllers/              # Business logic per feature
│   ├── routes/                   # Express routers
│   ├── middleware/               # auth, upload, error handling
│   ├── services/                 # Instagram (Apify) + stats
│   ├── socket/                   # Socket.IO server
│   ├── scripts/                  # Seeding and scraping utilities
│   └── server.js                 # App entry point
│
├── Dockerfile.frontend
├── docker-compose.yml
├── Jenkinsfile
└── vite.config.js
```

---

## 🎨 Design System

Influenza uses a token-based design system defined in `src/theme/colors.css` and `src/theme/typography.css`:

- **Primary Accent**: Sky Blue (`#1E9DF1`) for actions, links and active states.
- **Surfaces**: Soft neutrals (`#F7F8F8` page, `#FFFFFF` cards) with `#E1EAEF` borders.
- **Text**: `#0F1419` primary, `#536471` secondary.
- **Typography**: [Inter Variable](https://rsms.me/inter/), the only font family used.
- **Status Colors**: Green, amber and red, used only to communicate state.
- **Rules**: Components use CSS custom properties (`var(--color-*)`) instead of hardcoded values, and every interactive element has a visible focus state (WCAG 2.2 AA).

---

## 🛣 Roadmap

- [ ] Move file uploads from local disk to Cloudinary or S3 (disk storage is wiped on each Render redeploy)
- [ ] Add automated tests (API and UI)
- [ ] Extend the Jenkins pipeline to the backend and Docker image builds
- [ ] Support more social platforms beyond Instagram
- [ ] Payment and payout integration

---

## 👥 Team

- **Reyhaan** ([@Reyhaan5](https://github.com/Reyhaan5)): Full-stack development
- **Arya** ([@umert024](https://github.com/umert024)): Frontend and brand-side dashboards

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/amazing-feature`).
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`).
4. Push to the branch (`git push origin feat/amazing-feature`).
5. Open a Pull Request against `main`.

---
