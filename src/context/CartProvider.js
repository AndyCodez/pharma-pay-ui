import { createContext, useContext, useState } from "react";
import Inventory from "../components/Inventory";
import Checkout from "../pages/Checkout";

const CartContext = createContext({});

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [buyQty, setBuyQty] = useState(1);
  const [inventory, setInventory] = useState([]);

  return (
    <CartContext.Provider
      value={{ cart, setCart, buyQty, setBuyQty, inventory, setInventory }}
    >
      {children}
      {/* <Inventory /> */}
      {/* <Checkout /> */}
    </CartContext.Provider>
  );
};

export default CartContext;
