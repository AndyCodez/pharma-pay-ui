import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthProvider";
import Cart from "../components/Cart";
import Bill from "../components/Bill";
import Customers from "../components/Customers";
import Inventory from "../components/Inventory";

function Checkout() {
  const { auth } = useAuth();

  const { authToken, isAuthenticated } = auth;
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [billId, setBillId] = useState(0);
  const [bill, setBill] = useState({ soldItems: [] });
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(0);
  const [searchCustomersTerm, setSearchCustomersTerm] = useState("");
  const [buyQty, setBuyQty] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    fetchInventory();
    fetchCustomers();
  }, []);

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

  const addToCart = (item) => {
    const cartItem = {
      name: item.name,
      quantity: buyQty,
    };
    setCart([...cart, cartItem]);
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

  const addCustomerToBill = async () => {
    try {
      const response = await axios.post(
        "/add-bill-to-customer/customers/" +
          selectedCustomerId +
          "/bills/" +
          billId,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setSelectedCustomerId(0);
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
  };

  const handleQtyChange = (event) => {
    setBuyQty(parseInt(event.target.value));
  };

  return (
    <>
      {isAuthenticated ? (
        <div>
          <h1>PharmaPay</h1>
          <Inventory
            inventory={inventory}
            buyQty={buyQty}
            handleQtyChange={handleQtyChange}
            addToCart={addToCart}
          />

          <Customers
            filteredCustomers={filteredCustomers}
            searchCustomersTerm={searchCustomersTerm}
            setSearchCustomersTerm={setSearchCustomersTerm}
            setSelectedCustomerId={setSelectedCustomerId}
            addCustomerToBill={addCustomerToBill}
          />

          <Cart cart={cart} removeFromCart={removeFromCart} />

          <button onClick={() => createBill()}>Create Bill</button>

          <Bill bill={bill} completeSale={completeSale} />
        </div>
      ) : null}
    </>
  );
}

export default Checkout;
