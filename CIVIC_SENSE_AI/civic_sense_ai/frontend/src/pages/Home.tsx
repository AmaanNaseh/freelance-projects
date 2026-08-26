import { Link } from "react-router-dom";

const features = [
  // Driving Rules
  {
    path: "/driving-rules",
    icon: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        {/* Book */}{" "}
        <path
          d="M8 9.5C8 8.67 8.67 8 9.5 8H20C24.42 8 28 11.58 28 16V39C28 35.69 25.31 33 22 33H9.5C8.67 33 8 32.33 8 31.5V9.5Z"
          stroke="#38bdf8"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{" "}
        <path
          d="M40 9.5C40 8.67 39.33 8 38.5 8H28C23.58 8 20 11.58 20 16V39C20 35.69 22.69 33 26 33H38.5C39.33 33 40 32.33 40 31.5V9.5Z"
          stroke="#818cf8"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{" "}
        {/* Rules */}{" "}
        <path
          d="M12.5 15H18"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        <path
          d="M12.5 20H18"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        <path
          d="M30 15H35.5"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        <path
          d="M30 20H35.5"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        {/* Check */}{" "}
        <path
          d="M13 26L15.5 28.5L20 24"
          stroke="#22c55e"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{" "}
      </svg>
    ),
    title: "Driving Rules",
    description:
      "A practical visual guide to essential everyday driving rules. Learn road-safety practices, traffic signals, pedestrian awareness, safe overtaking, emergency-vehicle priority, and essential pre-drive checks.",
    tag: "Road Safety",
  },

  // Driving Laws
  {
    path: "/driving-laws",
    icon: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        {/* Scales */}{" "}
        <path
          d="M24 8V39"
          stroke="#818cf8"
          strokeWidth="2.2"
          strokeLinecap="round"
        />{" "}
        {/* Top */}{" "}
        <path
          d="M15 12H33"
          stroke="#38bdf8"
          strokeWidth="2.2"
          strokeLinecap="round"
        />{" "}
        {/* Left arm */}{" "}
        <path
          d="M24 12L14 17"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        {/* Right arm */}{" "}
        <path
          d="M24 12L34 17"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        {/* Left scale */}{" "}
        <path
          d="M9 17H19"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        <path
          d="M9 17L12 24H16L19 17"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{" "}
        <path
          d="M11 24H17"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        {/* Right scale */}{" "}
        <path
          d="M29 17H39"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        <path
          d="M29 17L32 24H36L39 17"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{" "}
        <path
          d="M31 24H37"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        {/* Base */}{" "}
        <path
          d="M18 39H30"
          stroke="#38bdf8"
          strokeWidth="2.2"
          strokeLinecap="round"
        />{" "}
        <path
          d="M20 35H28"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
        />{" "}
        {/* Section symbol */}{" "}
        <circle cx="24" cy="17" r="2" fill="#38bdf8" />{" "}
      </svg>
    ),
    title: "Driving Laws",
    description:
      "Explore important provisions of Indian motor-vehicle law with section numbers, effective dates, regulations, descriptions, fines, legal actions, and practical examples for everyday road users.",
    tag: "Road Safety",
  },

  // Accident Zones
  {
    path: "/accident-zones",
    icon: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Location Pin */}
        <path
          d="M24 42C24 42 37 30.5 37 19C37 11.82 31.18 6 24 6C16.82 6 11 11.82 11 19C11 30.5 24 42 24 42Z"
          stroke="#ef4444"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pin Center */}
        <circle cx="24" cy="19" r="5" stroke="#38bdf8" strokeWidth="2.2" />

        {/* Accident / Danger Symbol */}
        <path
          d="M24 16V19"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <circle cx="24" cy="22" r="1" fill="#fbbf24" />

        {/* Radar / Zone Rings */}
        <path
          d="M7 15C5.7 17.5 5 20.2 5 23"
          stroke="#818cf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.8"
        />

        <path
          d="M41 15C42.3 17.5 43 20.2 43 23"
          stroke="#818cf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.8"
        />

        <path
          d="M9 30C10.5 33 12.5 35.5 15 37.5"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.7"
        />

        <path
          d="M39 30C37.5 33 35.5 35.5 33 37.5"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Small Danger Dots */}
        <circle cx="7" cy="25" r="1.5" fill="#ef4444" />

        <circle cx="41" cy="25" r="1.5" fill="#ef4444" />
      </svg>
    ),
    title: "Accident Zones",
    description:
      "View accident-prone areas around your current location on an interactive map. Identify high-risk zones within a 2 km radius and explore nearby accident hotspots for safer route planning.",
    tag: "Road Safety",
  },

  // Traffic Density Detection
  {
    path: "/detect/traffic-density",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 18h3M8 18h2M12 18h2M16 18h5"
          stroke="#818cf8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M3 13h5M10 13h2M14 13h7"
          stroke="#818cf8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M3 8h7M12 8h3M17 8h4"
          stroke="#818cf8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Traffic Density Detection",
    description:
      "Measures congestion levels in real time by analyzing vehicle density across road segments. Useful for traffic signal optimization.",
    tag: "Analysis",
  },

  // Drowsiness Detection
  {
    path: "/detect/drowsiness",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        {/* Face */}
        <circle cx="12" cy="10" r="5" stroke="#818cf8" strokeWidth="1.8" />
        {/* Closed Eyes */}
        <path
          d="M9 10h2M13 10h2"
          stroke="#818cf8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Mouth */}
        <path
          d="M11 13h2"
          stroke="#818cf8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Sleep Z */}
        <path
          d="M17 5h3l-3 3h3"
          stroke="#818cf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Drowsiness Detection",
    description:
      "Uses a machine learning model to detect driver fatigue by analyzing facial landmarks, eye closure, blinking patterns, and yawning in real time. Helps prevent accidents through timely alerts.",
    tag: "Detection",
  },

  // Dashboard
  {
    path: "/dashboard",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1.5"
          stroke="#38bdf8"
          strokeWidth="1.8"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1.5"
          stroke="#38bdf8"
          strokeWidth="1.8"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1.5"
          stroke="#818cf8"
          strokeWidth="1.8"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1.5"
          stroke="#818cf8"
          strokeWidth="1.8"
        />
      </svg>
    ),
    title: "Dashboard",
    description:
      "Central hub displaying live statistics of all detected violations — helmets, wrong-side driving, signal breaches, and overspeeding.",
    tag: "Analysis",
  },

  // Helmet Detection
  {
    path: "/detect/helmet",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3C7.03 3 3 7.03 3 12v3a2 2 0 002 2h1v-5a6 6 0 0112 0v5h1a2 2 0 002-2v-3c0-4.97-4.03-9-9-9z"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M7 17v1a2 2 0 002 2h6a2 2 0 002-2v-1"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Helmet Detection",
    description:
      "Detects two-wheeler riders without helmets using computer vision. Automatically flags and records violations with plate number and timestamp.",
    tag: "Detection",
  },

  // Red Light Violation Detection
  {
    path: "/detect/signal-violation",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect
          x="9"
          y="2"
          width="6"
          height="20"
          rx="3"
          stroke="#fbbf24"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="7" r="1.5" fill="#ef4444" />
        <circle cx="12" cy="12" r="1.5" fill="#fbbf24" />
        <circle cx="12" cy="17" r="1.5" fill="#22c55e" />
      </svg>
    ),
    title: "Signal Violation Detection",
    description:
      "Detects vehicles that cross intersections during red signals. Captures proof images and logs vehicle details for enforcement.",
    tag: "Detection",
  },

  // Wrong-Side Detection
  {
    path: "/detect/wrong-side",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12h16M4 12l4-4M4 12l4 4"
          stroke="#f472b6"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 6v12"
          stroke="#f472b6"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />
      </svg>
    ),
    title: "Wrong-Side Detection",
    description:
      "Identifies vehicles traveling in the wrong direction on a one-way or divided road. Critical for preventing head-on collisions.",
    tag: "Detection",
  },

  // Accident Detection
  {
    path: "/detect/accident",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L2.8 19h18.4L12 3z"
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M12 9v4"
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.5" r="1" fill="#ef4444" />
      </svg>
    ),
    title: "Accident Detection",
    description:
      "Detects road accidents in real time using computer vision. Identifies collision events, captures incident evidence, and records time and location details for quick emergency response.",
    tag: "Detection",
  },

  // Number Plate Detection
  {
    path: "/detect/number-plate",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Number Plate */}
        <rect
          x="7"
          y="14"
          width="34"
          height="20"
          rx="3"
          stroke="#38bdf8"
          strokeWidth="2.5"
        />

        {/* Plate Inner Border */}
        <rect
          x="11"
          y="18"
          width="26"
          height="12"
          rx="1.5"
          stroke="#818cf8"
          strokeWidth="1.5"
        />

        {/* Plate Text / Number */}
        <path
          d="M14 22H17"
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M19 22H22"
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M24 22H27"
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M29 22H34"
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Detection Corners */}
        <path
          d="M5 11V7H9"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M39 7H43V11"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M5 37V41H9"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M39 41H43V37"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Number Plate Detection",
    description:
      "Detects and recognizes vehicle registration plates from uploaded images using computer vision and OCR. Displays the detected plate number or reports Not Detected when no readable plate is found.",
    tag: "Detection",
  },
];

