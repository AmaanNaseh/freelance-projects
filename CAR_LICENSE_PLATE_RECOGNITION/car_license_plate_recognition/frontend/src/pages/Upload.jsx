import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { backend_API } from "../config/Config";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [plate, setPlate] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const capturedFile = new File([blob], "captured.jpg", {
        type: "image/jpeg",
      });
      setFile(capturedFile);
      setPreview(URL.createObjectURL(capturedFile)); // Show preview
    }, "image/jpeg");
  };

  useEffect(() => {
    console.log("Plate updated:", plate);
  }, [plate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select or capture an image.");

    setLoading(true); // Start loader
    setPlate(""); // Clear previous plate

    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(`${backend_API}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlate(res.data.number_plate);
      alert("Data saved successfully.");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console for error.");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <input type="file" onChange={handleFileChange} />
          <button
            className="bg-green-500 hover:bg-green-400 min-w-[142px] font-bold px-4 py-2 hover:scale-105 transition-transform duration-150 text-white"
            onClick={startCamera}
          >
            Start Camera
          </button>
        </div>
        <div className="p-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20">
          <div>
            <div className="flex flex-col items-center justify-center my-10 gap-8">
              <video
                ref={videoRef}
                autoPlay
                className="border rounded w-[300px] h-[300px] md:w-[450px] md:h-[450px] px-2 md:px-6"
              />
              <canvas ref={canvasRef} hidden />
            </div>

            <div className="flex flex-col items-center justify-center gap-8">
              <button
                className="bg-[#041FFE] hover:bg-[#041FFE]/75 font-bold px-4 py-2 hover:scale-105 transition-transform duration-150 text-white"
                onClick={captureImage}
              >
                Capture Image
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center my-10 gap-8">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-[300px] h-[300px] p-2 md:p-6 border rounded shadow"
              />
            ) : (
              <p className="text-gray-500">No image selected or captured</p>
            )}
            <div className="flex flex-col items-center justify-center gap-8">
              <button
                className="bg-green-500 hover:bg-green-400 min-w-[142px] font-bold px-4 py-2 hover:scale-105 transition-transform duration-150 text-white"
                onClick={handleUpload}
              >
                Recognize
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center my-6">
        {loading ? (
          <p className="text-blue-500 text-lg font-semibold animate-pulse">
            Detecting number plate...
          </p>
        ) : plate ? (
          <p className="font-semibold text-black text-center lg:text-2xl">
            Detected Number Plate:{" "}
            <span className="bg-gray-200 text-black font-bold px-1 py-1 md:px-4 md:py-2">
              {plate}
            </span>
          </p>
        ) : null}
      </div>
    </>
  );
}
