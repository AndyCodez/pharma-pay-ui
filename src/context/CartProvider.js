import { createContext, useContext, useState } from "react";

const CartContext = createContext({});

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [buyQty, setBuyQty] = useState(1);
  const [inventory, setInventory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  //   const values = { cart, setCart, buyQty, setBuyQty, inventory, setInventory }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        buyQty,
        setBuyQty,
        inventory,
        setInventory,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
