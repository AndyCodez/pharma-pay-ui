function Cart({ cart, removeFromCart }) {
  return (
    <>
      <div className="bg-gray-100 px-6 py-8 w-full">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <div className="grid grid-cols-1">
          {cart.map((item) => (
            <div
              key={item.name}
              className="bg-white p-4 mb-2 rounded-lg shadow-md w-full"
            >
              <h3 className="text-lg font-medium mb-2">{item.name}</h3>
              <p className="text-gray-500 text-sm mb-2">Price: {item.price}</p>
              <p className="text-gray-500 text-sm mb-4">Qty: {item.quantity}</p>
              <button
                onClick={() => removeFromCart(item)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Cart;
