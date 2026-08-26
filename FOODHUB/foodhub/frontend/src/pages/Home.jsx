import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { backendAPI } from "../utils/backendAPI";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [quantities, setQuantities] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);

      const role = JSON.parse(localStorage.getItem("user"))?.role;
      setIsAdmin(role === "admin");

      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);

      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    const quantity = quantities[product._id] || 1;

    if (quantity < 1 || quantity > product.quantity) {
      alert("Invalid quantity");
      return;
    }

    if (!user) {
      alert("User not found. Please log in.");
      return;
    }

    try {
      await API.post(`${backendAPI}/api/cart/add`, {
        userId: user._id,
        productId: product._id,
        quantity,
      });

      const updatedProducts = products.map((p) =>
        p._id === product._id ? { ...p, quantity: p.quantity - quantity } : p
      );
      setProducts(updatedProducts);

      await API.put(`${backendAPI}/api/products/${product._id}`, {
        quantity: product.quantity - quantity,
      });

      localStorage.setItem("cart", JSON.stringify(updatedProducts));

      alert("Added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    }
  };

  const handleQuantityChange = (productId, delta, maxQty) => {
    setQuantities((prev) => {
      const newQty = Math.min(
        Math.max((prev[productId] || 1) + delta, 1),
        maxQty
      );
      return { ...prev, [productId]: newQty };
    });
  };

  const specials = products.filter((p) => p.price > 150);
  const quickFood = products.filter((p) => p.price >= 50 && p.price <= 150);
  const others = products.filter((p) => p.price < 50);

  const renderProductCard = (p) => (
    <div
      key={p._id}
      className="border rounded p-4 shadow min-w-[300px] lg:min-w-[320px] min-h-[360px] bg-[#FFE6B8]"
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
        Uploaded by Restaurant: {p.addedBy?.username || "Unknown"}
      </p>
      <h2 className="text-lg font-bold mt-2">Name: {p.name}</h2>
      <p>Price: ₹{p.price}</p>

      {user !== null && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(p._id, -1, p.quantity)}
              className="px-2 py-1 bg-white rounded"
            >
              −
            </button>
            <span className="bg-white p-1">
              {quantities[p._id] || 1}{" "}
              <span className="text-xs text-gray-500">(max {p.quantity})</span>
            </span>
            <button
              onClick={() => handleQuantityChange(p._id, 1, p.quantity)}
              className="px-2 py-1 bg-white rounded"
            >
              +
            </button>
          </div>

          <button
            onClick={() => handleAddToCart(p)}
            disabled={p.quantity === 0}
            className="bg-accent text-black px-3 py-1 rounded w-fit border-[2px] border-black hover:scale-105"
          >
            {p.quantity > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="px-10 py-4">
      <p className="text-center my-8 text-xl font-bold italic text-[#FFB329]">
        Welcome to FoodHub. Enjoy best meals and AI driven recommendations for
        your personalized taste.
      </p>
      <h1 className="text-2xl font-bold text-accent my-8">
        Restaurant's Specials
      </h1>
      <div className="flex flex-wrap items-center gap-8 my-4">
        {specials.map(renderProductCard)}
      </div>

      <h1 className="text-2xl font-bold text-accent my-8">Quick Food</h1>
      <div className="flex flex-wrap items-center gap-8 my-4">
        {quickFood.map(renderProductCard)}
      </div>

      <h1 className="text-2xl font-bold text-accent my-8">Other Items</h1>
      <div className="flex flex-wrap items-center gap-8 my-4">
        {others.map(renderProductCard)}
      </div>
    </div>
  );
}
