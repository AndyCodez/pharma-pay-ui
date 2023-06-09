import React, { useState, useEffect } from "react";
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
    setInfoMessage,
    infoMessage,
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
    setInfoMessage("");
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
      setInfoMessage("A bill was created successfully.");
      setShowNotification(true);
    } catch (err) {
      const errorResponse = JSON.parse(JSON.stringify(err?.response?.data));
      setInfoMessage(errorResponse.errorMessages);
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
      setInfoMessage("Successfully assigned bill to customer");
      setShowNotification(true);
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
    setInfoMessage("Bill has been validated and completed.");
    setShowNotification(true);
  };

  const discardBill = async () => {
    const response = await axios.delete(`${apiVersion}/bills/` + billId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    setBill({ soldItems: [] });
    setCart([]);
    setInfoMessage("Bill has been discarded.");
    setShowNotification(true);
  };

  return (
    <>
      {infoMessage ? (
        <Notification
          message={infoMessage}
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
                {bill.soldItems.length === 0 ? (
                  <div>
                    <Cart cart={cart} removeFromCart={removeFromCart} />

                    <button
                      onClick={() => createBill()}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm ml-20"
                    >
                      Create Bill
                    </button>
                  </div>
                ) : bill.soldItems.length >= 1 ? (
                  <>
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
                  </>
                ) : null}
              </aside>
            </main>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Checkout;
