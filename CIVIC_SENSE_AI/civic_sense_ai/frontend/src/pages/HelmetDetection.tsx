import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { backendAPI } from "../config";
import Loader from "../components/Loader";

export default function HelmetDetection() {
  const [mode, setMode] = useState<"image" | "video">("image");

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [resultImage, setResultImage] = useState<string | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [helmetDetected, setHelmetDetected] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const intervalRef = useRef<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setUploadedImage(URL.createObjectURL(file));

    setResultImage(null);

    setPreviewImage(null);

    setShowModal(false);

    setHelmetDetected(false);

    toast.success("File uploaded successfully !!!");
  };

  const detectImage = async () => {
    if (!imageFile) return;

    const formData = new FormData();

    formData.append("image", imageFile);

    try {
      setLoading(true);

      const response = await fetch(`${backendAPI}/detect`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setHelmetDetected(data.helmet_detected);

      setDetections(data.detections || []);

      const imageUrl = `${backendAPI}/result/${data.result_image}`;

      setResultImage(imageUrl);

      if (!data.helmet_detected) {
        setPreviewImage(imageUrl);
      }

      toast.success("Detection successful !!!");
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
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
    } catch (err: any) {
      toast.error(err);
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());

      streamRef.current = null;
    }
  };

  const sendFrame = async () => {
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

      const response = await fetch(`${backendAPI}/detect`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setHelmetDetected(data.helmet_detected);

      setDetections(data.detections || []);

      const imageUrl = `${backendAPI}/result/${data.result_image}`;

      setResultImage(imageUrl);

      if (!data.helmet_detected) {
        setPreviewImage(imageUrl);
      }

      if (data.helmet_detected) {
        stopCamera();
      }
    }, "image/jpeg");
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
          type: "Helmet Not Detected",
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
          Helmet Detection
        </h1>

        <p
          className="text-sm mb-8"
          style={{
            color: "#64748b",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Upload an image or start camera to detect helmet compliance
        </p>

        {/* MODE SELECT */}

        <div
          className="flex gap-1 p-1 rounded-xl mb-8 w-fit"
          style={{
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {(["image", "video"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-5 py-2 rounded-lg text-sm"
              style={{
                background: mode === m ? "rgba(56,189,248,.15)" : "transparent",

                color: mode === m ? "#38bdf8" : "#64748b",
              }}
            >
              {m === "image" ? "🖼 Image" : "📹 Video"}
            </button>
          ))}
        </div>

        {/* IMAGE MODE */}

        {mode === "image" && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{
                minHeight: "220px",
                background: "#0d1627",
                border: "2px dashed rgba(56,189,248,.25)",
              }}
            >
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  className="w-full max-h-80 object-contain"
                />
              ) : (
                <div
                  className="h-56 flex items-center justify-center"
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  Click to upload image
                </div>
              )}
            </div>

            {imageFile && (
              <button
                onClick={detectImage}
                className="mt-5 w-full py-3 rounded-xl bg-linear-to-br from-sky-400 to-indigo-400 p-6 text-white
              cursor-pointer hover:scale-105 hover:opacity-90 transition-all duration-300"
              >
                {loading ? "Detecting..." : "Detect Helmet"}
              </button>
            )}
          </div>
        )}

        {/* VIDEO MODE */}

        {mode === "video" && (
          <div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                height: "300px",
                background: "#0d1627",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

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
          </div>
        )}

        {/* RESULT */}

        {resultImage && (
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
              Helmet Detection Result
            </h2>

            <img src={resultImage} className="w-full rounded-xl" />

            <div className="mt-5">
              <p
                className="text-sm"
                style={{
                  color: "#94a3b8",
                }}
              >
                Helmet Status
              </p>

              <p
                className="text-lg font-bold"
                style={{
                  color: helmetDetected ? "#22c55e" : "#ef4444",
                }}
              >
                {helmetDetected ? "Helmet Detected" : "No Helmet Detected"}
              </p>
            </div>

            <div className="mt-5">
              <p
                style={{
                  color: "#94a3b8",
                }}
              >
                Objects Found
              </p>

              {detections.map((d, index) => (
                <div
                  key={index}
                  className="text-sm mt-1"
                  style={{
                    color: "#e2e8f0",
                  }}
                >
                  {d.class} - {d.confidence}
                </div>
              ))}
            </div>

            {!helmetDetected && previewImage && (
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
                className="w-full max-w-50 rounded-xl mx-auto"
                alt="Helmet violation"
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
                  Helmet Not Detected
                </p>
              </div>

              <div className="mt-3">
                <p
                  className="text-sm"
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  Objects Found
                </p>

                {detections.map((d, index) => (
                  <p
                    key={index}
                    className="text-sm"
                    style={{
                      color: "#e2e8f0",
                    }}
                  >
                    {d.class} - {d.confidence}
                  </p>
                ))}
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
