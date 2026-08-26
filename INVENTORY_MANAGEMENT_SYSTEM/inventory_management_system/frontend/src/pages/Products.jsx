import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { backendAPI } from "../utils/backendAPI";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // Add user state

  const navigate = useNavigate();

  // Save cart to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch products and cart data from the backend
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);

      // Set admin role
      const role = JSON.parse(localStorage.getItem("user"))?.role;
      setIsAdmin(role === "admin");

      // Load user from localStorage and set it to state
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser); // Set user state

      // Load cart from localStorage
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart); // Set cart to the stored values
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product to cart
  const handleAddToCart = async (product) => {
    const qty = prompt("Enter quantity:");
    const quantity = parseInt(qty);

    if (!quantity || quantity < 1 || quantity > product.quantity) {
      alert("Invalid quantity");
      return;
    }

    if (!user) {
      alert("User not found. Please log in.");
      return;
    }

    try {
      // Make API request to add item to the cart
      await API.post(`${backendAPI}/api/cart/add`, {
        userId: user._id, // Now user._id is available
        productId: product._id,
        quantity,
      });

      // Update local storage and product quantity after adding to the cart
      const updatedProducts = products.map((p) =>
        p._id === product._id ? { ...p, quantity: p.quantity - quantity } : p
      );
      setProducts(updatedProducts);

      // Update the backend product quantity in the database
      await API.put(`${backendAPI}/api/products/${product._id}`, {
        quantity: product.quantity - quantity,
      });

      localStorage.setItem("cart", JSON.stringify(updatedProducts)); // Update cart in localStorage

      alert("Added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-accent mb-4">Products</h1>
      <div className="flex flex-wrap items-center gap-8">
        {products.map((p) => (
          <div
            key={p._id}
            className="border rounded p-4 shadow min-w-[300px] lg:min-w-[320px] min-h-[360px] bg-[#F9FAFB]"
          >
            <div className="w-[150px] h-[150px] mx-auto flex items-center justify-center my-4">
              <img
                src={`data:${p.image?.contentType};base64,${btoa(
                  new Uint8Array(p.image?.data?.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                  )
                )}`}
                alt={p.name}
                className="w-full h-full"
              />
            </div>

            <p className="text-sm text-gray-600 text-center">
              Uploaded by: {p.addedBy?.username || "Unknown"}
            </p>
            <h2 className="text-lg font-bold mt-2">Name: {p.name}</h2>
            <p>Price: ₹{p.price}</p>
            <p>Quantity: {p.quantity}</p>

            <div className="mt-3 space-x-2">
              <button
                onClick={() => handleAddToCart(p)}
                disabled={p.quantity === 0}
                className="bg-accent text-black px-3 py-1 rounded w-fit border-[2px] border-black hover:scale-105"
              >
                {p.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
