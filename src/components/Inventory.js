import React from "react";

function Inventory({ inventory, buyQty, handleQtyChange, addToCart }) {
  return (
    <div>
      <h2>Inventory</h2>
      <div>
        {inventory.map((item) => (
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
