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
        setCart([...cart, item]);
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
            <button>Complete Sale</button>
        </div>
    )
}

export default Checkout;