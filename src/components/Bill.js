import React from "react";

function Bill({ bill, completeSale }) {
  return (
    <div>
      {bill ? (
        <>
          <h2>Bill</h2>
          <div>
            <h4>Date {bill.billDateTime}</h4>
            {bill.soldItems.map((item) => (
              <div key={item.id}>
                <p>
                  {item.name} - {item.quantity}
                </p>
              </div>
            ))}
            <h4>{bill.amount}</h4>
            {bill.customer ? (
              <h4>
                {bill.customer.firstName} {bill.customer.lastName}
              </h4>
            ) : null}

            <button onClick={() => completeSale()}>Complete sale</button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Bill;
