import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { backendAPI } from "../config";
import Loader from "../components/Loader";

export default function SignalViolationDetection() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [violations, setViolations] = useState(0);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setVideoFile(file);

    setUploadedVideo(URL.createObjectURL(file));

    setPreviewImage(null);

    setShowModal(false);

    setResultVideo(null);

    setViolations(0);

    toast.success("File uploaded successfully !!!");
  };

  const detectViolation = async () => {
    if (!videoFile) return;

    const formData = new FormData();

    formData.append("video", videoFile);

    try {
      setLoading(true);

      const response = await fetch(`${backendAPI}/traffic-violation`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setViolations(data.violations || 0);

      const videoUrl = `${backendAPI}/video/${data.result_video}`;

      setResultVideo(videoUrl);

      if (data.result_image) {
        setPreviewImage(`${backendAPI}/result/${data.result_image}`);
      }

      toast.success("Detection successful !!!");
    } catch (error: any) {
      console.log(error);
      toast.error(error);
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
          type: "Red Light Violation",
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{
            fontFamily: "Outfit, sans-serif",
            color: "#e2e8f0",
          }}
        >
          Signal Violation Detection
        </h1>

        <p
          className="text-sm mb-8"
          style={{
            color: "#64748b",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Upload traffic video to detect red light violations
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={handleVideoUpload}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl overflow-hidden cursor-pointer"
          style={{
            minHeight: "250px",
            background: "#0d1627",
            border: "2px dashed rgba(56,189,248,.25)",
          }}
        >
          {uploadedVideo ? (
            <video
              src={uploadedVideo}
              controls
              className="w-full max-h-80 object-contain"
            />
          ) : (
            <div
              className="h-64 flex items-center justify-center"
              style={{
                color: "#94a3b8",
              }}
            >
              Click to upload traffic video
            </div>
          )}
        </div>

        {videoFile && (
          <button
            onClick={detectViolation}
            className="mt-5 w-full py-3 rounded-xl bg-linear-to-br from-sky-400 to-indigo-400 p-6 text-white
              cursor-pointer hover:scale-105 hover:opacity-90 transition-all duration-300"
          >
            {loading ? "Processing Video..." : "Detect Signal Violation"}
          </button>
        )}

        {resultVideo && (
          <div
            className="mt-8 rounded-2xl p-6"
            style={{
              background: "#0d1627",
              border: "1px solid rgba(56,189,248,.2)",
            }}
          >
            <h2
              className="text-xl font-bold mb-5"
              style={{
                color: "#38bdf8",
              }}
            >
              Detection Result
            </h2>

            <video
              key={resultVideo}
              src={resultVideo}
              controls
              playsInline
              preload="metadata"
              className="w-full rounded-xl"
            />

            <div className="mt-5">
              <p
                className="text-sm"
                style={{
                  color: "#94a3b8",
                }}
              >
                Total Violations
              </p>

              <p
                className="text-3xl font-bold"
                style={{
                  color: violations > 0 ? "#ef4444" : "#22c55e",
                }}
              >
                {violations}
              </p>
            </div>

            <div className="mt-5">
              <p
                className="text-sm"
                style={{
                  color: "#94a3b8",
                }}
              >
                Status
              </p>

              <p
                className="text-lg font-bold"
                style={{
                  color: violations > 0 ? "#ef4444" : "#22c55e",
                }}
              >
                {violations > 0
                  ? "Red Light Violations Detected"
                  : "No Violations"}
              </p>

              {violations > 0 && previewImage && (
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-5 w-full py-3 rounded-xl bg-linear-to-br from-sky-400 to-indigo-400 p-6 text-white
              cursor-pointer hover:scale-105 hover:opacity-90 transition-all duration-300"
                >
                  Store in Database
                </button>
              )}
            </div>
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
                className="w-full rounded-xl"
                alt="Violation Preview"
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
                  Red Light Violation
                </p>
              </div>

              <div className="mt-3">
                <p
                  className="text-sm"
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  Violations Found
                </p>

                <p
                  className="text-lg"
                  style={{
                    color: "#e2e8f0",
                  }}
                >
                  {violations}
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
