import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { backendAPI } from "../utils/backendAPI";

const ProductPurchasers = () => {
  const { productId } = useParams(); // URL param
  const [purchasers, setPurchasers] = useState([]);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const fetchPurchasers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${backendAPI}/api/products/${productId}/purchasers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProductName(res.data.name || "Product");
        setPurchasers(res.data.orders || []);
      } catch (error) {
        console.error("Error fetching purchasers:", error);
      }
    };

    fetchPurchasers();
  }, [productId]);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Purchasers of {productName}
      </h1>

      {purchasers.length === 0 ? (
        <p className="text-center text-gray-600">
          No one has purchased this product yet.
        </p>
      ) : (
        <div className="">
          <table className="min-w-fit text-[12px] md:text-lg md:min-w-[80%] mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-[#E3CFBB]">
            <thead className="bg-[#E3CFBB]">
              <tr>
                <th className="py-2 px-4 text-left">User Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Order Date</th>
              </tr>
            </thead>
            <tbody>
              {purchasers.map((order, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{order.user.username}</td>
                  <td className="py-2 px-4">{order.user.email}</td>
                  <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductPurchasers;
