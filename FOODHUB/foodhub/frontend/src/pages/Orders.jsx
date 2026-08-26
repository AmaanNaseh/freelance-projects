import { useEffect, useState } from "react";
import axios from "axios";
import { backendAPI } from "../utils/backendAPI";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${backendAPI}/api/orders/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const sortedOrders = res.data.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setOrders(sortedOrders);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders currently.</p>
      ) : (
        ""
      )}
      <ul className="space-y-4 w-fit flex flex-wrap items-center gap-8 p-4 mx-auto">
        {orders.map((order, idx) => (
          <li
            key={idx}
            className="bg-white p-4 shadow-lg z-10 border-[1px] rounded"
          >
            <h2>
              <strong>Name:</strong>{" "}
              {order.product?.name || order.productSnapshot?.name || "N/A"}
            </h2>
            <p>
              <strong>Quantity:</strong> {order.quantity}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {order.date
                ? new Date(order.date).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Not Available"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
