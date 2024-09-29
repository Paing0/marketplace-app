import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkCurrentUser } from "../apicalls/auth";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      const response = await checkCurrentUser();
      if (response.isSuccess) {
        //
      } else {
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
