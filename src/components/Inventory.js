import { useState } from "react";
import { useCart } from "../context/CartProvider";

function Inventory() {
  const { inventory, buyQty, setBuyQty, cart, setCart } = useCart();

  const [searchInventoryTerms, setSearchInventoryTerms] = useState("");

  const handleQtyChange = (event) => {
    setBuyQty(parseInt(event.target.value));
  };

  const addToCart = (item) => {
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

  return (
    <div>
      <h2>Inventory</h2>
      <input
        type="text"
        placeholder="Search inventory..."
        value={searchInventoryTerms}
        onChange={(e) => setSearchInventoryTerms(e.target.value)}
      />
      <div>
        {filteredInventory.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>Price: {item.price}</p>
            <p>Remaining: {item.quantity}</p>
            <input
              type="number"
              value={buyQty}
              min="1"
              max={item.quantity}
              onChange={handleQtyChange}
            />
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory;
