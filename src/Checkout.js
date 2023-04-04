import React, { useState, useEffect } from 'react';

function Checkout() {

    const [inventory, setInventory] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/stock-items')
          .then(response => response.json())
          .then(data => setInventory(data));
      }, []);

    const addToCart = (item) => {
        const cartItem = {
          name: item.name,
          quantity: item.quantity
        }
        setCart([...cart, cartItem]);
      }

    const removeFromCart = (item) => {
        setCart(cart.filter(cartItem => cartItem.id !== item.id));
    }

    const completeSale = () => {
        // const data = {
        //   cart: cart,
        // }
        const data = cart;
    
        fetch('http://localhost:8080/api/v1/bills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(response => {
          // Clear cart and update inventory after successful checkout
          setCart([]);
        //   setInventory(response.json());
        });
      }

    return (
        <div>
            <h1>PharmaPay</h1>
            <h2>Inventory</h2>
            {inventory.map(item => (
                <div key={item.id}>
                <h3>{item.name}</h3>
                <p>Price: {item.price}</p>
                <button onClick={() => addToCart(item)}>Add to Cart</button>
                </div>
            ))}

            <h2>Cart</h2>

            {cart.map(item => (
                <div key={item.name}>
                <h3>{item.name}</h3>
                <p>Price: {item.price}</p>
                <button onClick={() => removeFromCart(item)}>Remove</button>
                </div>
            ))}
            <button onClick={() => completeSale()}>Complete Sale</button>
        </div>
    )
}

export default Checkout;