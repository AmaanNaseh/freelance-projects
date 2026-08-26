import { Link } from "react-router-dom";
import homePoster from "../assets/homePoster.png";
import carFrontIcon from "../assets/carFront.jpg";
import carDashboardIcon from "../assets/carDashboard.png";

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <h1 className="text-center text-2xl md:text-4xl font-bold my-10 text-blue-700 italic">
        License Plate Recognition
      </h1>
      <div className="w-[350px] md:w-[600px] lg:w-[900px] my-10">
        <img src={homePoster} alt="poster" className="w-full" />
      </div>

      {token ? (
        <>
          <div className="flex flex-col items-center justify-center mt-12">
            <div className="flex flex-col flex-wrap lg:flex-row items-center justify-center gap-10">
              <div className="w-[200px] md:w-[300px]">
                <img src={carFrontIcon} alt="car front" className="w-full" />
              </div>
              <Link
                to={"/upload"}
                className="flex flex-col gap-10 items-center"
              >
                <p className="max-w-[80%] italic text-center">
                  We provide license plate recognition service through{" "}
                  <strong>OCR - Optical Character Recognition</strong>
                </p>
                <button className="bg-[#041FFE] hover:bg-[#041FFE]/75 text-center font-bold text-white px-4 py-2 rounded text-xl hover:scale-105 transition-all duration-100">
                  Get Started
                </button>
              </Link>
            </div>

            <div className="flex flex-col flex-wrap lg:flex-row items-center justify-center gap-10">
              <div className="w-[200px] md:w-[300px]">
                <img
                  src={carDashboardIcon}
                  alt="car front"
                  className="w-full"
                />
              </div>
              <Link
                to={"/dashboard"}
                className="flex flex-col gap-10 items-center"
              >
                <p className="max-w-[80%] italic text-center">
                  We provide analytics <strong>Dashboard</strong> to view
                  previous recognized license plates with their relevant data
                </p>
                <button className="bg-[#041FFE] hover:bg-[#041FFE]/75 text-center font-bold text-white px-4 py-2 rounded text-xl hover:scale-105 transition-all duration-100">
                  Dashboard
                </button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <p className="text-2xl font-bold text-red-500 my-5">
          Please Login to access the features of this website
        </p>
      )}
    </div>
  );
}
