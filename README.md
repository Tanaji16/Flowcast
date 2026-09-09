# Flowcast 🌊

**Intelligent Event Flow & Crowd Dynamics Optimization Platform**

Flowcast is an end-to-end event crowd flow, venue capacity, and accommodation/transportation optimization platform. It bridges the gap between event organizers operating command centers and attendees navigating complex event environments.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase (PostgreSQL, Realtime, Auth, Edge Functions)](https://supabase.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
flowcast/
├── docs/                 # Hackathon docs, DB schema, API references
├── public/               # Static assets & illustrations
├── src/
│   ├── app/              # Next.js App Router routes
│   │   ├── (auth)/       # Authentication pages (login/signup)
│   │   ├── (attendee)/   # Attendee mobile/web experience
│   │   ├── (organizer)/  # Organizer command center & simulation
│   │   └── api/          # Serverless route handlers
│   ├── components/       # UI, Attendee, Organizer, Shared components
│   ├── hooks/            # Custom React hooks (Supabase realtime, auth)
│   ├── lib/              # Supabase clients, utilities, constants
│   ├── store/            # Client-side stores
│   └── types/            # Database and application typings
├── supabase/             # Migrations, seed data, edge functions
└── scripts/              # Helper generation scripts
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js >= 18
- npm / yarn / pnpm / bun
- Supabase CLI (optional for local emulation)

### 2. Installation
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials in `.env.local`.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.
