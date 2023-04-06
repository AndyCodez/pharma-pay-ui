function Cart({ cart, removeFromCart }) {
  return (
    <>
      <h2>Cart</h2>
      <div>
        {cart.map((item) => (
          <div key={item.name}>
            <h3>{item.name}</h3>
            <p>Price: {item.price}</p>
            <p>Qty: {item.quantity}</p>
            <button onClick={() => removeFromCart(item)}>Remove</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Cart;
