import { Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../apicalls/auth";
import { setUser } from "../../store/slices/userSlice";
import { setLoader } from "../../store/slices/loaderSlice";

const AuthForm = ({ isLoginPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isProcessing } = useSelector((state) => state.reducer.loader);

  const handleOnFinish = async (values) => {
    dispatch(setLoader(true));

    if (isLoginPage) {
      try {
        const response = await loginUser(values);
        if (response.isSuccess) {
          localStorage.setItem("token", response.token);
          dispatch(setUser(response.token));
          message.success(response.message);
          navigate("/");
        } else {
          throw new Error(response.message || "Login failed");
        }
      } catch (error) {
        message.error(error.message);
      }
    } else {
      try {
        const response = await registerUser(values);
        if (response.isSuccess) {
          message.success(response.message);
          navigate("/login");
        } else {
          throw new Error(response.message || "Registration failed");
        }
      } catch (error) {
        message.error(error.message);
      }
    }
    dispatch(setLoader(false));
  };

  return (
    <section className="my-10 w-full flex mt-40 justify-center">
      <div className=" w-[450px]">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">
          POINT.IO - {isLoginPage ? "LOGIN" : "REGISTER"}
        </h1>
        <Form layout="vertical" onFinish={handleOnFinish}>
          {!isLoginPage && (
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Name must be included",
                },
                {
                  min: 3,
                  message: "Name must have at least 3 characters",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="name ..."></Input>
            </Form.Item>
          )}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Email must be included",
              },
              {
                type: "email",
                message: "Enter a valid email",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="email ..."></Input>
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Password must be included",
              },
              {
                min: 6,
                message: "Password must have at least 6 characters",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="password ..."></Input.Password>
          </Form.Item>
          <Form.Item>
            <button
              className="w-full outline-none bg-blue-600 text-white py-2 rounded-md"
              disabled={isProcessing}
            >
              {isLoginPage && !isProcessing && "Login"}
              {!isLoginPage && !isProcessing && "Register"}
              {isProcessing && isLoginPage && "Logging in ..."}
              {isProcessing && !isLoginPage && "Registering ..."}
            </button>
          </Form.Item>
          {isLoginPage ? (
            <p>
              Already have an account?{" "}
              <Link
                className="font-medium text-blue-600 hover:text-blue-500"
                to="/login"
              >
                Login here
              </Link>
            </p>
          ) : (
            <p>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Don't have an account?{" "}
              <Link
                className="font-medium text-blue-600 hover:text-blue-500"
                to="/register"
              >
                Register here
              </Link>
            </p>
          )}
        </Form>
      </div>
    </section>
  );
};
export default AuthForm;
