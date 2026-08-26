import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { backendAPI } from "../config";

export default function DrowsinessDetection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const alarmRef = useRef<HTMLAudioElement>(new Audio("/beep.mp3"));

  const intervalRef = useRef<number | null>(null);

  const [running, setRunning] = useState(false);

  const [drowsy, setDrowsy] = useState(false);

  const [ear, setEar] = useState(0);

  const [faceDetected, setFaceDetected] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // -----------------------------
  // Start Webcam
  // -----------------------------
  const startCamera = async () => {
    try {
      setLoading(true);
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();

        toast.success("Webcam opened successfully !!!");
      }
      setRunning(true);
    } catch (err: any) {
      console.log(err);
      setError("Unable to access webcam.");
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Stop Webcam
  // -----------------------------
  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);

      intervalRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();

      tracks.forEach((track) => track.stop());

      videoRef.current.srcObject = null;
    }

    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;

    setRunning(false);

    setDrowsy(false);

    setFaceDetected(false);
  };

  // -----------------------------
  // Alarm Control
  // -----------------------------
  useEffect(() => {
    const alarm = alarmRef.current;

    alarm.loop = true;

    if (drowsy) {
      alarm.play().catch(() => {});
    } else {
      alarm.pause();

      alarm.currentTime = 0;
    }
  }, [drowsy]);

  // -----------------------------
  // Capture Frames
  // -----------------------------
  useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;

      if (video.readyState < 2) return;

      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;

      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const image = canvas.toDataURL("image/jpeg", 0.8);

      try {
        const response = await fetch(`${backendAPI}/drowsiness-frame`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            image,
          }),
        });

        const data = await response.json();

        setEar(data.ear || 0);

        setDrowsy(data.drowsy || false);

        setFaceDetected(data.ear > 0);
      } catch (err: any) {
        console.log(err);
        toast.error(err);
      }
    }, 150);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running]);

  // -----------------------------
  // Cleanup
  // -----------------------------
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1
        className="text-3xl sm:text-4xl font-bold mb-2"
        style={{
          fontFamily: "Outfit, sans-serif",
          color: "#e2e8f0",
        }}
      >
        Driver Drowsiness Detection
      </h1>

      <p
        className="text-sm mb-8"
        style={{
          color: "#64748b",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Real-time webcam based driver drowsiness monitoring using Eye Aspect
        Ratio (EAR).
      </p>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#0d1627",
          border: "2px solid rgba(56,189,248,.25)",
        }}
      >
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full max-h-125 object-contain ${
              running ? "block" : "hidden"
            }`}
          />

          {!running && (
            <div className="h-80 flex items-center justify-center text-slate-400">
              Webcam is stopped
            </div>
          )}
        </div>

        <canvas
          ref={canvasRef}
          style={{
            display: "none",
          }}
        />
      </div>

      {error && (
        <div
          className="mt-5 p-4 rounded-xl"
          style={{
            background: "rgba(239,68,68,.15)",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      <div className="flex gap-4 mt-6">
        {!running ? (
          <button
            onClick={startCamera}
            disabled={loading}
            className="mt-5 w-full py-3 rounded-xl bg-linear-to-br from-sky-400 to-indigo-400 p-6 text-white
              cursor-pointer hover:scale-105 hover:opacity-90 transition-all duration-300"
          >
            Start Detection
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="mt-5 w-full py-3 rounded-xl bg-red-800 p-6 text-white
              cursor-pointer hover:scale-105 hover:opacity-90 transition-all duration-300"
          >
            Stop Detection
          </button>
        )}
      </div>

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
          Detection Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <p
              className="text-sm"
              style={{
                color: "#94a3b8",
              }}
            >
              Face Detection
            </p>

            <p
              className="text-xl font-bold mt-1"
              style={{
                color: faceDetected ? "#22c55e" : "#ef4444",
              }}
            >
              {faceDetected ? "Detected" : "Not Detected"}
            </p>
          </div>

          <div>
            <p
              className="text-sm"
              style={{
                color: "#94a3b8",
              }}
            >
              EAR Value
            </p>

            <p
              className="text-xl font-bold mt-1"
              style={{
                color: "#38bdf8",
              }}
            >
              {ear.toFixed(3)}
            </p>
          </div>

          <div>
            <p
              className="text-sm"
              style={{
                color: "#94a3b8",
              }}
            >
              Driver Status
            </p>

            <p
              className="text-xl font-bold mt-1"
              style={{
                color: drowsy ? "#ef4444" : "#22c55e",
              }}
            >
              {drowsy ? "Drowsiness Detected" : "Awake"}
            </p>
          </div>
        </div>

        {drowsy && (
          <div
            className="mt-8 rounded-xl p-5 text-center"
            style={{
              background: "rgba(239,68,68,.12)",
              border: "1px solid rgba(239,68,68,.35)",
            }}
          >
            <p
              className="text-2xl font-bold"
              style={{
                color: "#ef4444",
              }}
            >
              ⚠ DROWSINESS DETECTED
            </p>

            <p
              className="mt-2"
              style={{
                color: "#fca5a5",
              }}
            >
              Alarm is active. Please wake up and keep your eyes open.
            </p>
          </div>
        )}

        {!drowsy && running && (
          <div
            className="mt-8 rounded-xl p-5 text-center"
            style={{
              background: "rgba(34,197,94,.12)",
              border: "1px solid rgba(34,197,94,.35)",
            }}
          >
            <p
              className="text-2xl font-bold"
              style={{
                color: "#22c55e",
              }}
            >
              ✓ Driver is Alert
            </p>

            <p
              className="mt-2"
              style={{
                color: "#86efac",
              }}
            >
              No drowsiness detected.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
