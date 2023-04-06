import { useCart } from "../context/CartProvider";

function Inventory() {
  const { inventory, buyQty, setBuyQty, cart, setCart } = useCart();

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
