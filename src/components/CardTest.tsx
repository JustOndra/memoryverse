import { CardData } from '../types';

type IProps = {
  data: CardData;
  isFlipped: boolean;
  index: number;
  handleFlip: (index: number) => void;
  isMatched: boolean;
};

const CardTest = ({
  data,
  isFlipped,
  handleFlip,
  index,
  isMatched,
}: IProps) => {
  return (
    <div
      className={`${
        isMatched ? 'invisible' : ''
      } "cursor-pointer perspective w-40 h-40 hover:scale-110 duration-500"`}
      onClick={() => handleFlip(index)}
    >
      <div
        className={`relative preserve-3d border-4 border-black  ${
          isFlipped ? 'my-rotate-y-180' : ''
        } w-full h-full duration-1000`}
      >
        <div className="absolute backface-hidden w-full h-full bg-white flex justify-center items-center">
          <img src="./pokeball.png" alt="Pokeball" className="w-24 h-24" />
        </div>
        <div className="absolute my-rotate-y-180 backface-hidden bg-white w-full h-full overflow-hidden">
          <div className="flex flex-col items-center gap-4">
            <img src={data.image} alt={data.name} className="w-36 h-36" />
            <p className="text-center text-black">{data.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTest;
