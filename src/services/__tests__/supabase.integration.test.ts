import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

dotenv.config();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

const shouldRun = Boolean(url && serviceKey);
const describeIf = shouldRun ? describe : describe.skip;

describeIf(
  'Supabase integration tests (requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)',
  () => {
    let client: ReturnType<typeof createClient>;
    const testScore = {
      player_name: `test-player-${Date.now()}`,
      score: 123,
      game_type: 'pokemon',
      time_seconds: 60,
    } as any;

    const testMatchId = `test-match-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    beforeAll(() => {
      client = createClient(url!, serviceKey!, {
        auth: { persistSession: false },
      });
    });

    afterAll(async () => {
      await client
        .from('scores')
        .delete()
        .eq('player_name', testScore.player_name);
      await client.from('matches').delete().eq('id', testMatchId);
    });

    it('can insert and retrieve a score', async () => {
      const insertRes = await client.from('scores').insert([testScore]);
      expect(insertRes.error).toBeNull();
      expect(insertRes.data).toBeTruthy();

      const selectRes = await client
        .from('scores')
        .select('*')
        .eq('player_name', testScore.player_name)
        .limit(1);
      expect(selectRes.error).toBeNull();
      expect(Array.isArray(selectRes.data)).toBe(true);
      expect((selectRes.data as any[])[0].score).toBe(testScore.score);
    });

    it('can upsert, get and update a match', async () => {
      const initialState = { players: ['a'] };
      const upsertRes = await client
        .from('matches')
        .upsert({ id: testMatchId, state: initialState }, { onConflict: 'id' });
      expect(upsertRes.error).toBeNull();

      const getRes = await client
        .from('matches')
        .select('*')
        .eq('id', testMatchId)
        .single();
      expect(getRes.error).toBeNull();
      expect((getRes.data as any).state).toEqual(initialState);

      const newState = { players: ['a', 'b'] };
      const updateRes = await client
        .from('matches')
        .upsert({ id: testMatchId, state: newState }, { onConflict: 'id' });
      expect(updateRes.error).toBeNull();

      const getAfter = await client
        .from('matches')
        .select('*')
        .eq('id', testMatchId)
        .single();
      expect(getAfter.error).toBeNull();
      expect((getAfter.data as any).state).toEqual(newState);
    });
  }
);
