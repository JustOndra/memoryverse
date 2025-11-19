# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
};
```

## Supabase Integration (Multiplayer & Scores)

This project includes a minimal Supabase integration for multiplayer match state and leaderboards.

- Supabase client: `src/lib/supabase.ts`
- Service helpers: `src/services/supabase.ts`
- DB schema: `supabase/schema.sql`

Setup steps

1. Create a Supabase project at https://app.supabase.com and copy the project URL and anon/public key.
2. Add the variables to your local environment (or CI) using the keys in `.env.example`:

```bash
# example .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

3. Apply the SQL schema. You can run the SQL in the Supabase SQL editor or via `psql` if you have DB access:

```sql
-- copy the contents of `supabase/schema.sql` into the Supabase SQL editor and run it
```

4. Install the new dependency:

```bash
# using pnpm (recommended for this repo)
pnpm add @supabase/supabase-js
```

5. Start the dev server:

```bash
pnpm dev
```

Usage notes

- `src/services/supabase.ts` exposes helpers: `saveScore`, `getTopScores`, `createOrUpdateMatch`, `getMatch`, and `subscribeToMatch`.
- `subscribeToMatch` uses Supabase Realtime (Postgres changes) to receive updates for a specific match.
- For production, keep sensitive keys (service role) only on server-side processes.

If you'd like, I can wire up basic UI hooks (leaderboard screen and a multiplayer lobby) next.

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
