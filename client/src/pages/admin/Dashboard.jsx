import {
  BanknotesIcon,
  ShoppingCartIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Bar from "../../components/Dashboard/Bar";
import Card from "../../components/Dashboard/Card";
import Chart from "../../components/Dashboard/Chart";

const Dashboard = ({
  products,
  users,
  totalProducts,
  pendingProducts,
  setActiveTabKey,
}) => {
  const [totalSales, setTotalSales] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const calcTotalSales = () => {
    const totalAmount = products.reduce((a, b) => {
      return a + Number(b.price);
    }, 0);
    setTotalSales(totalAmount);
  };

  useEffect(() => {
    if (products.length) {
      calcTotalSales();
      setUserCount(users.length);
    }
  }, [products]);

  return (
    <section>
      <div className="flex items-center gap-6 mt-2 mb-4">
        <div className="w-full">
          <Card
            title={"Total Sales"}
            count={`${totalSales} MMK`}
            icon={BanknotesIcon}
            note={"MMK"}
          />
        </div>

        <div className="w-full" onClick={() => setActiveTabKey("3")}>
          <Card
            title={"Active Users"}
            count={userCount}
            icon={UserGroupIcon}
            note={"user"}
          />
        </div>

        <div className="w-full" onClick={() => setActiveTabKey("2")}>
          <Card
            title={"Total Products"}
            count={totalProducts}
            icon={ShoppingCartIcon}
            note={"items"}
          />
        </div>

        <div className="w-full" onClick={() => setActiveTabKey("2")}>
          <Card
            title={"Pending Products"}
            count={pendingProducts}
            icon={ShoppingCartIcon}
            note={"pending"}
          />
        </div>
      </div>
      <Chart products={products} />
      <Bar products={products} />
    </section>
  );
};
export default Dashboard;
