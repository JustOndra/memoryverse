import { useEffect, useState } from 'react';
import { CARD_FLIP_DELAY_MS, CARD_MATCH_DELAY_MS } from '../constants';
import { CardData } from '../types';

export const useFlipCard = (
  cards: CardData[] | undefined,
  options?: {
    onMatch?: (streak: number) => void;
    onMismatch?: () => void;
    resetTrigger?: number;
  }
) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<(string | number)[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [streak, setStreak] = useState(0);

  // Reset state when resetTrigger changes
  useEffect(() => {
    setFlippedCards([]);
    setMatchedCards([]);
    setDisabled(false);
    setStreak(0);
  }, [options?.resetTrigger]);

  useEffect(() => {
    if (flippedCards.length < 2 || !cards) return;

    setDisabled(true);
    const [firstIndex, secondIndex] = flippedCards;

    if (cards[firstIndex].id === cards[secondIndex].id) {
      setTimeout(() => {
        setMatchedCards((prev) => [...prev, cards[firstIndex].id]);
        setFlippedCards([]);
        setDisabled(false);
        setStreak((prev) => {
          const newStreak = prev + 1;
          if (options?.onMatch) options.onMatch(newStreak);
          return newStreak;
        });
      }, CARD_MATCH_DELAY_MS);
    } else {
      setTimeout(() => {
        setFlippedCards([]);
        setDisabled(false);
        setStreak(0);
        if (options?.onMismatch) options.onMismatch();
      }, CARD_FLIP_DELAY_MS);
    }
  }, [flippedCards, cards]);

  const handleFlip = (index: number) => {
    if (disabled || flippedCards.length >= 2 || flippedCards.includes(index))
      return;
    setFlippedCards((prev) => [...prev, index]);
  };

  return {
    flippedCards,
    matchedCards,
    handleFlip,
    disabled,
    streak,
  };
};
