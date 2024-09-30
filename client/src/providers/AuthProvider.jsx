import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkCurrentUser } from "../apicalls/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      const response = await checkCurrentUser();
      if (response.isSuccess) {
        dispatch(setUser(response.user));
      } else {
        localStorage.removeItem("token");
        dispatch(setUser(null));
        navigate("/");
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <section>{children}</section>;
};

export default AuthProvider;
