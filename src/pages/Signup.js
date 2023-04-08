import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartProvider";
import Notification from "../components/Notification";

const apiVersion = "/api/v1";

const SIGNUP_URL = `${apiVersion}/pharmacists`;

function Signup() {
  const { auth } = useAuth();
  const { authToken, role } = auth;
  const {
    infoMessage,
    setInfoMessage,
    showNotification,
    setShowNotification,
  } = useCart();

  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        SIGNUP_URL,
        JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role: role.toUpperCase(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setUserRole("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setInfoMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setInfoMessage(err.response.data.errorMessages);
      } else {
        setInfoMessage("Something went wrong. Please try again.");
      }
      setShowNotification(true);
    }
  };

  useEffect(() => {
    if (!authToken || role !== "ADMIN") {
      navigate("/login");
      return;
    }
    userRef.current.focus();
  }, []);

  return (
    <>
      {infoMessage ? (
        <Notification
          message={infoMessage}
          show={showNotification}
          setShow={setShowNotification}
        />
      ) : null}
      {authToken && role === "ADMIN" ? (
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Register Pharmacist
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                ref={userRef}
                required
                className="w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                required
                className="w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="role" className="block font-medium mb-1">
                Role
              </label>
              <input
                type="text"
                id="role"
                onChange={(e) => setUserRole(e.target.value)}
                value={userRole}
                required
                className="w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Register Pharmacist
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default Signup;
