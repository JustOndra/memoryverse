# Winner State Implementation Guide

## Overview

The game now detects when all cards are matched, stops the timer, displays a "Winner!" message, and provides functionality to save scores to a Supabase database.

## Features Implemented

### 1. Win Condition Detection

- The `Game.tsx` component now monitors the `matchedCards` array
- When the number of matched cards equals half the total cards, the game triggers the win state
- The win condition is checked after each card match

### 2. Timer Management

- The timer automatically stops when the game is won
- A new `timerActive` state in `App.tsx` controls timer lifecycle
- Timer is disabled when transitioning to the `GAME_WON` state

### 3. Winner Screen

- Displays "Winner!" message in large, bold text
- Shows final game statistics:
  - Player Name
  - Game Type (pokemon/fortnite/starwars)
  - Final Score
  - Total Time
- Provides two action buttons:
  - "Play Again" - Returns to game setup
  - "Main Menu" - Returns to main menu

### 4. Supabase Integration

A `saveScore()` method has been added to `api.ts` that:

- Accepts game score data (playerName, gameType, score, timeSeconds)
- Saves the data to the Supabase `game_scores` table
- Requires proper environment configuration

## Setup Instructions

### 1. Install Supabase Client

```bash
pnpm add @supabase/supabase-js
```

### 2. Create .env.local file

Create a `.env.local` file in the project root with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

You can find these values in your Supabase project settings.

### 3. Create Supabase Table

In your Supabase project, create a `game_scores` table with the following schema:

```sql
CREATE TABLE game_scores (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  player_name TEXT NOT NULL,
  game_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  time_seconds INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Enable Row Level Security (Optional but Recommended)

Configure RLS policies to allow unauthenticated inserts:

```sql
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON game_scores
  FOR INSERT WITH CHECK (true);
```

## Usage

### Calling saveScore Manually

You can call the `saveScore` function from anywhere in your app:

```typescript
import { saveScore } from '../services/api';

await saveScore({
  playerName: 'John Doe',
  gameType: 'pokemon',
  score: 150,
  timeSeconds: 245,
});
```

### Current Implementation

Currently, the winner screen displays all game information but doesn't automatically save the score. You can add a button to save the score, or integrate the save call into the `onGameWon` callback.

## Example: Adding a Save Score Button

To add score saving to the winner screen, you could update the winner screen in `App.tsx`:

```typescript
const [isSaving, setIsSaving] = useState(false);

const handleSaveScore = async () => {
  try {
    setIsSaving(true);
    await saveScore({
      playerName: settings.playerName,
      gameType: settings.gameType,
      score: score,
      timeSeconds: finalTime,
    });
    // Show success message
    alert('Score saved successfully!');
  } catch (error) {
    console.error('Failed to save score:', error);
    alert('Failed to save score');
  } finally {
    setIsSaving(false);
  }
};

// In the winner screen JSX:
<button
  className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 disabled:opacity-50"
  onClick={handleSaveScore}
  disabled={isSaving}
>
  {isSaving ? 'Saving...' : 'Save Score'}
</button>;
```

## Files Modified

1. **src/App.tsx**

   - Added `timerActive` state to control timer lifecycle
   - Added `finalTime` state to store the time when game was won
   - Added `handleGameWon` callback
   - Added `GAME_WON` step to the game flow
   - Added winner screen UI with game results

2. **src/pages/Game.tsx**

   - Added `onGameWon` callback prop
   - Added `useEffect` hook to detect win condition
   - Detects when all cards are matched and triggers win state

3. **src/services/api.ts**

   - Added `saveScore` function for Supabase integration
   - Added `GameScore` interface

4. **src/types/enums.ts**

   - Added `GAME_WON` to the `GameStep` enum

5. **.env.example**
   - Created example environment variables file

## Error Handling

The `saveScore` function includes error handling for:

- Missing Supabase configuration
- API errors from Supabase
- Network errors

All errors are logged to the console and re-thrown for handling at the call site.

## Notes

- The timer stops immediately when all cards are matched
- The winner screen is modal-like and prevents further interaction with the game board
- Score saving is decoupled from the UI, allowing flexible integration
- The implementation uses Vite environment variables (VITE\_ prefix) for client-side configuration
