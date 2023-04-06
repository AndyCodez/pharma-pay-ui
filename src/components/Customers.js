import React from "react";

function Customers({
  filteredCustomers,
  searchCustomersTerm,
  setSearchCustomersTerm,
  addCustomerToBill,
}) {
  return (
    <div>
      <h2>Customers</h2>
      <div>
        <input
          type="text"
          placeholder="Search customers..."
          value={searchCustomersTerm}
          onChange={(e) => setSearchCustomersTerm(e.target.value)}
        />
        <ul>
          {filteredCustomers.map((customer) => (
            <li key={customer.id}>
              <h3>
                {customer.firstName} {customer.lastName}
              </h3>
              <button onClick={() => addCustomerToBill(customer.id)}>
                Select Customer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Customers;
