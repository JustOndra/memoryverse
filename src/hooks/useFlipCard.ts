import { useEffect, useState } from 'react';
import { CARD_FLIP_DELAY, CARD_MATCH_DELAY } from '../constants';
import { CardData } from '../types';

export const useFlipCard = (cards: CardData[] | undefined) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<(string | number)[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (flippedCards.length < 2 || !cards) return;

    setDisabled(true);
    const [firstIndex, secondIndex] = flippedCards;

    if (cards[firstIndex].id === cards[secondIndex].id) {
      setTimeout(() => {
        setMatchedCards((prev) => [...prev, cards[firstIndex].id]);
        setFlippedCards([]);
        setDisabled(false);
      }, CARD_MATCH_DELAY);
    } else {
      setTimeout(() => {
        setFlippedCards([]);
        setDisabled(false);
      }, CARD_FLIP_DELAY);
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
  };
};
