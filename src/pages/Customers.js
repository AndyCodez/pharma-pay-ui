import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartProvider";
import Notification from "../components/Notification";

const apiVersion = "/api/v1";

const REGISTER_CUSTOMERS_URL = `${apiVersion}/customers`;

function Customers() {
  const { auth } = useAuth();
  const { authToken, role } = auth;
  const { infoMessage, setInfoMessage, showNotification, setShowNotification } =
    useCart();

  const userRef = useRef();

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        REGISTER_CUSTOMERS_URL,
        JSON.stringify({
          firstName,
          lastName,
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

      setInfoMessage("Customer record created successfully");
      setShowNotification(true);
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
            Register Customer
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

            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Register Customer
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default Customers;
