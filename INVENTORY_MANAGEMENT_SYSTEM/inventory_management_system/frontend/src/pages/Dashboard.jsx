import { useEffect, useState } from "react";
import API from "../utils/api"; // API utility for making HTTP requests
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch user from localStorage and determine their role
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products"); // Fetch all products
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    if (user) fetchProducts(); // Only fetch products if user is authenticated
  }, [user]);

  // Handle product deletion (only for the admin)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Handle updating a product (for admin users)
  const handleUpdate = (id) => {
    // Redirect or show update form for product with id
    window.location.href = `/update-product/${id}`;
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-accent mb-4">My Products</h1>
        <Link
          to={"/create-product"}
          className="text-white bg-[#4CAF50] px-3 py-1 rounded hover:scale-105 font-bold"
        >
          Add Product
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-8">
        {products.length > 0 ? (
          products
            .filter((product) => product.addedBy.username === user?.username) // Filter products based on username
            .map((product) => (
              <div
                key={product._id}
                className="border rounded p-4 shadow min-w-[300px] lg:min-w-[320px] min-h-[360px] bg-[#F9FAFB]"
              >
                <div className="w-[150px] h-[150px] mx-auto flex items-center justify-center my-4">
                  <img
                    src={`data:${product.image?.contentType};base64,${btoa(
                      new Uint8Array(product.image?.data?.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ""
                      )
                    )}`}
                    alt={product.name}
                    className="w-full h-full"
                  />
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Uploaded by: {product.addedBy.username}
                </p>
                <h2 className="text-lg font-bold mt-2">Name: {product.name}</h2>
                <p>Price: ₹{product.price}</p>
                <p>Quantity: {product.quantity}</p>
                {product.quantity < 101 ? (
                  <p>Alert: Low Stock, Please Refill it. </p>
                ) : (
                  ""
                )}

                <div className="mt-3 space-x-2">
                  {user?.role === "admin" ? (
                    <>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:scale-105 font-bold"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleUpdate(product._id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:scale-105 font-bold"
                      >
                        Edit
                      </button>
                      <Link to={`/products/${product._id}/purchasers`}>
                        <button className="text-white bg-[#4CAF50] px-3 py-1 rounded hover:scale-105 font-bold">
                          Orders
                        </button>
                      </Link>
                    </>
                  ) : (
                    <button
                      disabled={product.quantity === 0}
                      className="bg-accent text-white px-3 py-1 rounded"
                    >
                      {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  )}
                </div>
              </div>
            ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
}
