import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useCart } from "../context/CartProvider";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import Notification from "../components/Notification";

const Inventory = () => {
  const { auth } = useAuth();
  const { authToken, role } = auth;

  const navigate = useNavigate();

  const {
    inventory,
    setInventory,
    setInfoMessage,
    infoMessage,
    showNotification,
    setShowNotification,
  } = useCart();

  const [itemName, setItemName] = useState("");
  const [editItemId, setEditItemId] = useState("");
  const [editItemName, setEditItemName] = useState("");
  const [editItemPrice, setEditItemPrice] = useState("");
  const [editItemQuantity, setEditItemQuantity] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const apiVersion = "/api/v1";

  useEffect(() => {
    if (!authToken || role !== "ADMIN") {
      navigate("/login");
      return;
    }
  });

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
      if (err?.response?.status === 400) {
        const errorResponse = JSON.parse(JSON.stringify(err?.response?.data));
        setInfoMessage(errorResponse.errorMessages);
      } else {
        setInfoMessage("Failed to load inventory");
      }

      setShowNotification(true);
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
      setItemPrice("");
      setItemQuantity("");

      setInfoMessage("Item added successfully");
      setShowNotification(true);
    } catch (err) {
      if (err?.response?.status === 400) {
        const errorResponse = JSON.parse(JSON.stringify(err?.response?.data));
        setInfoMessage(errorResponse.errorMessages);
      } else {
        setInfoMessage("Something went wrong. Please retry.");
      }
      setShowNotification(true);
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
        setInfoMessage(errorResponse.errorMessages);
      } else {
        setInfoMessage("Something went wrong. Please retry.");
      }
    }
  };

  const abortUpdateItem = (e) => {
    e.preventDefault();
    emptyEditField();
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
    scrollToTop();
  };

  const emptyEditField = () => {
    populateEditField({ id: "", name: "", price: "", quantity: "" });
  };

  const scrollToTop = () => {
    window.scroll({ top: 0, behavior: "smooth" });
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
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">PharmaPay</h1>
        <h1 className="text-2xl font-bold mb-4 text-center">Inventory</h1>
        {editItemId === "" ? (
          <form className="mb-4" onSubmit={handleCreateItem}>
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <input
                  className="block w-full border-gray-400 border py-2 px-3 rounded-lg"
                  type="text"
                  placeholder="Item name"
                  value={itemName}
                  onChange={(event) => setItemName(event.target.value)}
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <input
                  className="block w-full border-gray-400 border py-2 px-3 rounded-lg"
                  type="number"
                  placeholder="Item price"
                  value={itemPrice}
                  onChange={(event) => setItemPrice(event.target.value)}
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <input
                  className="block w-full border-gray-400 border py-2 px-3 rounded-lg"
                  type="text"
                  placeholder="Item quantity"
                  value={itemQuantity}
                  onChange={(event) => setItemQuantity(event.target.value)}
                  required
                />
              </div>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              type="submit"
            >
              Add item
            </button>
          </form>
        ) : (
          <form className="mb-4">
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <input
                  className="block w-full border-gray-400 border py-2 px-3 rounded-lg"
                  type="text"
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <input
                  className="block w-full border-gray-400 border py-2 px-3 rounded-lg"
                  type="number"
                  value={editItemPrice}
                  onChange={(e) => setEditItemPrice(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <input
                  className="block w-full border-gray-400 border py-2 px-3 rounded-lg"
                  type="number"
                  value={editItemQuantity}
                  onChange={(e) => setEditItemQuantity(e.target.value)}
                />
              </div>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              type="submit"
              onClick={(e) => handleUpdateItem(e)}
            >
              Submit Update
            </button>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
              type="submit"
              onClick={(e) => abortUpdateItem(e)}
            >
              Abort Update
            </button>
          </form>
        )}
      </div>

      <table className="w-full text-center">
        <thead>
          <tr>
            <th>Item name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Created By</th>
            <th>Created On</th>
            <th>Last Modified By</th>
            <th>Last Modified On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.createdBy}</td>
              <td>{new Date(item.createdDate).toLocaleString()}</td>
              <td>{item.lastModifiedBy}</td>
              <td>{new Date(item.lastModifiedDate).toLocaleString()}</td>
              <td>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={(e) => populateEditField(item)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={(e) => handleDeleteItem(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Inventory;
