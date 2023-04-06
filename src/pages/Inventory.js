import React, { useState } from "react";
import axios from "../api/axios";
import { useCart } from "../context/CartProvider";
import { useAuth } from "../context/AuthProvider";

const Inventory = () => {
  const { auth } = useAuth();
  const { authToken } = auth;

  const { inventory, setInventory, setErrorMessage, errorMessage } = useCart();

  const [itemName, setItemName] = useState("");
  const [editItemId, setEditItemId] = useState(0);
  const [editItemName, setEditItemName] = useState("");
  const [editItemPrice, setEditItemPrice] = useState(0);
  const [editItemQuantity, setEditItemQuantity] = useState(0);
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const apiVersion = "/api/v1";

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${apiVersion}/stock-items`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });
      setInventory(response.data);
    } catch (err) {
      const errorResponse = JSON.parse(JSON.stringify(err?.response?.data));
      setErrorMessage(errorResponse.errorMessages);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();

    const data = {
      name: itemName,
      price: itemPrice,
      quantity: itemQuantity,
    };

    try {
      const response = await axios.post(
        `${apiVersion}/stock-items`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );
      const inventoryItem = response.data;
      setInventory([...inventory, inventoryItem]);
      setItemName("");
      setItemPrice(0);
      setItemQuantity(0);
    } catch (err) {
      if (err?.response?.status === 400) {
        const errorResponse = JSON.parse(JSON.stringify(err?.response?.data));
        setErrorMessage(errorResponse.errorMessages);
      } else {
        setErrorMessage("Something went wrong. Please retry.");
      }
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    const updatedItem = {
      name: editItemName,
      price: editItemPrice,
      quantity: editItemQuantity,
    };

    try {
      const response = await axios.put(
        `${apiVersion}/stock-items/${editItemId}`,
        JSON.stringify(updatedItem),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      fetchInventory();
      emptyEditField();
    } catch (err) {
      if (err?.response?.status === 400) {
        const errorResponse = JSON.parse(JSON.stringify(err?.response?.data));
        setErrorMessage(errorResponse.errorMessages);
      } else {
        setErrorMessage("Something went wrong. Please retry.");
      }
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${apiVersion}/stock-items/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const updatedItems = inventory.filter((item) => item.id !== id);
      setInventory(updatedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const populateEditField = (item) => {
    setEditItemId(item.id);
    setEditItemName(item.name);
    setEditItemPrice(item.price);
    setEditItemQuantity(item.quantity);
  };

  const emptyEditField = () => {
    populateEditField({ id: "", name: "", price: "", quantity: "" });
    setErrorMessage("");
  };

  return (
    <div>
      <h1>Inventory</h1>
      <p className={`${errorMessage ? "text-red-500" : "hidden"} mb-2`}>
        {errorMessage}
      </p>
      <form onSubmit={handleCreateItem}>
        <input
          type="text"
          placeholder="Item name"
          value={itemName}
          onChange={(event) => setItemName(event.target.value)}
        />
        <input
          type="number"
          placeholder="Item price"
          value={itemPrice}
          onChange={(event) => setItemPrice(event.target.value)}
        />
        <input
          type="text"
          placeholder="Item quantity"
          value={itemQuantity}
          onChange={(event) => setItemQuantity(event.target.value)}
        />
        <button type="submit">Add item</button>
      </form>

      <form onSubmit={(e) => handleUpdateItem(e)}>
        <input
          type="text"
          value={editItemName}
          onChange={(e) => setEditItemName(e.target.value)}
        />
        <input
          type="number"
          value={editItemPrice}
          onChange={(e) => setEditItemPrice(e.target.value)}
        />
        <input
          type="number"
          value={editItemQuantity}
          onChange={(e) => setEditItemQuantity(e.target.value)}
        />
        <button>Submit Update</button>
      </form>

      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            Name: {item.name}
            Price: {item.price}
            Qty: {item.quantity}
            <button onClick={(e) => populateEditField(item)}>Update</button>
            <button onClick={(e) => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;
