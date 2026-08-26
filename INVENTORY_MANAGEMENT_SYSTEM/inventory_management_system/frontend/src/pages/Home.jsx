import React from "react";
import authIcon from "../assets/authIcon.png";
import ecommerceIcon from "../assets/ecommerceIcon.png";
import dashboardIcon from "../assets/dashboardIcon.png";
import cartIcon from "../assets/cartIcon.png";
import orderIcon from "../assets/orderIcon.png";
import homePoster from "../assets/homePoster.jpg";

export default function Home() {
  return (
    <div className="text-center py-10">
      <h2 className="text-3xl font-bold">Welcome to Inventory System</h2>
      <p className="mt-4 text-lg">
        Manage your products and track orders easily.
      </p>

      <div className="w-[300px] md:w-[600px] lg:w-[1000px] mx-auto">
        <img src={homePoster} alt="..." className="w-full" />
      </div>

      <h2 className="text-center text-4xl italic font-bold my-12">
        Our Features
      </h2>

      <div className="flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col md:flex-row items-center justify-between mx-10 gap-8">
          <div className="md:w-[35%]">
            <div className="w-[250px]">
              <img src={authIcon} alt="..." className="w-full" />
            </div>
          </div>
          <div className="md:w-[35%]">
            <p>
              User authentication - login and signup w.r.t. roles (admin/user)
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mx-10 gap-8">
          <div className="md:w-[35%]">
            <p>
              Personalized E-Commerce Integration with Inventory to purchase
              orders in bulk from sellers.
            </p>
          </div>
          <div className="md:w-[35%]">
            <div className="w-[250px]">
              <img src={ecommerceIcon} alt="..." className="w-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mx-10 gap-8">
          <div className="md:w-[35%]">
            <div className="w-[250px]">
              <img src={dashboardIcon} alt="..." className="w-full" />
            </div>
          </div>
          <div className="md:w-[35%]">
            <p>
              Personalized Dashboards for admins to track their products
              statistics and market impact.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mx-10 gap-8">
          <div className="md:w-[35%]">
            <p>
              Cart and Order history with stock alert system which notifies low
              stock information during the time of need.
            </p>
          </div>
          <div className="md:w-[35%]">
            <div className="w-[250px]">
              <img src={cartIcon} alt="..." className="w-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mx-10 gap-8">
          <div className="md:w-[35%]">
            <div className="w-[250px]">
              <img src={orderIcon} alt="..." className="w-full" />
            </div>
          </div>
          <div className="md:w-[35%]">
            <p>
              Order history to check past orders in both user and admin
              interface and analyze insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
