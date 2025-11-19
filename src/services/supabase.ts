import supabaseClient from '../lib/supabaseClient';

export interface SaveScorePayload {
  player_name: string;
  score: number;
  game_type: string;
  time_seconds?: number;
}

export const saveScore = async (payload: SaveScorePayload) => {
  const { data, error } = await supabaseClient.from('scores').insert([payload]);
  if (error) throw error;
  return data;
};

export const getTopScores = async (game_type: string, limit = 10) => {
  const { data, error } = await supabaseClient
    .from('scores')
    .select('*')
    .eq('game_type', game_type)
    .order('score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};

export const createOrUpdateMatch = async (
  id: string,
  state: Record<string, any>
) => {
  const payload = { id, state };
  const { data, error } = await supabaseClient
    .from('matches')
    .upsert(payload, { onConflict: 'id' });
  if (error) throw error;
  return data;
};

export const getMatch = async (id: string) => {
  const { data, error } = await supabaseClient
    .from('matches')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// Subscribe to real-time updates for a given match id.
// Returns the subscription/channel object — caller should call `unsubscribe()` when done.
export const subscribeToMatch = (
  id: string,
  onUpdate: (payload: any) => void
) => {
  const channel = supabaseClient
    .channel(`public:matches:id=eq.${id}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'matches', filter: `id=eq.${id}` },
      (payload) => onUpdate(payload)
    )
    .subscribe();

  const unsubscribe = async () => {
    try {
      // supabase v2 channel API: remove the channel
      // If the runtime provides `channel.unsubscribe()` that will also work.
      await supabaseClient.removeChannel(channel);
    } catch (e) {
      // best-effort
    }
  };

  return { channel, unsubscribe };
};
