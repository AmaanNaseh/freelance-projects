import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-secondary p-4 mt-8 text-center bg-[#BF9264] w-[92%] mx-auto rounded-t-3xl">
      <Link to={"/attributions"}>
        <p className="my-2 bg-[#F0F1C5] p-2 rounded-lg font-semibold w-fit mx-auto hover:scale-105 transition-all duration-300">
          Attributions
        </p>
      </Link>
      <p>
        @{new Date().getFullYear()} Inventory Management System. All Rights
        Reserved.
      </p>
    </footer>
  );
}
