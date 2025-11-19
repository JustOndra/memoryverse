import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockChannel: any = {
  _handler: undefined,
  on(evt: any, opts: any, handler: any) {
    this._handler = handler;
    return this;
  },
  subscribe() {
    return { id: 'mock-channel' };
  },
};

const mockSupabase: any = {
  from: vi.fn(),
  channel: vi.fn(() => mockChannel),
  removeChannel: vi.fn(async () => {}),
};

vi.mock('../../lib/supabaseClient', () => ({
  default: mockSupabase,
}));

import {
  createOrUpdateMatch,
  getMatch,
  getTopScores,
  saveScore,
  subscribeToMatch,
} from '../supabase';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('supabase service', () => {
  it('saveScore inserts and returns data', async () => {
    const payload = { player_name: 'Bob', score: 10, game_type: 'pokemon' };

    const insertMock = vi.fn(async () => ({ data: [payload], error: null }));
    mockSupabase.from.mockImplementation((table: string) => ({
      insert: insertMock,
    }));

    const data = await saveScore(payload as any);
    expect(insertMock).toHaveBeenCalledWith([payload]);
    expect(data).toEqual([payload]);
  });

  it('saveScore throws when supabase returns error', async () => {
    const payload = { player_name: 'Eve', score: 5, game_type: 'starwars' };
    const insertMock = vi.fn(async () => ({
      data: null,
      error: new Error('insert failed'),
    }));
    mockSupabase.from.mockImplementation(() => ({ insert: insertMock }));

    await expect(saveScore(payload as any)).rejects.toThrow('insert failed');
  });

  it('getTopScores returns ordered scores', async () => {
    const scores = [
      { player_name: 'A', score: 200 },
      { player_name: 'B', score: 150 },
    ];

    // chain: select().eq().order().limit()
    const limitMock = vi.fn(async () => ({ data: scores, error: null }));
    const orderMock = vi.fn(() => ({ limit: limitMock }));
    const eqMock = vi.fn(() => ({ order: orderMock }));
    const selectMock = vi.fn(() => ({ eq: eqMock }));

    mockSupabase.from.mockImplementation(() => ({ select: selectMock }));

    const data = await getTopScores('pokemon', 2);
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(eqMock).toHaveBeenCalledWith('game_type', 'pokemon');
    expect(orderMock).toHaveBeenCalledWith('score', { ascending: false });
    expect(limitMock).toHaveBeenCalledWith(2);
    expect(data).toEqual(scores);
  });

  it('createOrUpdateMatch upserts and returns data', async () => {
    const id = 'match-1';
    const state = { foo: 'bar' };
    const upsertMock = vi.fn(async () => ({
      data: [{ id, state }],
      error: null,
    }));
    mockSupabase.from.mockImplementation(() => ({ upsert: upsertMock }));

    const data = await createOrUpdateMatch(id, state);
    expect(upsertMock).toHaveBeenCalledWith(
      { id, state },
      { onConflict: 'id' }
    );
    expect(data).toEqual([{ id, state }]);
  });

  it('getMatch returns a single match', async () => {
    const id = 'match-42';
    const singleMock = vi.fn(async () => ({
      data: { id, state: { x: 1 } },
      error: null,
    }));
    const eqMock = vi.fn(() => ({ single: singleMock }));
    const selectMock = vi.fn(() => ({ eq: eqMock }));

    mockSupabase.from.mockImplementation(() => ({ select: selectMock }));

    const data = await getMatch(id);
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(eqMock).toHaveBeenCalledWith('id', id);
    expect(singleMock).toHaveBeenCalled();
    expect(data).toEqual({ id, state: { x: 1 } });
  });

  it('subscribeToMatch returns channel and allows unsubscribe', async () => {
    const id = 'match-sub';
    const onUpdate = vi.fn();

    // channel() returns mockChannel already
    mockSupabase.channel.mockImplementation(() => mockChannel);

    const { channel, unsubscribe } = subscribeToMatch(id, onUpdate);
    expect(mockSupabase.channel).toHaveBeenCalled();
    expect(channel).toBe(mockChannel);

    // simulate an update from Supabase
    mockChannel._handler?.({ event: 'INSERT', new: { id } });
    // The service's onUpdate just forwards the payload to our callback
    expect(onUpdate).toHaveBeenCalledWith({ event: 'INSERT', new: { id } });

    await unsubscribe();
    expect(mockSupabase.removeChannel).toHaveBeenCalledWith(channel);
  });
});
