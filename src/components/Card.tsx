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
    border-4 
    border-black
    w-full 
    h-full 
    duration-1000
    ${isFlipped ? 'rotate-y-180' : ''}
  `;

  const getBackImage = () => {
    return gameType === 'pokemon' ? './pokeball.png' : './vbucks.png';
  };

  return (
    <div className={cardClasses} onClick={() => handleFlip(index)}>
      <div className={innerCardClasses}>
        <div
          className={`absolute w-full h-full bg-white flex justify-center items-center backface-hidden`}
        >
          <img src={getBackImage()} alt="Card Back" className="w-24 h-24" />
        </div>
        <div
          className={`absolute w-full h-full bg-white overflow-hidden backface-hidden rotate-y-180`}
        >
          <div className="flex flex-col items-center gap-4">
            <img src={card.image} alt={card.name} className="w-36 h-36" />
            <p className="text-center text-black capitalize">{card.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
