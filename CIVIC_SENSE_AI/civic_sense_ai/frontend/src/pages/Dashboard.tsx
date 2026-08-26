import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendAPI } from "../config";

const tabs = [
  {
    key: "Helmet",
    label: "Helmet Defaulters",
  },
  {
    key: "Wrong Side",
    label: "Wrong-Side Defaulters",
  },
  {
    key: "Signal",
    label: "Signal Violators",
  },
  {
    key: "Accident",
    label: "Accident Cases",
  },
];

const regulations = [
  {
    key: "Helmet Not Detected",
    regulation: "Section 129 + Section 194D, Motor Vehicles Act",
    action: "₹1,000 + 3-month licence disqualification",
    description:
      "Motorcycle rider/person riding on a motorcycle must wear prescribed protective headgear in a public place.",
  },

  {
    key: "Wrong Side",
    regulation: "Section 184, Motor Vehicles Act",
    action:
      "1st offence: ₹1,000–₹5,000, or 6 months–1 year imprisonment, or both. Repeat offence within 3 years: ₹10,000 or up to 2 years imprisonment, or both.",
    description:
      "Driving at a speed or in a manner dangerous to the public. The section specifically includes jumping a red light, violating a stop sign, using a handheld phone, illegal overtaking, driving against authorised traffic flow, etc.",
  },

  {
    key: "Red Light Violation",
    regulation: "Section 184, Motor Vehicles Act",
    action:
      "1st offence: ₹1,000–₹5,000, or 6 months–1 year imprisonment, or both. Repeat offence within 3 years: ₹10,000 or up to 2 years imprisonment, or both.",
    description:
      "Driving at a speed or in a manner dangerous to the public. The section specifically includes jumping a red light, violating a stop sign, using a handheld phone, illegal overtaking, driving against authorised traffic flow, etc.",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Helmet");

  const [counts, setCounts] = useState({
    Helmet: 0,
    "Wrong Side": 0,
    Signal: 0,
    Accident: 0,
  });

  const [detections, setDetections] = useState<any[]>([]);
  const [locationDetails, setLocationDetails] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    fetchDetections();
  }, []);

  const getLocationDetails = async (
    latitude: number,
    longitude: number,
    index: number,
  ) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      );

      const data = await response.json();
      const address = data.address || {};

      const location = [
        address.road,
        address.neighbourhood || address.suburb,
        address.city || address.town || address.village,
        address.district,
        address.state,
        address.postcode,
      ]
        .filter(Boolean)
        .join(", ");

      setLocationDetails((prev) => ({
        ...prev,
        [index]: location || "Location unavailable",
      }));
    } catch (error) {
      console.error("Reverse geocoding failed:", error);

      setLocationDetails((prev) => ({
        ...prev,
        [index]: "Location unavailable",
      }));
    }
  };

  const fetchDetections = async () => {
    try {
      const response = await fetch(`${backendAPI}/detections`);

      const data = await response.json();

      setCounts(data.counts);

      setDetections(data.detections);

      data.detections.forEach((item: any, index: number) => {
        if (item.latitude && item.longitude) {
          getLocationDetails(item.latitude, item.longitude, index);
        }
      });

      toast.success("Data fetched successfully !!!", {
        toastId: "fetch-success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const stats = [
    {
      label: "Helmet Defaulters",
      value: counts.Helmet,
      color: "#38bdf8",
      icon: "🪖",
    },
    {
      label: "Wrong-Side Defaulters",
      value: counts["Wrong Side"],
      color: "#f472b6",
      icon: "↔️",
    },
    {
      label: "Signal Violators",
      value: counts.Signal,
      color: "#fbbf24",
      icon: "🚦",
    },
    {
      label: "Accident Cases",
      value: counts.Accident,
      color: "#ef4444",
      icon: "🚨",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1
        className="text-3xl sm:text-4xl font-bold text-center mb-10"
        style={{
          fontFamily: "Outfit, sans-serif",
          color: "#e2e8f0",
        }}
      >
        CivicSenseAI <span style={{ color: "#38bdf8" }}>Dashboard</span>
      </h1>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-6 flex items-center gap-4"
            style={{
              background: "#0d1627",
              border: `1px solid ${stat.color}20`,
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: `${stat.color}15`,
              }}
            >
              {stat.icon}
            </div>

            <div>
              <p
                className="text-3xl font-bold"
                style={{
                  color: stat.color,
                  fontFamily: "Outfit",
                }}
              >
                {stat.value}
              </p>

              <p
                className="text-sm"
                style={{
                  color: "#64748b",
                }}
              >
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer"
            style={{
              background:
                activeTab === tab.key
                  ? "linear-gradient(135deg,#38bdf8,#818cf8)"
                  : "rgba(255,255,255,0.05)",

              color: activeTab === tab.key ? "#06101f" : "#94a3b8",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DATABASE RECORDS */}

      <div className="flex flex-col gap-4">
        {detections
          .filter((item) => {
            if (activeTab === "Helmet") return item.type.includes("Helmet");

            if (activeTab === "Wrong Side")
              return item.type.includes("Wrong Side");

            if (activeTab === "Signal") return item.type.includes("Red Light");

            if (activeTab === "Accident") return item.type.includes("Accident");

            return false;
          })
          .map((entry, index) => (
            <div
              key={index}
              className="rounded-2xl p-5"
              style={{
                background: "#0d1627",
                border: "1px solid rgba(56,189,248,.1)",
              }}
            >
              <div className="flex flex-col sm:flex-row gap-5">
                {/* IMAGE */}

                <div
                  className="w-full sm:w-40 h-28 rounded-xl overflow-hidden"
                  style={{
                    background: "#020617",
                  }}
                >
                  <img
                    src={`data:image/jpeg;base64,${entry.image}`}
                    className="w-full h-full object-cover"
                    onError={() => {
                      console.log("Image failed", entry.image);
                    }}
                  />
                </div>

                {/* DETAILS */}

                <div className="space-y-3">
                  <Detail label="Detection Type" value={entry.type} highlight />

                  <Detail label="Detected On" value={entry.createdAt} />

                  <Detail
                    label="Location"
                    value={
                      locationDetails[index] ||
                      (entry.latitude && entry.longitude
                        ? "Finding location..."
                        : "Location unavailable")
                    }
                  />

                  <Detail
                    label="Detected Number Plate"
                    value={entry.numberplate || "Not Detected"}
                  />

                  {entry &&
                    regulations
                      .filter((item) => entry.type === item.key)
                      .map((item) => {
                        return (
                          <div className="space-y-3">
                            <Detail
                              label="Government Regulation"
                              value={item.regulation}
                            />

                            <Detail
                              label="Regulatory Action"
                              value={item.action}
                            />
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p
        className="text-xs mb-1"
        style={{
          color: "#64748b",
        }}
      >
        {label}
      </p>

      <p
        className="text-sm font-medium"
        style={{
          color: highlight ? "#38bdf8" : "#e2e8f0",
        }}
      >
        {value}
      </p>
    </div>
  );
}
