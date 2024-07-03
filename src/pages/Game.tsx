import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { PokemonData } from '../types';

interface GameProps {
  data: PokemonData[];
}

const Game = ({ data }: GameProps) => {
  const [choiceOne, setChoiceOne] = useState<number | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<number | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [firstPick, setFirstPick] = useState(true);
  const [flippedCards, setFlippedCards] = useState<{
    [key: number]: boolean;
  }>({});

  const resetFlippedCards = () => {
    setFlippedCards({});
    setChoiceOne(null);
    setChoiceTwo(null);
    setFirstPick(true);
    setDisabled(false);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (choiceOne !== null && choiceTwo !== null) {
      if (choiceOne === choiceTwo) {
        setDisabled((prev) => !prev);
        setMatchedCards((prevMatchedCards) => [...prevMatchedCards, choiceOne]);
        timeout = setTimeout(() => {
          resetFlippedCards();
        }, 1000);
      } else {
        setDisabled((prev) => !prev);
        timeout = setTimeout(() => {
          resetFlippedCards();
        }, 1000);
      }
    }
    return () => clearTimeout(timeout);
  }, [choiceOne, choiceTwo]);

  const handleFlip = (index: number, id: number) => {
    if (disabled) return;
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
    if (firstPick) {
      setChoiceOne(id);
      setFirstPick(false);
    } else {
      setChoiceTwo(id);
      setFirstPick(true);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="grid grid-cols-4 gap-4">
        {data.map((pokemon, index) => (
          <Card
            data={pokemon}
            key={index}
            index={index}
            isMatched={!!matchedCards.includes(pokemon.id)}
            isFlipped={!!flippedCards[index]}
            handleFlip={handleFlip}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;