const tagColors: Record<string, string> = {
  Overview: "rgba(56, 189, 248, 0.15)",
  Detection: "rgba(129, 140, 248, 0.15)",
  Analysis: "rgba(244, 114, 182, 0.15)",
};
const tagText: Record<string, string> = {
  Overview: "#38bdf8",
  Detection: "#818cf8",
  Analysis: "#f472b6",
};

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative px-4 sm:px-6 pt-20 pb-24 text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56, 189, 248, 0.08) 0%, transparent 70%)",
        }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{
            background: "rgba(56, 189, 248, 0.1)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            color: "#38bdf8",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#38bdf8" }}
          />
          AI-Powered Traffic Enforcement
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          <span className="text-white">Smarter Roads with</span>
          <br />
          <span style={{ color: "#38bdf8" }}>Civic</span>
          <span style={{ color: "#818cf8" }}>Sense</span>
          <span className="text-white">AI</span>
        </h1>

        <p
          className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}
        >
          A computer vision platform for real-time detection of traffic
          violations — helmet defaults, wrong-side driving, signal breaches, and
          overspeeding — built to make enforcement efficient and data-driven.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              color: "#060d1f",
              fontFamily: "Outfit, sans-serif",
              textDecoration: "none",
              display: "inline-block",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Go to Dashboard
          </Link>
          {/* <Link
            to="/detect/helmet"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: "transparent",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              color: "#38bdf8",
              fontFamily: "Outfit, sans-serif",
              textDecoration: "none",
              display: "inline-block",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(56, 189, 248, 0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Try Detection
          </Link> */}
        </div>

        {/* Decorative glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.04) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </section>

      {/* Stats bar */}
      <section
        className="px-4 sm:px-6 py-6"
        style={{
          borderTop: "1px solid rgba(56, 189, 248, 0.08)",
          borderBottom: "1px solid rgba(56, 189, 248, 0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: "Violation Types", value: "3" },
            { label: "Detection Modes", value: "8" },
            { label: "AI-Powered", value: "100%" },
            { label: "Real-Time", value: "Yes" },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "Outfit, sans-serif", color: "#38bdf8" }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "#64748b", fontFamily: "Inter, sans-serif" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-4 sm:px-6 py-16 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: "Outfit, sans-serif", color: "#e2e8f0" }}
          >
            Platform Features
          </h2>
          <p
            className="text-sm"
            style={{ color: "#64748b", fontFamily: "Inter, sans-serif" }}
          >
            Everything you need for automated traffic violation enforcement
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <Link
              key={f.path}
              to={f.path}
              className="group text-left p-6 rounded-2xl transition-all duration-300 cursor-pointer border-none w-full"
              style={{
                background: "#0d1627",
                border: "1px solid rgba(56, 189, 248, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border =
                  "1px solid rgba(56, 189, 248, 0.3)";
                e.currentTarget.style.background = "#111e35";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border =
                  "1px solid rgba(56, 189, 248, 0.1)";
                e.currentTarget.style.background = "#0d1627";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(56, 189, 248, 0.08)" }}
                >
                  {f.icon}
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: tagColors[f.tag],
                    color: tagText[f.tag],
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {f.tag}
                </span>
              </div>
              <h3
                className="font-semibold text-base mb-2"
                style={{ fontFamily: "Outfit, sans-serif", color: "#e2e8f0" }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#64748b", fontFamily: "Inter, sans-serif" }}
              >
                {f.description}
              </p>
              <div
                className="flex items-center gap-1.5 mt-5 text-xs font-medium"
                style={{ color: "#38bdf8", fontFamily: "Inter, sans-serif" }}
              >
                Open
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7h8M8 4l3 3-3 3"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
