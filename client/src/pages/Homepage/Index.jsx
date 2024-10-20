import { useEffect, useState } from "react";
import Card from "../../components/HomePage/Card";
import Filter from "../../components/HomePage/Filter";
import Hero from "../../components/HomePage/Hero";
import { getProducts, getSavedProducts } from "../../apicalls/product";
import { Pagination, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../store/slices/loaderSlice";
import { RotatingLines } from "react-loader-spinner";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const dispatch = useDispatch();
  const { isProcessing } = useSelector((state) => state.reducer.loader);

  const getAllProducts = async (page = 1, perPage = 6) => {
    dispatch(setLoader(true));
    try {
      const response = await getProducts(page, perPage);
      if (response.isSuccess) {
        setProducts(response.products);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      } else {
        throw new Error(response.message);
      }
      dispatch(setLoader(false));
    } catch (err) {
      message.error(err.message);
    }
  };

  const getSaveProducts = async () => {
    dispatch(setLoader(true));
    try {
      const response = await getSavedProducts();
      if (response.isSuccess) {
        setSavedProducts(response.products);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    }
    dispatch(setLoader(false));
  };

  useEffect(() => {
    getAllProducts(1, 6);
    getSaveProducts();
  }, []);


  const handlePagination = (page, perPage) => {
    getAllProducts(page, perPage);
  };

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
        <>
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            {products.map((product) => (
              <Card
                product={product}
                key={product._id}
                savedProducts={savedProducts}
                getAllProducts={getAllProducts}
              />
            ))}
          </div>
          <div className="flex mt-5 my-10 justify-center max-w-6xl mx-auto">
            <Pagination
              current={currentPage}
              total={totalPages * 6}
              onChange={handlePagination}
            />
          </div>
          <div className="my-10 text-sm font-medium text-center text-blue-600 pb-10">
            Made with love by Trade Hub @ 2024
          </div>
        </>
      )}
    </section>
  );
};
export default Index;
