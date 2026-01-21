# Memoryverse

Memoryverse is a modern twist on the classic memory game, designed to keep your mind sharp and entertained. Explore vibrant worlds inspired by popular themes like Pokémon, Fortnite, and The Simpsons, each with its own beautiful design.

You can play solo to challenge yourself or enjoy a game with friends locally. We’re also working on an exciting online multiplayer mode so you can play with anyone, anywhere. It’s the perfect way to have fun while giving your brain a workout!

## Features

-   **Immersive Themes**: Choose from Pokémon, Fortnite, or The Simpsons.
-   **Solo & Multiplayer**: Beat your personal best or compete with friends locally.
-   **Leaderboards**: Track top scores and rankings (powered by Supabase).
-   **Coming Soon**: Online Multiplayer mode.

## Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Build Tool**: Vite
-   **Backend**: Supabase (Database & Realtime)

## Setup & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd memoryverse
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Supabase credentials (found in your Supabase project settings):
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    *Note: If you don't have these, you can still run the app, but leaderboards won't function.*

4.  **Start the development server:**
    ```bash
    pnpm dev
    ```

## Supabase Integration (Optional)

To enable leaderboards and multiplayer features:
1.  Create a project at [Supabase](https://app.supabase.com).
2.  Run the SQL schema found in `supabase/schema.sql` in your Supabase SQL editor.
3.  Add the project URL and Anon Key to your `.env.local`.
