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
    setCart(cart.filter((cartItem) => cartItem.id !== item.id));
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
        <div>
          <h1>PharmaPay</h1>
          <Inventory />

          <Cart cart={cart} removeFromCart={removeFromCart} />

          <button onClick={() => createBill()}>Create Bill</button>

          <Bill bill={bill} completeSale={completeSale} />

          <Customers
            filteredCustomers={filteredCustomers}
            searchCustomersTerm={searchCustomersTerm}
            setSearchCustomersTerm={setSearchCustomersTerm}
            addCustomerToBill={addCustomerToBill}
          />
        </div>
      ) : null}
    </>
  );
}

export default Checkout;
