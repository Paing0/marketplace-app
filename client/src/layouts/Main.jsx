import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <section className="max-w-[85%] mx-auto h-screen">
      <Navbar />
      <Outlet />
    </section>
  );
};

export default Main;
