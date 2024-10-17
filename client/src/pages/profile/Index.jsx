import {
  BellAlertIcon,
  SquaresPlusIcon,
  SwatchIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../apicalls/product";
import General from "./General";
import ManageProduct from "./ManageProduct";
import Products from "./Products";
import { getAllNoti } from "../../apicalls/notification";
import Notification from "./Notification";

const Index = () => {
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [manageTabKey, setManageTabKey] = useState("1");
  const [notifications, setNotifications] = useState([]);

  const getProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.isSuccess) {
        setProducts(response.products);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const getNoti = async () => {
    try {
      const response = await getAllNoti();
      if (response.isSuccess) {
        setNotifications(response.notis);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (activeTabKey === "1") {
      setEditMode(false);
      setEditProductId(null);
    }
    getProducts();
    getNoti();
  }, [activeTabKey]);

  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-start gap-2">
          <SwatchIcon width={20} />
          Products
        </span>
      ),
      children: (
        <Products
          products={products}
          setActiveTabKey={setActiveTabKey}
          setEditMode={setEditMode}
          setEditProductId={setEditProductId}
          getProducts={getProducts}
          setManageTabKey={setManageTabKey}
        />
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-start gap-2">
          <SquaresPlusIcon width={20} />
          Manage Product
        </span>
      ),
      children: (
        <ManageProduct
          setActiveTabKey={setActiveTabKey}
          getProducts={getProducts}
          editMode={editMode}
          editProductId={editProductId}
          manageTabKey={manageTabKey}
        />
      ),
    },
    {
      key: "3",
      label: (
        <span className="flex items-start gap-2">
          <BellAlertIcon width={20} />
          Notifications
        </span>
      ),
      children: (
        <Notification notifications={notifications} getNoti={getNoti} />
      ),
    },
    {
      key: "4",
      label: (
        <span className="flex items-start gap-2">
          <UserIcon width={20} />
          Profile
        </span>
      ),
      children: <General />,
    },
  ];

  const onChangeHandler = (key) => {
    setActiveTabKey(key);
  };

  return (
    <section>
      <Tabs
        activeKey={activeTabKey}
        onChange={(key) => onChangeHandler(key)}
        items={items}
        tabPosition="left"
        size="large"
      />
    </section>
  );
};

export default Index;
