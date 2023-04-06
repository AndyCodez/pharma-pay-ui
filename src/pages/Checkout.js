import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthProvider";
import Cart from "../components/Cart";
import Bill from "../components/Bill";
import Customers from "../components/Customers";
import Inventory from "../components/Inventory";
import { useCart } from "../context/CartProvider";
import Notification from "../components/Notification";

function Checkout() {
  const { auth } = useAuth();
  const {
    cart,
    setCart,
    setInventory,
    setErrorMessage,
    errorMessage,
    showNotification,
    setShowNotification,
  } = useCart();

  const { authToken, isAuthenticated } = auth;
  const navigate = useNavigate();

  const [billId, setBillId] = useState(0);
  const [bill, setBill] = useState({ soldItems: [] });
  const [customers, setCustomers] = useState([]);
  const [searchCustomersTerm, setSearchCustomersTerm] = useState("");

  const apiVersion = "/api/v1";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchInventory();
    fetchCustomers();
  }, []);

  const fetchInventory = async () => {
    const response = await axios.get(`${apiVersion}/stock-items`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      withCredentials: true,
    });
    setInventory(response.data);
  };

  const fetchCustomers = async () => {
    const response = await axios.get(`${apiVersion}/customers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      withCredentials: true,
    });
    setCustomers(response.data.customers);
  };

  const removeFromCart = (item) => {
    setCart(cart.filter((cartItem) => cartItem.name !== item.name));
    setErrorMessage("");
  };

  const createBill = async () => {
    const data = cart;

    try {
      const response = await axios.post(
        `${apiVersion}/bills`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setBillId(response.data.id);
      setBill(response.data);
      setCart([]);
      scrollToBottom();
    } catch (err) {
      const errorResponse = JSON.parse(JSON.stringify(err?.response?.data));
      setErrorMessage(errorResponse.errorMessages);
      setShowNotification(true);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName
        .toLowerCase()
        .includes(searchCustomersTerm.toLowerCase()) ||
      customer.lastName
        .toLowerCase()
        .includes(searchCustomersTerm.toLowerCase())
  );

  const addCustomerToBill = async (selectedCustomerId) => {
    try {
      const response = await axios.post(
        `${apiVersion}/add-bill-to-customer/customers/` +
          selectedCustomerId +
          "/bills/" +
          billId,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setBill(response.data);
    } catch (err) {
      if (err?.response) {
        console.log(err.response);
      }
    }
  };

  const completeSale = async () => {
    const response = await axios.put(
      `${apiVersion}/complete-sale/bills/` + billId,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    setBill({ soldItems: [] });
    setCart([]);
    fetchInventory();
    setErrorMessage("");
  };

  const discardBill = () => {
    setBill({ soldItems: [] });
  };

  const scrollToBottom = () => {
    window.scroll({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {errorMessage ? (
        <Notification
          message={errorMessage}
          show={showNotification}
          setShow={setShowNotification}
        />
      ) : null}
      {isAuthenticated ? (
        <>
          <header className="bg-white shadow">
            <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">PharmaPay</h1>
            </div>
          </header>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <main className="flex-grow flex flex-col md:flex-row">
              <section className="bg-white shadow-lg flex-grow p-4">
                <Inventory bill={bill} />
              </section>

              <aside className="bg-white shadow-lg p-4 md:w-96">
                <Cart cart={cart} removeFromCart={removeFromCart} />
                {bill.soldItems.length === 0 ? (
                  <button
                    onClick={() => createBill()}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm ml-20"
                  >
                    Create Bill
                  </button>
                ) : null}
              </aside>
            </main>

            <footer className="bg-white shadow mt-auto">
              {bill.soldItems.length >= 1 ? (
                <>
                  <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <Bill
                      bill={bill}
                      completeSale={completeSale}
                      discardBill={discardBill}
                    />

                    <Customers
                      filteredCustomers={filteredCustomers}
                      searchCustomersTerm={searchCustomersTerm}
                      setSearchCustomersTerm={setSearchCustomersTerm}
                      addCustomerToBill={addCustomerToBill}
                    />
                  </div>
                </>
              ) : null}
            </footer>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Checkout;
