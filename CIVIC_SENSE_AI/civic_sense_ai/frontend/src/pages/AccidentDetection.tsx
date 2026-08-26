import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { backendAPI } from "../config";
import Loader from "../components/Loader";

export default function AccidentDetection() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [accidents, setAccidents] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setUploadedVideo(URL.createObjectURL(file));
    setResultVideo(null);
    setAccidents(0);
    setPreviewImage(null);
    setShowModal(false);

    toast.success("File uploaded successfully !!!");
  };

  const detectAccident = async () => {
    if (!videoFile) return;
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      setLoading(true);

      const response = await fetch(
        `${backendAPI}/accident-detection`,

        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      setAccidents(data.accidents || 0);
      setResultVideo(`${backendAPI}/video/${data.result_video}`);

      if (data.result_image) {
        setPreviewImage(`${backendAPI}/result/${data.result_image}`);
      }

      toast.success("Detection Successful !!!");
    } catch (err: any) {
      console.log(err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = (): Promise<GeolocationCoordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    });
  };

  const storeDetection = async () => {
    if (!previewImage) return;

    try {
      setSaving(true);
      // Ask browser for location when user confirms storage
      const coords = await getUserLocation();

      const latitude = coords.latitude;
      const longitude = coords.longitude;

      const image = previewImage.split("/").pop();

      const response = await fetch(`${backendAPI}/store-detection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "Accident Detected",
          image,
          latitude,
          longitude,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Detection stored successfully !!!");
        setShowModal(false);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-slate-200 mb-2">
          Accident Detection
        </h1>

        <p className="text-slate-400 mb-8">
          Upload traffic video to detect possible accidents
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={handleUpload}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="h-64 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden"
          style={{
            background: "#0d1627",
            border: "2px dashed #334155",
          }}
        >
          {uploadedVideo ? (
            <video
              src={uploadedVideo}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="text-slate-400">Click to upload traffic video</p>
          )}
        </div>

        {videoFile && (
          <button
            onClick={detectAccident}
            className="mt-5 w-full py-3 rounded-xl bg-linear-to-br from-sky-400 to-indigo-400 p-6 text-white
              cursor-pointer hover:scale-105 hover:opacity-90 transition-all duration-300"
          >
            {loading ? "Processing Video..." : "Detect Accident"}
          </button>
        )}

        {resultVideo && (
          <div className="mt-8 rounded-2xl p-6 bg-slate-900">
            <h2 className="text-xl text-cyan-400 mb-5">Detection Result</h2>

            <video
              key={resultVideo}
              src={resultVideo}
              controls
              playsInline
              className="w-full rounded-xl"
            />

            <p className="mt-5 text-slate-300">
              Possible Collisions:
              <span className="font-bold text-red-400 ml-2">{accidents}</span>
            </p>

            {accidents > 0 && previewImage && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-5 w-full py-3 rounded-xl bg-linear-to-br from-sky-400 to-indigo-400 p-6 text-white
              cursor-pointer hover:scale-105 hover:opacity-90 transition-all duration-300"
              >
                Store in Database
              </button>
            )}
          </div>
        )}

        {showModal && previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,.75)",
            }}
          >
            <div
              className="rounded-2xl p-6 w-125 max-w-[95%]"
              style={{
                background: "#0d1627",
              }}
            >
              <h2
                className="text-2xl font-bold mb-5"
                style={{
                  color: "#38bdf8",
                }}
              >
                Store Detection
              </h2>

              <img
                src={previewImage}
                alt="Accident Preview"
                className="w-full rounded-xl"
              />

              <div className="mt-5">
                <p
                  className="text-sm"
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  Detection Type
                </p>

                <p
                  className="text-lg font-bold"
                  style={{
                    color: "#ef4444",
                  }}
                >
                  Accident Detected
                </p>
              </div>

              <div className="mt-3">
                <p
                  className="text-sm"
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  Accident Collisions
                </p>

                <p
                  className="text-lg"
                  style={{
                    color: "#e2e8f0",
                  }}
                >
                  {accidents}
                </p>
              </div>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-5 w-full py-3 rounded-xl bg-red-800 p-6 text-white
              cursor-pointer hover:scale-105 hover:opacity-90 transition-all duration-300"
                >
                  Cancel
                </button>

                <button
                  onClick={storeDetection}
                  className="mt-5 w-full py-3 rounded-xl bg-green-800 p-6 text-white
              cursor-pointer hover:scale-105 hover:opacity-90 transition-all duration-300"
                >
                  Confirm Store
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {saving && (
        <Loader text="Saving... Please do not exit or change tab..." />
      )}
    </>
  );
}
