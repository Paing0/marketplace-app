import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <section className="max-w-3xl mx-auto h-auto ">
      <Navbar />
      <Outlet />
    </section>
  );
};

export default Main;
