import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthProvider";
import Cart from "../components/Cart";
import Bill from "../components/Bill";
import Customers from "../components/Customers";
import Inventory from "../components/Inventory";
import { useCart } from "../context/CartProvider";

function Checkout() {
  const { auth } = useAuth();
  const { cart, setCart, setInventory } = useCart();

  const { authToken, isAuthenticated } = auth;
  const navigate = useNavigate();

  const [billId, setBillId] = useState(0);
  const [bill, setBill] = useState({ soldItems: [] });
  const [customers, setCustomers] = useState([]);
  const [searchCustomersTerm, setSearchCustomersTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    fetchInventory();
    fetchCustomers();
  }, []);

  useEffect(() => {}, []);

  const fetchInventory = async () => {
    const response = await axios.get("/stock-items", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      withCredentials: true,
    });
    setInventory(response.data);
  };

  const fetchCustomers = async () => {
    const response = await axios.get("/customers", {
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
  };

  const createBill = async () => {
    const data = cart;

    const response = await axios.post("/bills", JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    setBillId(response.data.id);
    setBill(response.data);
    setCart([]);
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
        "/add-bill-to-customer/customers/" +
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
      "/complete-sale/bills/" + billId,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    setBill({ soldItems: [] });
    fetchInventory();
  };

  return (
    <>
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
                <Inventory />
              </section>

              <aside className="bg-white shadow-lg p-4 md:w-96">
                <Cart cart={cart} removeFromCart={removeFromCart} />
                <button
                  onClick={() => createBill()}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm ml-20"
                >
                  Create Bill
                </button>
              </aside>
            </main>

            <footer className="bg-white shadow mt-auto">
              {bill.soldItems.length >= 1 ? (
                <>
                  <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <Bill bill={bill} completeSale={completeSale} />

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
