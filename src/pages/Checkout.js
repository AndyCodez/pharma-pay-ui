import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthProvider";

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
      quantity: item.quantity,
    };
    setCart([...cart, cartItem]);
  };

  const removeFromCart = (item) => {
    setCart(cart.filter((cartItem) => cartItem.id !== item.id));
  };

  const createBill = () => {
    const data = cart;

    fetch("http://localhost:8080/api/v1/bills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setBillId(data.id);
        setBill(data);
        setCart([]);
      });
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

  const addCustomerToBill = () => {
    fetch(
      "http://localhost:8080/api/v1/add-bill-to-customer/customers/" +
        selectedCustomerId +
        "/bills/" +
        billId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSelectedCustomerId(0);
        setBill(data);
      });
  };

  const completeSale = () => {
    fetch("http://localhost:8080/api/v1/complete-sale/bills/" + billId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  };

  return (
    <>
      {isAuthenticated ? (
        <div>
          <h1>PharmaPay</h1>
          <h2>Inventory</h2>
          {inventory.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              <p>Price: {item.price}</p>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))}

          <h2>Customers</h2>
          <div>
            <input
              type="text"
              placeholder="Search items..."
              value={searchCustomersTerm}
              onChange={(e) => setSearchCustomersTerm(e.target.value)}
            />
            <select onChange={(e) => setSelectedCustomerId(e.target.value)}>
              {filteredCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName}
                </option>
              ))}
            </select>
            <button onClick={() => addCustomerToBill()}>Select Customer</button>
          </div>
          <h2>Cart</h2>

          {cart.map((item) => (
            <div key={item.name}>
              <h3>{item.name}</h3>
              <p>Price: {item.price}</p>
              <button onClick={() => removeFromCart(item)}>Remove</button>
            </div>
          ))}
          <button onClick={() => createBill()}>Create Bill</button>

          {bill ? (
            <>
              <h2>Bill</h2>
              <div>
                <h4>Date {bill.billDateTime}</h4>
                {bill.soldItems.map((item) => (
                  <div>
                    <p>
                      {item.name} - {item.quantity}
                    </p>
                  </div>
                ))}
                <h4>{bill.amount}</h4>
                {bill.customer ? (
                  <h4>
                    {bill.customer.firstName} {bill.customer.lastName}
                  </h4>
                ) : null}

                <button onClick={() => completeSale()}>Complete sale</button>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default Checkout;
