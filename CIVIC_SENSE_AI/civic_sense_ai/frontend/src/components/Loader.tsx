interface LoaderProps {
  text?: string;
}

export default function Loader({ text = "Loading..." }: LoaderProps) {
  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      style={{
        background: "rgba(2, 6, 23, 0.72)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
      }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Creative Loader */}
        <div className="relative w-40 h-40">
          {/* Outer glow */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "rgba(56, 189, 248, 0.08)",
            }}
          />

          {/* Rotating gradient ring */}
          <div
            className="absolute inset-1 rounded-full animate-spin"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, #38bdf8 90deg, #818cf8 180deg, transparent 280deg)",
              animationDuration: "1.4s",
            }}
          />
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-1">
          <span
            className="text-sm font-medium"
            style={{
              color: "#cbd5e1",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {text}
          </span>

          <span className="flex gap-1 ml-1" style={{ color: "#38bdf8" }}>
            <span className="animate-bounce [animation-delay:0ms]">.</span>
            <span className="animate-bounce [animation-delay:150ms]">.</span>
            <span className="animate-bounce [animation-delay:300ms]">.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
