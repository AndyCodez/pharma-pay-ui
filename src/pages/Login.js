import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const apiVersion = "/api/v1";

const LOGIN_URL = `${apiVersion}/auth/sign-in`;

function Login() {
  const { setAuth } = useContext(AuthContext);

  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const authToken = response?.data?.authToken;
      const role = response?.data?.userRole;

      setAuth({ email, authToken, isAuthenticated: true, role });

      setEmail("");
      setPassword("");
      setSuccess(true);
      navigate("/checkout");
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Incorrect Login Credentials");
      }
    }
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage();
  }, [email, password]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-4 bg-white shadow-lg rounded-lg w-full md:w-96">
        {success ? (
          <div className="p-4 bg-green-100">
            <h1 className="text-lg font-semibold text-green-700">Logged in!</h1>
          </div>
        ) : (
          <>
            <div className="w-full mx-auto py-6 px-4 flex justify-center items-center">
              <h1 className="text-3xl font-bold text-gray-800">PharmaPay</h1>
            </div>
            <p
              ref={errRef}
              className={`${errorMessage ? "text-red-500" : "hidden"} mb-2`}
            >
              {errorMessage}
            </p>
            <h1 className="text-lg font-semibold mb-2">Sign In</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" className="block mb-1 font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                ref={userRef}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="w-full border-gray-300 rounded-sm py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <label htmlFor="password" className="block mb-1 font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                ref={userRef}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full border-gray-300 rounded-sm py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
