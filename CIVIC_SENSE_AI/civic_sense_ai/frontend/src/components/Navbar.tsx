import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { citizenFeatures, officerFeatures } from "../utils/routes";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCitizenFeaturesVisible, setIsCitizenFeaturesVisible] =
    useState(false);

  const [isOfficerFeaturesVisible, setIsOfficerFeaturesVisible] =
    useState(false);

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "#38bdf8" : "#94a3b8",
    background: isActive ? "rgba(56, 189, 248, 0.1)" : "transparent",
    fontFamily: "Inter, sans-serif",
  });

  const location = useLocation();
  const currentLocation = location.pathname;

  return (
    <nav
      style={{
        background: "rgba(6, 13, 31, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(56, 189, 248, 0.12)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          to="/"
          style={{ fontFamily: "Outfit, sans-serif" }}
          className="text-xl font-bold tracking-tight"
        >
          <span style={{ color: "#38bdf8" }}>Civic</span>
          <span style={{ color: "#818cf8" }}>Sense</span>
          <span className="text-white">AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="relative w-fit min-w-37.5">
            <h1
              onClick={() => {
                setIsCitizenFeaturesVisible(!isCitizenFeaturesVisible);
              }}
              className={`cursor-pointer hover:text-primary text-center ${isCitizenFeaturesVisible ? "text-primary" : "text-white"}`}
            >
              For Citizens
            </h1>

            {isCitizenFeaturesVisible && (
              <div className="absolute top-11 left-0 w-full flex flex-col items-center justify-center text-center gap-4 p-2 bg-white rounded text-black text-sm">
                {citizenFeatures.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`hover:text-primary ${currentLocation === link.path && "text-primary"}`}
                    onClick={() => {
                      setIsCitizenFeaturesVisible(false);
                    }}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-fit min-w-37.5">
            <h1
              onClick={() => {
                setIsOfficerFeaturesVisible(!isOfficerFeaturesVisible);
              }}
              className={`cursor-pointer hover:text-primary text-center ${isOfficerFeaturesVisible ? "text-primary" : "text-white"}`}
            >
              For Officers
            </h1>

            {isOfficerFeaturesVisible && (
              <div className="absolute top-11 left-0 w-full flex flex-col items-center justify-center text-center gap-4 p-2 bg-white rounded text-black text-sm">
                {officerFeatures.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`hover:text-primary ${currentLocation === link.path && "text-primary"}`}
                    onClick={() => {
                      setIsOfficerFeaturesVisible(false);
                    }}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg border-none cursor-pointer transition-all duration-200"
          style={{
            background: menuOpen
              ? "rgba(56, 189, 248, 0.15)"
              : "rgba(255,255,255,0.06)",
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 2L16 16M16 2L2 16"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 5h14M2 9h14M2 13h14"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="lg:hidden px-4 pb-4"
          style={{ borderTop: "1px solid rgba(56, 189, 248, 0.08)" }}
        >
          <div className="flex flex-col gap-1 pt-2">
            <h1 className="text-center font-semibold mb-4">For Citizens</h1>
            {citizenFeatures.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                style={linkStyle}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
              >
                {link.label}
              </NavLink>
            ))}

            <h1 className="text-center font-semibold mb-4 mt-8">
              For Officers
            </h1>
            {officerFeatures.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                style={linkStyle}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
