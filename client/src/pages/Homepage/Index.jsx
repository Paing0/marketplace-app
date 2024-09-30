import { useEffect, useState } from "react";
import Card from "../../components/HomePage/Card";
import Filter from "../../components/HomePage/Filter";
import Hero from "../../components/HomePage/Hero";
import { getProducts } from "../../apicalls/product";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../store/slices/loaderSlice";
import { RotatingLines } from "react-loader-spinner";

const Index = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const { isProcessing } = useSelector((state) => state.reducer.loader);
  const getAllProducts = async () => {
    dispatch(setLoader(true));
    try {
      const response = await getProducts();
      if (response.isSuccess) {
        setProducts(response.products);
      } else {
        throw new Error(response.message);
      }
      dispatch(setLoader(false));
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <section>
      <Hero setProducts={setProducts} getAllProducts={getAllProducts} />
      <Filter setProducts={setProducts} getAllProducts={getAllProducts} />
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
        <div className="flex max-w-4xl mx-auto flex-wrap flex-row">
          {products.map((product) => (
            <Card product={product} key={product._id} />
          ))}
        </div>
      )}
    </section>
  );
};
export default Index;
