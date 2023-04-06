import { useState } from "react";
import { useCart } from "../context/CartProvider";

function Inventory({ bill }) {
  const {
    inventory,
    buyQty,
    setBuyQty,
    cart,
    setCart,
    setErrorMessage,
    setShowNotification,
  } = useCart();

  const [searchInventoryTerms, setSearchInventoryTerms] = useState("");

  const handleQtyChange = (event) => {
    setBuyQty(parseInt(event.target.value));
  };

  const addToCart = (item) => {
    if (bill.soldItems.length >= 1) {
      scrollToBottom();
      setErrorMessage("You need to close or discard the current bill first");
      setShowNotification(true);
      return;
    }
    const cartItem = {
      name: item.name,
      price: item.price,
      quantity: buyQty,
    };

    setCart([...cart, cartItem]);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchInventoryTerms)
  );

  const scrollToBottom = () => {
    window.scroll({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white p-8 w-full">
      <h2 className="text-3xl font-bold mb-6">Inventory</h2>
      <div className="flex flex-col md:flex-row md:items-center mb-6">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchInventoryTerms}
          onChange={(e) => setSearchInventoryTerms(e.target.value)}
          className="border-gray-300 border-2 py-2 px-4 rounded-lg shadow-md mb-4 md:mb-0 md:mr-4 flex-1"
        />
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => (
          <div key={item.id} className="bg-gray-100 rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
            <p className="mb-2">Price: {item.price}</p>
            <p className="mb-2">Remaining: {item.quantity}</p>
            <div className="flex items-center mb-2">
              <input
                type="number"
                value={buyQty}
                min="1"
                max={item.quantity}
                onChange={handleQtyChange}
                className="border-gray-300 border-2 py-2 px-4 rounded-lg shadow-md mr-2 flex-1"
              />
              <button
                onClick={() => addToCart(item)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory;
