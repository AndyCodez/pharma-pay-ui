import React from "react";

function Bill({ bill, completeSale, discardBill }) {
  return (
    <div className="bg-white shadow-md rounded-md p-6">
      {bill ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Bill</h2>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">
              Date: {new Date(bill.billDateTime).toLocaleString()}
            </h4>
            {bill.soldItems.map((item) => (
              <div key={item.id}>
                <p className="mb-1">
                  {item.name} - {item.quantity}
                </p>
              </div>
            ))}
            <h4 className="text-lg font-semibold mt-4">
              {bill.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "KES",
              })}
            </h4>
            {bill.customer ? (
              <h4 className="text-lg font-semibold mt-4">
                {bill.customer.firstName} {bill.customer.lastName}
              </h4>
            ) : null}
          </div>

          <button
            onClick={() => completeSale()}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm"
          >
            Complete Sale
          </button>
          <button
            onClick={() => discardBill()}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm m-2"
          >
            Discard Bill
          </button>
        </>
      ) : (
        <p>No bill to display</p>
      )}
    </div>
  );
}

export default Bill;
