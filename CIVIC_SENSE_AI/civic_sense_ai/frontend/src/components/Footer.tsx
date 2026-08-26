import { Link } from "react-router-dom";
import { citizenFeatures, officerFeatures } from "../utils/routes";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(56, 189, 248, 0.12)",
        background: "rgba(6, 13, 31, 0.95)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <Link to="/">
              <p
                className="text-2xl font-bold mb-3"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                <span style={{ color: "#38bdf8" }}>Civic</span>
                <span style={{ color: "#818cf8" }}>Sense</span>
                <span className="text-white">AI</span>
              </p>
            </Link>

            <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
              An AI-powered traffic violation detection system built for
              smarter, safer roads. Detecting helmet violations, wrong-side
              driving, signal breaches, overspeeding, and traffic density in
              real time.
            </p>
          </div>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#475569" }}
            >
              For Citizens
            </p>

            <div className="flex flex-col gap-2">
              {citizenFeatures.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm transition-colors duration-200 w-fit"
                  style={{
                    color: "#64748b",
                    fontFamily: "Inter, sans-serif",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#38bdf8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#64748b")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#475569" }}
            >
              For Officers
            </p>

            <div className="flex flex-col gap-2">
              {officerFeatures.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm transition-colors duration-200 w-fit"
                  style={{
                    color: "#64748b",
                    fontFamily: "Inter, sans-serif",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#38bdf8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#64748b")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            color: "#334155",
            fontFamily: "Inter, sans-serif",
          }}
        >
          &copy; {new Date().getFullYear()} Civic Sense AI
        </div>
      </div>
    </footer>
  );
}
