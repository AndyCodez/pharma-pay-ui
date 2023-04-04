import React, { useState, useEffect } from 'react';

function Checkout() {

    const [inventory, setInventory] = useState([]);
    const [cart, setCart] = useState([]);
    const [billId, setBillId] = useState(0);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(0);
    const [searchCustomersTerm, setSearchCustomersTerm] = useState("");

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/stock-items')
          .then(response => response.json())
          .then(data => setInventory(data));

        fetch('http://localhost:8080/api/v1/customers')
          .then(response => response.json())
          .then(data => {
            setCustomers(data.customers)
          });

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

    const createBill = () => {
        const data = cart;

        fetch('http://localhost:8080/api/v1/bills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          setBillId(data.id)
          setCart([])
        });
      }

      const filteredCustomers = customers.filter(customer =>
        customer.firstName.toLowerCase().includes(searchCustomersTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchCustomersTerm.toLowerCase())
      );

      const addCustomerToBill = () => {

        fetch('http://localhost:8080/api/v1/add-bill-to-customer/customers/' + selectedCustomerId + '/bills/' + billId, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          setSelectedCustomerId(0)
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

            <h2>Customers</h2>
            <div>
              <input
                type="text"
                placeholder="Search items..."
                value={searchCustomersTerm}
                onChange={(e) => setSearchCustomersTerm(e.target.value)}
              />
              <select onChange={(e) => setSelectedCustomerId(e.target.value)}>
                {filteredCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
              <button onClick={() => addCustomerToBill()}>Select Customer</button>
            </div>
            <h2>Cart</h2>

            {cart.map(item => (
                <div key={item.name}>
                <h3>{item.name}</h3>
                <p>Price: {item.price}</p>
                <button onClick={() => removeFromCart(item)}>Remove</button>
                </div>
            ))}
            <button onClick={() => createBill()}>Create Bill</button>
        </div>
    )
}

export default Checkout;