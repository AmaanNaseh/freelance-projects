import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { backendAPI } from "../config";

export default function NumberPlateDetection() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [numberPlate, setNumberPlate] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setUploadedImage(URL.createObjectURL(file));

    setNumberPlate("");

    toast.success("Image uploaded successfully !!!");
  };

  const detectNumberPlate = async () => {
    if (!imageFile) return;

    const formData = new FormData();

    formData.append("image", imageFile);

    try {
      setLoading(true);

      const response = await fetch(`${backendAPI}/number-plate`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Number plate detection failed");
      }

      setNumberPlate(data.numberplate || "Not Detected");

      toast.success("Number plate detection successful !!!");
    } catch (error: any) {
      console.log(error);

      toast.error(error.message || "Detection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1
        className="text-3xl sm:text-4xl font-bold mb-2"
        style={{
          fontFamily: "Outfit, sans-serif",
          color: "#e2e8f0",
        }}
      >
        Number Plate Detection
      </h1>

      <p
        className="text-sm mb-8"
        style={{
          color: "#64748b",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Upload an image to detect the vehicle number plate
      </p>

      {/* IMAGE UPLOAD */}

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
            className="w-full max-h-96 object-contain"
            alt="Uploaded"
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

      {/* DETECT BUTTON */}

      {imageFile && (
        <button
          onClick={detectNumberPlate}
          disabled={loading}
          className="mt-5 w-full py-3 rounded-xl bg-linear-to-br from-sky-400 to-indigo-400 text-white cursor-pointer hover:scale-[1.02] hover:opacity-90 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Detecting Number Plate..." : "Detect Number Plate"}
        </button>
      )}

      {/* RESULT */}

      {numberPlate && (
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
            Number Plate Detection Result
          </h2>

          {/* NUMBER PLATE */}

          <div className="mt-6">
            <p
              className="text-sm"
              style={{
                color: "#94a3b8",
              }}
            >
              Number Plate
            </p>

            <p
              className="text-2xl font-bold mt-1"
              style={{
                color:
                  numberPlate && numberPlate !== "Not Detected"
                    ? "#22c55e"
                    : "#ef4444",
              }}
            >
              {numberPlate || "Not Detected"}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
