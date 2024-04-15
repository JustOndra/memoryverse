import { useState } from 'react';
import { PokemonData } from '../utils/fetchPokemons';

const Card = (data: PokemonData) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="cursor-pointer perspective w-48 h-48" onClick={handleFlip}>
      <div
        className={`relative preserve-3d ${
          isFlipped ? 'my-rotate-y-180' : ''
        } w-full h-full duration-1000`}
      >
        <div className="absolute backface-hidden w-full h-full bg-gray-400 flex justify-center items-center">
          <img src="./pokeball.png" alt="Pokeball" className="w-24 h-24" />
        </div>
        <div className="absolute my-rotate-y-180 backface-hidden w-full h-full overflow-hidden">
          <div className="flex flex-col items-center gap-4">
            <img
              src={data.sprites.front_default}
              alt={data.name}
              className="w-36 h-36"
            />
            <p className="text-center text-black">{data.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
