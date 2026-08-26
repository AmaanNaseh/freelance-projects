import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { backendAPI } from "../config";

export default function TrafficDensityDetection() {
  const [mode, setMode] = useState<"image" | "camera">("image");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [resultImage, setResultImage] = useState<string | null>(null);

  const [counts, setCounts] = useState<any>({
    car: 0,
    motorcycle: 0,
    bus: 0,
    truck: 0,
  });

  const [total, setTotal] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const intervalRef = useRef<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setUploadedImage(URL.createObjectURL(file));

    setResultImage(null);

    toast.success("File uploaded successfully !!!");
  };

  const detectImage = async () => {
    if (!imageFile) return;

    const formData = new FormData();

    formData.append("image", imageFile);

    const response = await fetch(`${backendAPI}/traffic-density`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setCounts(data.vehicle_count);

    setTotal(data.total);

    setResultImage(`${backendAPI}/result/${data.result_image}`);

    toast.success("Detection successful !!!");
  };

  // CAMERA

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;

      await videoRef.current.play();

      toast.success("Webcam opened successfully !!!");
    }

    intervalRef.current = setInterval(sendFrame, 1000);
  };

  const stopCamera = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const sendFrame = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();

      formData.append("image", blob, "frame.jpg");

      const response = await fetch(`${backendAPI}/traffic-density`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setCounts(data.vehicle_count);

      setTotal(data.total);

      setResultImage(`${backendAPI}/result/${data.result_image}`);
    }, "image/jpeg");
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-200 mb-2">
        Traffic Density Detection
      </h1>

      <p className="text-slate-400 mb-8">
        Count vehicles from image or live camera
      </p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode("image")}
          className="px-5 py-2 rounded-xl cursor-pointer"
          onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          🖼 Image
        </button>

        <button
          onClick={() => setMode("camera")}
          className="px-5 py-2 rounded-xl cursor-pointer"
          onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          📷 Camera Streaming
        </button>
      </div>

      {mode === "image" && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-64 rounded-xl flex items-center justify-center cursor-pointer"
            style={{
              background: "#0d1627",
            }}
          >
            {uploadedImage ? (
              <img src={uploadedImage} className="max-h-full" />
            ) : (
              <p className="text-slate-400">Upload traffic image</p>
            )}
          </div>

          {imageFile && (
            <button
              onClick={detectImage}
              className="mt-5 w-full py-3 rounded-xl bg-linear-to-br from-sky-400 to-indigo-400 p-6 text-white
              cursor-pointer hover:scale-105 hover:opacity-90 transition-all duration-300"
            >
              Detect Density
            </button>
          )}
        </>
      )}

      {mode === "camera" && (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-72 bg-black rounded-xl"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={startCamera}
              className="flex-1 py-3 rounded-xl bg-green-800 cursor-pointer"
            >
              ▶ Start Camera
            </button>

            <button
              onClick={stopCamera}
              className="flex-1 py-3 rounded-xl bg-red-800 cursor-pointer"
            >
              ■ Stop Camera
            </button>
          </div>
        </>
      )}

      {resultImage && (
        <div className="mt-8">
          <h2 className="text-xl text-cyan-400 mb-4">Detection Result</h2>

          <img src={resultImage} className="rounded-xl" />

          <div className="mt-5 text-slate-200">
            <h3>Total Vehicles : {total}</h3>

            <p>Cars : {counts.car}</p>

            <p>Motorcycles : {counts.motorcycle}</p>

            <p>Buses : {counts.bus}</p>

            <p>Trucks : {counts.truck}</p>
          </div>
        </div>
      )}
    </main>
  );
}
