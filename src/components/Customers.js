import React from "react";

function Customers({
  filteredCustomers,
  searchCustomersTerm,
  setSearchCustomersTerm,
  addCustomerToBill,
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 ">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchCustomersTerm}
          onChange={(e) => setSearchCustomersTerm(e.target.value)}
          className="w-full rounded-lg border-gray-300 border py-2 px-4 focus:outline-none focus:border-blue-500"
        />
      </div>
      <ul className="divide-y divide-gray-300">
        {filteredCustomers.map((customer) => (
          <li
            key={customer.id}
            className="py-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold">
                {customer.firstName} {customer.lastName}
              </h3>
            </div>
            <div>
              <button
                onClick={() => addCustomerToBill(customer.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Select Customer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Customers;
