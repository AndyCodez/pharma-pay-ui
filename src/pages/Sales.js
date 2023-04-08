import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useCart } from "../context/CartProvider";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import Notification from "../components/Notification";

const Sales = () => {
    const { auth } = useAuth();
    const { authToken, role } = auth;

    const [bills, setBills] = useState([]);

    const navigate = useNavigate();

    const { setInfoMessage, infoMessage, showNotification, setShowNotification } =
        useCart();

    const apiVersion = "/api/v1";

    useEffect(() => {
        if (!authToken || role !== "ADMIN") {
            navigate("/login");
            return;
        }

        fetchBills();
    });

    const fetchBills = async () => {
        try {
            const response = await axios.get(`${apiVersion}/bills`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                withCredentials: true,
            });
            setBills(response.data.bills);
        } catch (err) {
            if (err?.response?.status === 400) {
                const errorResponse = JSON.parse(JSON.stringify(err?.response?.data));
                setInfoMessage(errorResponse.errorMessages);
            } else {
                setInfoMessage("Failed to load sales data");
            }

            setShowNotification(true);
        }
    };

    const scrollToTop = () => {
        window.scroll({ top: 0, behavior: "smooth" });
    };
    return (
        <>
            {infoMessage ? (
                <Notification
                    message={infoMessage}
                    show={showNotification}
                    setShow={setShowNotification}
                />
            ) : null}
            <div className="p-4">
                <h1 className="text-3xl font-bold mb-4 text-center">PharmaPay</h1>
                <h1 className="text-2xl font-bold mb-4 text-center">Sales</h1>
            </div>

            <table className="w-full text-center">
                <thead>
                    <tr>
                        <th>Bill ID</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Customer</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map((bill) => (
                        <tr key={bill.id}>
                            <td>{bill.id}</td>
                            <td>{bill.amount.toLocaleString("en-US", {
                                style: "currency",
                                currency: "KES",
                            })}</td>
                            <td>{new Date(bill.billDateTime).toLocaleString()}</td>
                            <td
                                className={
                                    bill.status === "PAID"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-500 text-white"
                                }
                            >
                                {bill.status}
                            </td>
                            <td>
                                {bill.customer
                                    ? `${bill.customer.firstName} ${bill.customer.lastName}`
                                    : "Over The Counter"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Sales;
