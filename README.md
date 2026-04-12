# Testimonial Hub

A production-ready testimonial landing page with an admin panel.

## Features
- **Public Landing Page**: Showcase video and written testimonials.
- **Admin Dashboard**: Statistics and overview of feedback.
- **Testimonial Management**: Full CRUD for testimonials including video/thumbnail uploads to Supabase Storage.
- **Settings**: Manage contact information and social links.
- **Authentication**: Secure admin login via Supabase Auth.
- **Dark Mode**: Built-in theme switching.

## Setup Instructions

### 1. Supabase Setup
1. Create a new project at [Supabase](https://supabase.com).
2. Run the SQL provided in `schema.sql` in the Supabase SQL Editor.
3. Go to **Storage** and create a new public bucket named `testimonials`.
4. Enable **Email/Password** authentication in the Auth settings.
5. Create an admin user in the Auth > Users section.

### 2. Environment Variables
Create a `.env` file (or set in your deployment platform):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Local Development
```bash
npm install
npm run dev
```

### 4. Deployment (Vercel)
1. Push your code to a GitHub repository.
2. Connect the repository to [Vercel](https://vercel.com).
3. Add the environment variables in the Vercel project settings.
4. Deploy!

## Tech Stack
- React 19
- Vite
- Tailwind CSS 4
- shadcn/ui
- Supabase (Auth, DB, Storage)
- Framer Motion (Animations)
- Lucide React (Icons)
- React Hook Form + Zod (Forms)
- Recharts (Dashboard Stats)
