import { useEffect, useMemo, useState } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { backendAPI } from "../config";

/* =========================================================
   TYPES
========================================================= */

type Coordinates = {
  lat: number;
  lng: number;
};

type AccidentRecord = {
  id: number;
  type: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  image?: string;
};

type DetectionsResponse = {
  counts: {
    Helmet: number;
    "Wrong Side": number;
    Signal: number;
    Accident: number;
  };
  detections: AccidentRecord[];
};

/* =========================================================
   CONSTANTS
========================================================= */

const SEARCH_RADIUS_KM = 5;
const ACCIDENT_ZONE_RADIUS_KM = 0.5;

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AccidentZones() {
  const [location, setLocation] = useState<Coordinates | null>(null);

  const [locationError, setLocationError] = useState("");

  const [loadingLocation, setLoadingLocation] = useState(true);

  const [loadingAccidents, setLoadingAccidents] = useState(false);

  const [accidents, setAccidents] = useState<AccidentRecord[]>([]);

  const [totalAccidents, setTotalAccidents] = useState(0);

  const [apiError, setApiError] = useState("");

  const [locationAddress, setLocationAddress] = useState({
    road: "",
    neighbourhood: "",
    area: "",
    city: "",
    district: "",
    state: "",
    postcode: "",
    country: "",
  });

  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  /* =========================================================
     GET USER LOCATION
  ========================================================= */

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");

      setLoadingLocation(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(coords);

        setLocationAccuracy(position.coords.accuracy);

        setLoadingLocation(false);

        /* -----------------------------------------------
           Reverse geocoding
        ------------------------------------------------ */

        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`,
        )
          .then((res) => res.json())
          .then((data) => {
            const address = data.address || {};

            setLocationAddress({
              road: address.road || "",

              neighbourhood: address.neighbourhood || address.suburb || "",

              area: address.suburb || address.village || "",

              city: address.city || address.town || address.village || "",

              district:
                address.city_district ||
                address.district ||
                address.county ||
                "",

              state: address.state || "",

              postcode: address.postcode || "",

              country: address.country || "",
            });
          })
          .catch((error) => {
            console.error("Reverse geocoding failed:", error);
          });
      },

      (error) => {
        console.error("Location error:", error);

        setLocationError(
          "Location permission was denied or your position could not be determined.",
        );

        setLoadingLocation(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, []);

  /* =========================================================
     GET ACCIDENT DATA FROM MONGODB THROUGH FLASK
  ========================================================= */

  useEffect(() => {
    if (!location) {
      return;
    }

    const fetchAccidents = async () => {
      try {
        setLoadingAccidents(true);

        setApiError("");

        const response = await fetch(`${backendAPI}/detections`);

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const data: DetectionsResponse = await response.json();

        /* -----------------------------------------------
           Total Accident Count

           This comes directly from:

           counts.Accident

           in your Flask backend.
        ------------------------------------------------ */

        setTotalAccidents(Number(data.counts?.Accident || 0));

        /* -----------------------------------------------
           Filter only Accident records

           Your backend already returns all detections,
           so we select records whose type contains
           "Accident".
        ------------------------------------------------ */

        const accidentRecords = (data.detections || [])
          .filter((item) => {
            return item.type?.toLowerCase().includes("accident");
          })
          .map((item, index) => ({
            ...item,

            id: index + 1,

            latitude: Number(item.latitude),

            longitude: Number(item.longitude),
          }))
          .filter((item) => {
            /*
              Ignore records which do not have valid
              GPS coordinates.
            */

            return (
              Number.isFinite(item.latitude) && Number.isFinite(item.longitude)
            );
          });

        setAccidents(accidentRecords);
      } catch (error) {
        console.error("Failed to fetch accident data:", error);

        setApiError("Unable to load accident records from the backend.");

        setAccidents([]);
      } finally {
        setLoadingAccidents(false);
      }
    };

    fetchAccidents();
  }, [location]);

  /* =========================================================
     ENTERED ACCIDENT ZONE ALERT
  ========================================================= */

  useEffect(() => {
    if (!location || accidents.length === 0) return;

    const accidentInZone = accidents.some((accident) => {
      const distance = getDistance(location, {
        lat: accident.latitude,
        lng: accident.longitude,
      });

      return distance <= ACCIDENT_ZONE_RADIUS_KM;
    });

    if (accidentInZone) {
      const message = "You are in accident zone, please drive carefully";

      // Prevent overlapping/repeated speech
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = "en-US";
      speech.rate = 0.9;
      speech.pitch = 1;

      window.speechSynthesis.speak(speech);
    }
  }, [location, accidents]);
  

  /* =========================================================
     ACCIDENTS WITHIN 5 KM
  ========================================================= */

  const nearbyAccidents = useMemo(() => {
    if (!location) {
      return [];
    }

    return accidents
      .map((accident) => {
        const distance = getDistance(location, {
          lat: accident.latitude,
          lng: accident.longitude,
        });

        return {
          ...accident,
          distance,
        };
      })
      .filter((accident) => accident.distance <= SEARCH_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance);
  }, [location, accidents]);

  /* =========================================================
     MAP BOUNDS

     Leaflet uses rectangular maxBounds.

     The actual accident filtering remains a true
     5 KM circular radius using getDistance().
  ========================================================= */

  const mapBounds = useMemo(() => {
    if (!location) {
      return undefined;
    }

    const latitudeOffset = SEARCH_RADIUS_KM / 111;

    const longitudeOffset =
      SEARCH_RADIUS_KM / (111 * Math.cos((location.lat * Math.PI) / 180));

    return new LatLngBounds(
      [location.lat - latitudeOffset, location.lng - longitudeOffset],

      [location.lat + latitudeOffset, location.lng + longitudeOffset],
    );
  }, [location]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8"
      style={{
        background: "#060d1f",
        color: "#e2e8f0",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: "Outfit",
                color: "#e2e8f0",
              }}
            >
              Accident{" "}
              <span
                style={{
                  color: "#ef4444",
                }}
              >
                Zones
              </span>
            </h1>

            <p
              className="mt-3 max-w-2xl text-sm sm:text-base"
              style={{
                color: "#94a3b8",
              }}
            >
              View recorded accident locations around your current position.
              Only accidents within a 5 km radius are displayed on the map.
            </p>
          </div>

          {/* RADIUS */}

          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: "rgba(239,68,68,.06)",
              border: "1px solid rgba(239,68,68,.15)",
            }}
          >
            <p
              className="text-xs"
              style={{
                color: "#64748b",
              }}
            >
              Monitoring radius
            </p>

            <p
              className="text-2xl font-bold mt-1"
              style={{
                color: "#ef4444",
                fontFamily: "Outfit",
              }}
            >
              5.0 KM
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {(locationError || apiError) && (
        <section className="max-w-7xl mx-auto mb-6">
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(239,68,68,.06)",
              border: "1px solid rgba(239,68,68,.15)",
            }}
          >
            <div className="flex gap-3">
              <span className="text-xl">⚠️</span>

              <div>
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: "#ef4444",
                  }}
                >
                  {locationError
                    ? "Location unavailable"
                    : "Backend unavailable"}
                </p>

                <p
                  className="text-xs mt-1"
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  {locationError || apiError}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          LOCATION LOADING
      ===================================================== */}

      {loadingLocation && (
        <section className="max-w-7xl mx-auto">
          <div
            className="rounded-3xl flex flex-col items-center justify-center min-h-125"
            style={{
              background: "#0d1627",
              border: "1px solid rgba(56,189,248,.1)",
            }}
          >
            <div
              className="w-12 h-12 rounded-full border-2 border-transparent animate-spin"
              style={{
                borderTopColor: "#38bdf8",
                borderRightColor: "#818cf8",
              }}
            />

            <p
              className="mt-5 text-sm"
              style={{
                color: "#94a3b8",
              }}
            >
              Detecting your current location...
            </p>
          </div>
        </section>
      )}

      {/* =====================================================
          MAIN
      ===================================================== */}

      {!loadingLocation && location && (
        <div className="max-w-7xl mx-auto">
          {/* =================================================
              STAT CARDS
          ================================================= */}

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              value={totalAccidents}
              label="Total Recorded Accidents"
              color="#ef4444"
              icon="🚨"
            />

            <StatCard
              value={nearbyAccidents.length}
              label="Accidents Within 5 KM"
              color="#ef4444"
              icon="📍"
            />

            <StatCard
              value={totalAccidents - nearbyAccidents.length}
              label="Accidents Beyond 5 KM"
              color="#f97316"
              icon="📍"
            />

            <StatCard
              value={SEARCH_RADIUS_KM}
              label="Search Radius (KM)"
              color="#38bdf8"
              icon="📡"
            />
          </section>

          {/* =================================================
              MAP + SIDEBAR
          ================================================= */}

          <section className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
            {/* =================================================
                MAP
            ================================================= */}

            <div
              className="rounded-3xl overflow-hidden relative"
              style={{
                background: "#0d1627",
                border: "1px solid rgba(56,189,248,.1)",
                minHeight: "650px",
              }}
            >
              {/* ---------------------------------------------
                  MAP HEADER
              ---------------------------------------------- */}

              <div
                className="absolute top-4 left-4 z-1000 rounded-2xl px-4 py-3"
                style={{
                  background: "rgba(6,13,31,.94)",
                  border: "1px solid rgba(56,189,248,.18)",
                  backdropFilter: "blur(14px)",
                  minWidth: "270px",
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Location icon */}

                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(56,189,248,.1)",
                      border: "1px solid rgba(56,189,248,.15)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 10C20 15 12 22 12 22C12 22 4 15 4 10C4 5.58 7.58 2 12 2C16.42 2 20 5.58 20 10Z"
                        stroke="#38bdf8"
                        strokeWidth="2"
                      />

                      <circle
                        cx="12"
                        cy="10"
                        r="3"
                        stroke="#818cf8"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <div>
                    <p
                      className="text-[10px] uppercase tracking-wider"
                      style={{
                        color: "#64748b",
                      }}
                    >
                      Current Location
                    </p>

                    <p
                      className="text-sm font-semibold mt-1"
                      style={{
                        color: "#e2e8f0",
                        fontFamily: "Outfit",
                      }}
                    >
                      You are here
                    </p>

                    <div className="flex flex-col mt-2 gap-0.5">
                      <p
                        className="text-[10px]"
                        style={{
                          color: "#94a3b8",
                        }}
                      >
                        Latitude:{" "}
                        <span
                          style={{
                            color: "#38bdf8",
                          }}
                        >
                          {location.lat.toFixed(6)}
                        </span>
                      </p>

                      <p
                        className="text-[10px]"
                        style={{
                          color: "#94a3b8",
                        }}
                      >
                        Longitude:{" "}
                        <span
                          style={{
                            color: "#818cf8",
                          }}
                        >
                          {location.lng.toFixed(6)}
                        </span>
                      </p>

                      {/* Address */}

                      <div className="mt-3 space-y-1.5">
                        {locationAddress.road && (
                          <AddressRow
                            label="Road"
                            value={locationAddress.road}
                          />
                        )}

                        {locationAddress.neighbourhood && (
                          <AddressRow
                            label="Neighbourhood"
                            value={locationAddress.neighbourhood}
                          />
                        )}

                        {locationAddress.area && (
                          <AddressRow
                            label="Area"
                            value={locationAddress.area}
                          />
                        )}

                        {locationAddress.city && (
                          <AddressRow
                            label="City"
                            value={locationAddress.city}
                          />
                        )}

                        {locationAddress.district && (
                          <AddressRow
                            label="District"
                            value={locationAddress.district}
                          />
                        )}

                        {locationAddress.state && (
                          <AddressRow
                            label="State"
                            value={locationAddress.state}
                          />
                        )}

                        {locationAddress.postcode && (
                          <AddressRow
                            label="PIN Code"
                            value={locationAddress.postcode}
                          />
                        )}

                        {locationAddress.country && (
                          <AddressRow
                            label="Country"
                            value={locationAddress.country}
                          />
                        )}

                        {locationAccuracy !== null && (
                          <p
                            className="text-[10px] pt-1"
                            style={{
                              color: "#64748b",
                            }}
                          >
                            GPS Accuracy:{" "}
                            <span
                              style={{
                                color: "#38bdf8",
                              }}
                            >
                              ±{Math.round(locationAccuracy)} m
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------
                  LEAFLET MAP
              ---------------------------------------------- */}

              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                minZoom={11}
                maxZoom={18}
                scrollWheelZoom={true}
                maxBounds={mapBounds}
                maxBoundsViscosity={1}
                style={{
                  width: "100%",
                  height: "650px",
                  background: "#060d1f",
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Keep map centered on user */}

                <RecenterMap location={location} />

                {/* -------------------------------------------
                    EXACT 5 KM SEARCH CIRCLE
                -------------------------------------------- */}

                <Circle
                  center={[location.lat, location.lng]}
                  radius={SEARCH_RADIUS_KM * 1000}
                  pathOptions={{
                    color: "#38bdf8",
                    fillColor: "#38bdf8",
                    fillOpacity: 0.035,
                    weight: 2,
                    dashArray: "8 8",
                  }}
                />

                {/* -------------------------------------------
                    USER LOCATION
                -------------------------------------------- */}

                <CircleMarker
                  center={[location.lat, location.lng]}
                  radius={10}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 3,
                    fillColor: "#38bdf8",
                    fillOpacity: 1,
                  }}
                >
                  <Popup>
                    <div
                      style={{
                        minWidth: "180px",
                      }}
                    >
                      <strong>Your Current Location</strong>

                      <br />

                      <span>
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </span>

                      <br />

                      <span
                        style={{
                          color: "#64748b",
                        }}
                      >
                        Search radius: 5 KM
                      </span>
                    </div>
                  </Popup>
                </CircleMarker>

                {/* -------------------------------------------
                    REAL ACCIDENT LOCATIONS
                -------------------------------------------- */}

                {nearbyAccidents.map((accident) => (
                  <CircleMarker
                    key={`${accident.id}-${accident.latitude}-${accident.longitude}`}
                    center={[accident.latitude, accident.longitude]}
                    radius={9}
                    pathOptions={{
                      color: "#ffffff",
                      weight: 2,
                      fillColor: "#ef4444",
                      fillOpacity: 1,
                    }}
                  >
                    <Popup>
                      <div
                        style={{
                          minWidth: "210px",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "8px",
                          }}
                        >
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: "#ef4444",
                              display: "inline-block",
                            }}
                          />

                          <strong
                            style={{
                              fontSize: "15px",
                            }}
                          >
                            Accident Recorded
                          </strong>
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            marginBottom: "6px",
                          }}
                        >
                          Type
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#ef4444",
                            marginBottom: "10px",
                          }}
                        >
                          {accident.type}
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                          }}
                        >
                          Distance
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            marginTop: "2px",
                            marginBottom: "8px",
                          }}
                        >
                          {accident.distance.toFixed(2)} km away
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                          }}
                        >
                          Recorded
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            marginTop: "2px",
                            marginBottom: "8px",
                          }}
                        >
                          {accident.createdAt}
                        </div>

                        <div
                          style={{
                            fontSize: "10px",
                            color: "#94a3b8",
                            borderTop: "1px solid #e2e8f0",
                            paddingTop: "7px",
                          }}
                        >
                          {accident.latitude.toFixed(6)},{" "}
                          {accident.longitude.toFixed(6)}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>

              {/* ---------------------------------------------
                  MAP LEGEND
              ---------------------------------------------- */}

              <div
                className="absolute bottom-5 left-5 z-1000 rounded-2xl p-4"
                style={{
                  background: "rgba(6,13,31,.94)",
                  border: "1px solid rgba(148,163,184,.12)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-wider mb-3"
                  style={{
                    color: "#64748b",
                  }}
                >
                  Map Legend
                </p>

                <div className="space-y-2">
                  <LegendItem color="#38bdf8" label="Your Location" />

                  <LegendItem color="#ef4444" label="Recorded Accident" />

                  <LegendItem color="#38bdf8" label="5 KM Search Radius" />
                </div>
              </div>

              {/* ---------------------------------------------
                  MAP STATUS
              ---------------------------------------------- */}

              <div
                className="absolute bottom-5 right-5 z-1000 rounded-2xl px-4 py-3"
                style={{
                  background: "rgba(6,13,31,.94)",
                  border: "1px solid rgba(239,68,68,.15)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-wider"
                  style={{
                    color: "#64748b",
                  }}
                >
                  Nearby accidents
                </p>

                <p
                  className="text-xl font-bold mt-1"
                  style={{
                    color: "#ef4444",
                    fontFamily: "Outfit",
                  }}
                >
                  {nearbyAccidents.length}
                </p>
              </div>
            </div>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
              className="rounded-3xl p-5"
              style={{
                background: "#0d1627",
                border: "1px solid rgba(56,189,248,.1)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{
                      color: "#ef4444",
                    }}
                  >
                    Recorded
                  </p>

                  <h2
                    className="text-xl font-bold mt-1"
                    style={{
                      fontFamily: "Outfit",
                    }}
                  >
                    Nearby Accidents
                  </h2>
                </div>

                <span
                  className="px-2.5 py-1 rounded-full text-[10px]"
                  style={{
                    background: "rgba(239,68,68,.08)",
                    color: "#ef4444",
                  }}
                >
                  5 KM
                </span>
              </div>

              {/* ---------------------------------------------
                  LOADING
              ---------------------------------------------- */}

              {loadingAccidents && (
                <div
                  className="py-10 text-center"
                  style={{
                    color: "#64748b",
                  }}
                >
                  <div
                    className="w-8 h-8 mx-auto rounded-full border-2 border-transparent animate-spin"
                    style={{
                      borderTopColor: "#ef4444",
                      borderRightColor: "#f97316",
                    }}
                  />

                  <p className="text-xs mt-4">Loading accident records...</p>
                </div>
              )}

              {/* ---------------------------------------------
                  NO ACCIDENTS
              ---------------------------------------------- */}

              {!loadingAccidents && nearbyAccidents.length === 0 && (
                <div
                  className="rounded-2xl p-6 text-center"
                  style={{
                    background: "rgba(255,255,255,.025)",
                    border: "1px solid rgba(148,163,184,.08)",
                  }}
                >
                  <div className="text-3xl mb-3">🛣️</div>

                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: "#e2e8f0",
                    }}
                  >
                    No accidents nearby
                  </p>

                  <p
                    className="text-xs mt-2 leading-5"
                    style={{
                      color: "#64748b",
                    }}
                  >
                    No stored accident records were found within 5 km of your
                    current location.
                  </p>
                </div>
              )}

              {/* ---------------------------------------------
                  ACCIDENT LIST
              ---------------------------------------------- */}

              {!loadingAccidents && nearbyAccidents.length > 0 && (
                <div className="space-y-3 max-h-140 overflow-y-auto pr-1">
                  {nearbyAccidents.map((accident, index) => (
                    <div
                      key={`${accident.id}-sidebar`}
                      className="rounded-2xl p-4"
                      style={{
                        background: "rgba(255,255,255,.025)",
                        border: "1px solid rgba(239,68,68,.12)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Number */}

                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0"
                          style={{
                            background: "rgba(239,68,68,.1)",
                            color: "#ef4444",
                          }}
                        >
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className="text-sm font-semibold truncate"
                              style={{
                                color: "#e2e8f0",
                              }}
                            >
                              Accident #{index + 1}
                            </p>

                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{
                                background: "#ef4444",
                                boxShadow: "0 0 8px #ef4444",
                              }}
                            />
                          </div>

                          <p
                            className="text-[10px] mt-1"
                            style={{
                              color: "#ef4444",
                            }}
                          >
                            {accident.type}
                          </p>

                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span
                                className="text-xs"
                                style={{
                                  color: "#64748b",
                                }}
                              >
                                Distance
                              </span>

                              <span
                                className="text-xs font-semibold"
                                style={{
                                  color: "#e2e8f0",
                                }}
                              >
                                {accident.distance.toFixed(2)} km
                              </span>
                            </div>

                            <div>
                              <p
                                className="text-[10px]"
                                style={{
                                  color: "#475569",
                                }}
                              >
                                Recorded
                              </p>

                              <p
                                className="text-[10px] mt-1"
                                style={{
                                  color: "#94a3b8",
                                }}
                              >
                                {accident.createdAt}
                              </p>
                            </div>

                            <p
                              className="text-[9px] pt-1"
                              style={{
                                color: "#475569",
                              }}
                            >
                              {accident.latitude.toFixed(5)},{" "}
                              {accident.longitude.toFixed(5)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </section>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   MAP RECENTER
========================================================= */

function RecenterMap({ location }: { location: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    map.setView([location.lat, location.lng], 13, {
      animate: true,
    });
  }, [location, map]);

  return null;
}

/* =========================================================
   DISTANCE CALCULATION
   HAVERSINE FORMULA
========================================================= */

function getDistance(pointA: Coordinates, pointB: Coordinates) {
  const R = 6371;

  const dLat = ((pointB.lat - pointA.lat) * Math.PI) / 180;

  const dLng = ((pointB.lng - pointA.lng) * Math.PI) / 180;

  const lat1 = (pointA.lat * Math.PI) / 180;

  const lat2 = (pointB.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  value,
  label,
  color,
  icon,
}: {
  value: string | number;
  label: string;
  color: string;
  icon: string;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#0d1627",
        border: `1px solid ${color}20`,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: `${color}12`,
        }}
      >
        {icon}
      </div>

      <span
        className="block text-2xl font-bold mt-4"
        style={{
          color,
          fontFamily: "Outfit",
        }}
      >
        {value}
      </span>

      <p
        className="text-xs mt-2"
        style={{
          color: "#64748b",
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />

      <span
        className="text-xs"
        style={{
          color: "#94a3b8",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   ADDRESS ROW
========================================================= */

function AddressRow({ label, value }: { label: string; value: string }) {
  return (
    <p
      className="text-[10px]"
      style={{
        color: "#94a3b8",
      }}
    >
      {label}:{" "}
      <span
        style={{
          color: "#e2e8f0",
        }}
      >
        {value}
      </span>
    </p>
  );
}
