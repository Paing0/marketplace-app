import { UserIcon, BookmarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.reducer.user);

  return (
    <nav className="flex items-center justify-between bg-blue-600 text-white p-4 mb-4">
      <Link className="font-bold text-2xl" to={"/"}>
        TradeHub
      </Link>
      <div className="flex items-center gap-3 text-base font-medium ">
        {user ? (
          <div className="flex items-center gap-2">
            {user.role === "user" && (
              <Link to={"/profile"} className="px-2 py-1 flex items-end gap-1">
                <UserIcon width={26} />
                Profile
              </Link>
            )}
            {user.role === "admin" && (
              <Link to={"/admin"} className="px-2 py-1 flex items-end gap-1">
                <UserIcon width={26} />
                Admin Pannel
              </Link>
            )}
            <Link
              to={"/saved-products"}
              className="px-2 py-1 flex items-end gap-1"
            >
              <BookmarkIcon width={26} />
            </Link>
          </div>
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
