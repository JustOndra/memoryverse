import { useCallback, useEffect, useRef, useState } from 'react';
import { CARD_FLIP_DELAY_MS, CARD_MATCH_DELAY_MS } from '../constants';
import { CardData } from '../types';

interface UseFlipCardOptions {
  onMatch?: (streak: number) => void;
  onMismatch?: () => void;
  resetTrigger?: number;
}

export const useFlipCard = (
  cards: CardData[] | undefined,
  options?: UseFlipCardOptions
) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<(string | number)[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [streak, setStreak] = useState(0);

  const onMatchRef = useRef(options?.onMatch);
  const onMismatchRef = useRef(options?.onMismatch);

  useEffect(() => {
    onMatchRef.current = options?.onMatch;
    onMismatchRef.current = options?.onMismatch;
  }, [options?.onMatch, options?.onMismatch]);

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
      const timeoutId = setTimeout(() => {
        setMatchedCards((prev) => [...prev, cards[firstIndex].id]);
        setFlippedCards([]);
        setDisabled(false);
        setStreak((prev) => {
          const newStreak = prev + 1;
          onMatchRef.current?.(newStreak);
          return newStreak;
        });
      }, CARD_MATCH_DELAY_MS);
      return () => clearTimeout(timeoutId);
    } else {
      const timeoutId = setTimeout(() => {
        setFlippedCards([]);
        setDisabled(false);
        setStreak(0);
        onMismatchRef.current?.();
      }, CARD_FLIP_DELAY_MS);
      return () => clearTimeout(timeoutId);
    }
  }, [flippedCards, cards]);

  const handleFlip = useCallback(
    (index: number) => {
      if (disabled || flippedCards.length >= 2 || flippedCards.includes(index))
        return;
      setFlippedCards((prev) => [...prev, index]);
    },
    [disabled, flippedCards]
  );

  return {
    flippedCards,
    matchedCards,
    handleFlip,
    disabled,
    streak,
  };
};
