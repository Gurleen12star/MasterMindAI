# EchoVerse Roadmap Generator

An AI-powered learning roadmap generator built with React, TypeScript, Supabase, and Gemini AI.

## Features

- Generate personalized learning roadmaps using AI
- Interactive Mermaid diagrams with zoom and pan capabilities
- Save and view your roadmap history
- Responsive design with collapsible sidebar
- User authentication via Clerk

## Prerequisites

- Node.js (v16+)
- Supabase account
- Google AI (Gemini) API key
- Clerk account for authentication

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bolthackathon2.git
   cd bolthackathon2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your API keys and credentials:
     ```
     # Supabase Configuration
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     
     # Gemini API Configuration
     VITE_GEMINI_API_KEY=your_gemini_api_key
     
     # Clerk Authentication
     VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     ```

4. Set up your Supabase database:
   - Execute the SQL commands in `supabase-setup.sql` in your Supabase SQL editor
   - This will create the necessary tables and security policies

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Database Configuration

The application requires a Supabase database with the following setup:

- A `roadmaps` table to store user roadmaps
- Row Level Security (RLS) policies to ensure data privacy
- Service Role Key for admin operations

The SQL setup is included in `supabase-setup.sql`. For development, RLS is temporarily disabled, but you should enable it for production.

## Troubleshooting

### Database Connection Issues

If roadmaps aren't saving to the database:

1. Check that your `VITE_SUPABASE_SERVICE_ROLE_KEY` is set correctly
2. Verify that the `roadmaps` table exists in your Supabase project
3. Check the console logs for specific error messages

### Mermaid Rendering Issues

If diagrams aren't rendering correctly:

1. Check the console for any JavaScript errors
2. Verify that your Mermaid code is valid
3. Try refreshing the page

## License

[MIT License](LICENSE)
