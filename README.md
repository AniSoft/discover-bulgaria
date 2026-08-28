# Discover Bulgaria

![Status](https://img.shields.io/badge/status-production-183326)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white)

> Where the road becomes a story.

Discover Bulgaria is a bilingual travel discovery platform for exploring remarkable, authentic and lesser-known places across Bulgaria.

Visitors can discover destinations, search and browse categories. Registered users can save favorites and contribute new places. Administrators review and moderate community submissions before publication.

## Live Demo

Production: [https://discoverbulgaria.net](https://discoverbulgaria.net)

## Screenshots

### Home page

![Discover Bulgaria home page](public/readme/home.jpg)

### Explore and categories

![Explore and categories](public/readme/explore.jpg)

### Place details

![Place details page](public/readme/place-details.jpg)

### Map and directions

![Map and directions section](public/readme/map.jpg)


## About the Project

Discover Bulgaria is designed as a community-driven travel discovery platform focused on:

- interesting places across Bulgaria
- natural attractions
- historic and cultural locations
- hidden destinations
- local travel inspiration
- community contributions

The application supports both English and Bulgarian.

## Key Features

- English / Bulgarian localization
- responsive desktop, tablet and mobile interface
- destination search
- category filtering
- dynamic destination pages
- destination photo galleries and uploads
- interactive maps using Leaflet and OpenStreetMap
- Google Maps directions links
- user authentication
- registration and login
- user profile
- Add a Place workflow
- My Places
- Favorites
- photo upload
- moderation workflow
- Admin Dashboard
- Admin Manage Places
- approve / reject functionality
- place statuses:
  - For Review
  - Published
  - Rejected
- Supabase Row Level Security
- SSR with TanStack Start
- automatic Netlify deployment from GitHub

## User Roles

### Visitor

Visitors can:

- browse published destinations
- search
- filter by category
- view destination details
- use maps and directions
- switch between English and Bulgarian

### Registered User

Registered users can additionally:

- save favorites
- add new places
- manage their own submitted places
- edit permitted submissions
- upload destination photos
- manage their profile

### Administrator

Administrators can additionally:

- access the Admin Dashboard
- review submitted places
- approve or reject submissions
- edit and manage all places
- moderate content

## Tech Stack

### Frontend

- React
- TypeScript
- TanStack Start
- Vite
- Tailwind CSS v4 with shadcn/ui (Radix UI primitives) and Lucide icons

### Backend and Database

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security

### Maps

- Leaflet
- OpenStreetMap
- Google Maps external directions

### Development and Deployment

- Lovable
- GitHub
- Netlify
- Bun

## Architecture

```text
Lovable
   ↓
GitHub
   ↓
Netlify
   ↓
discoverbulgaria.net
```

A modern React application with server-side rendering is deployed continuously from GitHub to Netlify. Supabase provides authentication, the PostgreSQL database, storage for destination photos and row-level security policies.

## Security

- Supabase Row Level Security protects every table, so users can only read published content and manage their own records.
- Privileged credentials, including the Supabase service role key, are used only in server-only code and never reach the browser bundle.
- All secrets are stored as environment variables in the hosting environment, never in the source code.
- The local `.env` file is excluded from Git.
- `.env.example` contains variable names only, with no values.

## Environment Variables

Public, exposed to the browser:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Server only:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_SERVICE_ROLE_KEY`

## Local Development

Requires [Bun](https://bun.sh).

```bash
bun install
cp .env.example .env   # then fill in your own values
bun run dev            # start the development server
```

Available scripts:

```bash
bun run dev        # development server
bun run build      # production build
bun run build:dev  # development-mode build
bun run preview    # preview the production build
bun run lint       # ESLint
bun run format     # Prettier
```

## Deployment

```text
Lovable → GitHub → Netlify → discoverbulgaria.net
```

Changes are made in Lovable, pushed to GitHub and deployed automatically by Netlify. The `main` branch is the production branch. Server-side rendering is preserved on Netlify, so the application is not deployed as a static SPA.

## Project Status

Discover Bulgaria is an active production project and continues to receive content, feature and maintenance updates.

## License

All rights reserved unless otherwise specified.

---

Created by [AniDigit](https://www.anidigit.com/) · © 2026 Discover Bulgaria

