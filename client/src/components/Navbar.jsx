import { UsersIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-blue-500 text-white p-4">
      <Link className="font-bold text-2xl" to={"/"}>
        POINT.IO
      </Link>
      <div className="flex items-center gap-3 text-base font-medium ">
        {localStorage.getItem("token") ? (
          <Link
            className="bg-white text-blue-500 px-2 py-1 flex items-center gap-1 rounded-lg"
            to={"/profile"}
          >
            <UsersIcon width={20} />
            Profile
          </Link>
        ) : (
          <>
            <Link
              className="bg-white text-blue-500 px-2 py-1 rounded-lg"
              to={"/login"}
            >
              Login
            </Link>
            <Link
              className="bg-white text-blue-500 px-2 py-1 rounded-lg"
              to={"/register"}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
