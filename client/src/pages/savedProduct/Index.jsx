import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSavedProducts } from "../../apicalls/product";
import Card from "../../components/HomePage/Card";
import { setLoader } from "../../store/slices/loaderSlice";

const Index = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isProcessing } = useSelector((state) => state.reducer.loader);
  const getProducts = async () => {
    dispatch(setLoader(true));
    try {
      const response = await getSavedProducts();
      if (response.isSuccess) {
        setSavedProducts(response.products);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error(err.message);
    }
    dispatch(setLoader(false));
  };
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <section>
      <div className="flex justify-between my-2">
        <h1 className="text-xl font-bold my-4">Saved Product List</h1>
        <ArrowLeftIcon
          width={30}
          height={30}
          className="text-blue-600 cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>
      {isProcessing ? (
        <div className=" flex items-center justify-center">
          <RotatingLines
            strokeColor="#3b82f6"
            strokeWidth="5"
            animationDuration="0.75"
            width="50"
            visible={isProcessing}
          />
        </div>
      ) : (
        <div className="flex gap-4">
          {savedProducts && savedProducts.length > 0 && (
            <>
              {savedProducts.map((product) => (
                <Card
                  product={product.product_id}
                  key={product._id}
                  saved={true}
                  getProducts={getProducts}
                />
              ))}
            </>
          )}
        </div>
      )}
      {savedProducts.length === 0 && !isProcessing && (
        <p className=" font-medium text-red-600 my-2">
          No product are not saved yet.
        </p>
      )}
    </section>
  );
};
export default Index;
