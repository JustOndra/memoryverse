import {
  FORTNITE_API_LIMIT,
  FORTNITE_API_URL,
  FORTNITE_COUNT,
  POKE_API_URL,
  POKEMON_COUNT,
  STARWARS_API_URL,
  STARWARS_COUNT,
  STARWARS_MAIN_CHARACTERS,
} from '../constants';
import { supabaseClient } from '../lib/supabaseClient';
import {
  shuffleCards,
  transformFortniteData,
  transformPokemonData,
  transformStarWarsData,
} from '../lib/utils';
import {
  CardData,
  FortniteData,
  GameType,
  PokemonData,
  StarWarsData,
} from '../types';

export const fetchGameData = async (
  gameType: GameType
): Promise<CardData[]> => {
  try {
    switch (gameType) {
      case 'pokemon': {
        const randomIds = new Set<number>();
        while (randomIds.size < POKEMON_COUNT) {
          randomIds.add(Math.floor(Math.random() * 151) + 1);
        }

        const responses = await Promise.all(
          [...randomIds].map(async (id) => {
            const res = await fetch(`${POKE_API_URL}${id}`);
            if (!res.ok) {
              throw new Error(`Failed to fetch Pokemon with id ${id}`);
            }
            return res.json() as Promise<PokemonData>;
          })
        );

        const cards = responses.map(transformPokemonData);
        return shuffleCards([...cards, ...cards]);
      }

      case 'fortnite': {
        const url = new URL(`${FORTNITE_API_URL}/search/all`);
        url.searchParams.append('limit', FORTNITE_API_LIMIT.toString());
        url.searchParams.append('type', 'outfit');

        const res = await fetch(url.toString());
        if (!res.ok) {
          throw new Error('Failed to fetch Fortnite data');
        }

        const response = (await res.json()) as { data: FortniteData[] };

        if (!response.data || !Array.isArray(response.data)) {
          console.error('Unexpected API response:', response);
          throw new Error('Invalid Fortnite API response format');
        }

        const allItems = response.data;
        if (allItems.length < FORTNITE_COUNT) {
          throw new Error('Not enough items returned from Fortnite API');
        }

        const randomItems: FortniteData[] = [];
        while (randomItems.length < FORTNITE_COUNT) {
          const randomIndex = Math.floor(Math.random() * allItems.length);
          const item = allItems[randomIndex];
          if (!randomItems.find((existing) => existing.id === item.id)) {
            randomItems.push(item);
          }
        }

        const items = randomItems.map(transformFortniteData);
        return shuffleCards([...items, ...items]);
      }

      case 'starwars': {
        const res = await fetch(STARWARS_API_URL);
        if (!res.ok) {
          throw new Error('Failed to fetch Star Wars data');
        }

        const allCharacters = (await res.json()) as StarWarsData[];

        // Filter for main characters with valid images
        const validCharacters = allCharacters.filter(
          (char) =>
            char.image &&
            char.image.trim() !== '' &&
            STARWARS_MAIN_CHARACTERS.includes(char.name)
        );

        if (validCharacters.length < STARWARS_COUNT) {
          throw new Error(
            'Not enough main characters with images found in Star Wars API'
          );
        }

        const randomCharacters: StarWarsData[] = [];
        while (randomCharacters.length < STARWARS_COUNT) {
          const randomIndex = Math.floor(
            Math.random() * validCharacters.length
          );
          const character = validCharacters[randomIndex];
          if (
            !randomCharacters.find((existing) => existing.id === character.id)
          ) {
            randomCharacters.push(character);
          }
        }

        const characters = randomCharacters.map(transformStarWarsData);
        return shuffleCards([...characters, ...characters]);
      }

      default:
        throw new Error('Unsupported game type');
    }
  } catch (error) {
    console.error(`Error fetching ${gameType} data:`, error);
    throw new Error(`Failed to load ${gameType} data`);
  }
};

interface GameScore {
  playerName: string;
  gameType: GameType;
  score: number;
  timeSeconds: number;
}

export const saveScore = async (gameScore: GameScore): Promise<void> => {
  try {
    const { data, error } = await supabaseClient.from('scores').insert([
      {
        player_name: gameScore.playerName,
        game_type: gameScore.gameType,
        score: gameScore.score,
        time_seconds: gameScore.timeSeconds,
      },
    ]);

    if (error) {
      console.error('Error saving score:', error);
      throw new Error(`Failed to save score: ${error.message}`);
    }

    console.log('Score saved successfully:', data);
  } catch (error) {
    console.error('Error in saveScore:', error);
    throw error;
  }
};
