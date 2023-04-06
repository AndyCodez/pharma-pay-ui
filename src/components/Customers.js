import React from "react";

function Customers({
  filteredCustomers,
  searchCustomersTerm,
  setSearchCustomersTerm,
  setSelectedCustomerId,
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
        <select onChange={(e) => setSelectedCustomerId(e.target.value)}>
          {filteredCustomers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </select>
        <button onClick={() => addCustomerToBill()}>Select Customer</button>
      </div>
    </div>
  );
}

export default Customers;
