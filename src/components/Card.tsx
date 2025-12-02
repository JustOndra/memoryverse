import fortniteCard from '../assets/images/fortnite-card.jpg';
import pokemonCard from '../assets/images/pokemon-card.jpg';
import starwarsCard from '../assets/images/starwars-card.jpg';

import { CardData, GameType } from '../types';

type CardProps = {
  card: CardData;
  isFlipped: boolean;
  index: number;
  handleFlip: (index: number) => void;
  isMatched: boolean;
  gameType: GameType;
};

const Card = ({
  card,
  isFlipped,
  handleFlip,
  index,
  isMatched,
  gameType,
}: CardProps) => {
  const cardClasses = `
    cursor-pointer 
    w-40 
    h-40 
    hover:scale-110 
    duration-500
    perspective-midrange
    ${isMatched ? 'invisible' : ''}
  `;

  const innerCardClasses = `
    relative 
    transform-3d
    w-full 
    h-full 
    duration-1000
    ${isFlipped ? 'rotate-y-180' : ''}
  `;

  const getCardBackground = () => {
    switch (gameType) {
      case 'pokemon':
        return pokemonCard;
      case 'fortnite':
        return fortniteCard;
      case 'starwars':
        return starwarsCard;
      default:
        return pokemonCard;
    }
  };

  return (
    <div className={cardClasses} onClick={() => handleFlip(index)}>
      <div className={innerCardClasses}>
        <div
          className={`absolute w-full h-full flex justify-center items-center backface-hidden bg-cover bg-center`}
          style={{ backgroundImage: `url(${getCardBackground()})` }}
        >
          {/* <img src={getBackImage()} alt="Card Back" className={`w-36 h-40`} /> */}
        </div>
        <div
          className={`absolute w-full h-full overflow-hidden backface-hidden rotate-y-180 bg-cover bg-center`}
        >
          <div className="flex items-center justify-center bg-white w-full h-full">
            <img src={card.image} alt={card.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
