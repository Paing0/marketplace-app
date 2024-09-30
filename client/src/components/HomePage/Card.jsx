import TradeHub from "../../images/TradeHub.jpg";
import { BookmarkIcon } from "@heroicons/react/24/outline";

const Card = ({ product }) => {
  return (
    <div className=" basis-1/2 px-4 mb-4">
      {product.images[0] ? (
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-52 object-cover"
        />
      ) : (
        <img src={TradeHub} alt={product.name} className="w-full" />
      )}
      <p className=" text-white text-xs bg-blue-600 rounded-lg p-1 w-fit font-medium my-2">
        {product.category.toUpperCase().replaceAll("_", " ")}
      </p>
      <div className="flex items-center justify-between">
        <p className=" text-xl font-bold text-gray-700">{product.name}</p>
        <BookmarkIcon className="w-6 h-8 text-blue-600 cursor-pointer" />
      </div>
      <p className="text-gray-500">{product.description.slice(0, 80)}</p>
    </div>
  );
};
export default Card;
