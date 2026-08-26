import { useMemo, useState } from "react";

type Rule = {
  id: number;
  title: string;
  category: "Safety" | "Traffic" | "Pedestrian" | "Highway" | "Emergency";
  icon: string;
  priority: "Critical" | "Important" | "Good Practice";
  summary: string;
  doText: string;
  dontText: string;
  why: string;
};

const rules: Rule[] = [
  {
    id: 1,
    title: "Wear Your Seat Belt",
    category: "Safety",
    icon: "🪢",
    priority: "Critical",
    summary:
      "Every person travelling in a seat equipped with a safety belt should use it.",
    doText: "Buckle up before the vehicle starts moving.",
    dontText: "Never rely on airbags as a replacement for seat belts.",
    why: "Seat belts reduce the risk of serious injury during sudden braking or collisions.",
  },
  {
    id: 2,
    title: "Wear a Certified Helmet",
    category: "Safety",
    icon: "🪖",
    priority: "Critical",
    summary:
      "Motorcycle riders and applicable pillion riders must use prescribed protective headgear.",
    doText: "Fasten a proper helmet securely before riding.",
    dontText: "Do not ride with an unfastened or unsuitable helmet.",
    why: "A properly fitted helmet significantly improves protection during a crash.",
  },
  {
    id: 3,
    title: "Follow the Speed Limit",
    category: "Traffic",
    icon: "⚡",
    priority: "Critical",
    summary:
      "Drive within the maximum speed prescribed for the road, vehicle and location.",
    doText: "Check road signs and adjust your speed to conditions.",
    dontText:
      "Do not assume the posted limit is always safe for current conditions.",
    why: "Higher speed reduces reaction time and increases stopping distance.",
  },
  {
    id: 4,
    title: "Respect Red Lights",
    category: "Traffic",
    icon: "🚦",
    priority: "Critical",
    summary: "Stop before the stop line when the signal requires you to stop.",
    doText: "Wait for the appropriate signal before proceeding.",
    dontText: "Never jump a red light because the intersection appears empty.",
    why: "Signal violations create high-risk crossing conflicts.",
  },
  {
    id: 5,
    title: "Drive on the Correct Side",
    category: "Traffic",
    icon: "↔️",
    priority: "Critical",
    summary: "Follow the authorised flow of traffic and lane markings.",
    doText: "Keep to your designated side and lane.",
    dontText: "Do not drive against the authorised flow of traffic.",
    why: "Wrong-side driving creates head-on and crossing collision risks.",
  },
  {
    id: 6,
    title: "Give Way to Pedestrians",
    category: "Pedestrian",
    icon: "🚶",
    priority: "Important",
    summary:
      "Slow down and give pedestrians appropriate priority at crossings and vulnerable locations.",
    doText: "Approach crossings cautiously and be prepared to stop.",
    dontText: "Do not accelerate toward a pedestrian crossing.",
    why: "Pedestrians have little physical protection in a collision.",
  },
  {
    id: 7,
    title: "Never Use a Handheld Phone",
    category: "Safety",
    icon: "📵",
    priority: "Critical",
    summary:
      "Keep your attention on driving instead of handheld communications devices.",
    doText: "Park safely before using your phone.",
    dontText: "Do not text, browse or hold a phone while driving.",
    why: "Distraction reduces visual attention, reaction time and vehicle control.",
  },
  {
    id: 8,
    title: "Keep a Safe Following Distance",
    category: "Highway",
    icon: "🚗",
    priority: "Important",
    summary:
      "Maintain enough space to react if the vehicle ahead brakes suddenly.",
    doText: "Increase the gap in rain, fog, darkness or heavy traffic.",
    dontText: "Do not tailgate another vehicle.",
    why: "A larger gap gives you additional reaction and braking time.",
  },
  {
    id: 9,
    title: "Give Way to Emergency Vehicles",
    category: "Emergency",
    icon: "🚑",
    priority: "Critical",
    summary:
      "Move appropriately to provide a clear path for ambulances, fire vehicles and other authorised emergency vehicles.",
    doText: "Stay calm, check your surroundings and make room safely.",
    dontText: "Do not block or race an approaching emergency vehicle.",
    why: "Seconds can matter when emergency services are responding to an incident.",
  },
  {
    id: 10,
    title: "Never Drive Under the Influence",
    category: "Safety",
    icon: "🍺",
    priority: "Critical",
    summary:
      "Do not drive when alcohol or drugs have impaired your ability to control the vehicle.",
    doText: "Use a sober driver or another safe means of transport.",
    dontText:
      "Do not assume you are safe to drive simply because you feel normal.",
    why: "Impairment can affect judgement, coordination and reaction time.",
  },
  {
    id: 11,
    title: "Overtake Only When Safe",
    category: "Traffic",
    icon: "↗️",
    priority: "Important",
    summary: "Overtake only when permitted, visible and safe to do so.",
    doText: "Check mirrors, blind spots, signals and road markings.",
    dontText:
      "Do not overtake at unsafe locations or by crossing prohibited markings.",
    why: "Unsafe overtaking is a major source of high-speed collisions.",
  },
  {
    id: 12,
    title: "Do Not Obstruct the Road",
    category: "Traffic",
    icon: "🚧",
    priority: "Important",
    summary:
      "Do not leave a vehicle in a position that creates danger, obstruction or undue inconvenience.",
    doText: "Park only where permitted and safe.",
    dontText: "Do not abandon a vehicle in a dangerous position.",
    why: "Obstructions can create sudden hazards for other road users.",
  },
];

const categories = [
  "All",
  "Safety",
  "Traffic",
  "Pedestrian",
  "Highway",
  "Emergency",
];

const priorityColors: Record<Rule["priority"], string> = {
  Critical: "#ef4444",
  Important: "#fbbf24",
  "Good Practice": "#38bdf8",
};

const signals = [
  {
    name: "Red",
    color: "#ef4444",
    meaning: "Stop",
    description: "Stop before the stop line and wait.",
  },
  {
    name: "Yellow",
    color: "#fbbf24",
    meaning: "Prepare / Stop",
    description: "Proceed only when it is safe and legally permitted.",
  },
  {
    name: "Green",
    color: "#22c55e",
    meaning: "Proceed",
    description: "Proceed while continuing to observe other road users.",
  },
];

export default function DrivingRules() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedRule, setExpandedRule] = useState<number | null>(null);

  const filteredRules = useMemo(() => {
    if (activeCategory === "All") return rules;

    return rules.filter((rule) => rule.category === activeCategory);
  }, [activeCategory]);

  const criticalCount = rules.filter(
    (rule) => rule.priority === "Critical",
  ).length;

  const safetyScore = Math.round(
    ((rules.length - criticalCount + criticalCount * 1.2) /
      (rules.length * 1.2)) *
      100,
  );

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      {/* HEADER */}
      <section className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p
              className="text-xs uppercase tracking-[0.25em] mb-3"
              style={{ color: "#38bdf8" }}
            >
              CivicSenseAI • Road Safety
            </p>

            <h1
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: "Outfit",
                color: "#e2e8f0",
              }}
            >
              Driving <span style={{ color: "#38bdf8" }}>Rules</span>
            </h1>

            <p
              className="mt-3 max-w-2xl text-sm sm:text-base"
              style={{ color: "#94a3b8" }}
            >
              A practical visual guide to the everyday rules that keep drivers,
              passengers, cyclists and pedestrians safer.
            </p>
          </div>

          {/* SAFETY SCORE */}
          <div
            className="rounded-2xl p-5 min-w-60"
            style={{
              background:
                "linear-gradient(135deg, rgba(56,189,248,.08), rgba(129,140,248,.08))",
              border: "1px solid rgba(56,189,248,.15)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: "#94a3b8" }}>
                Rule Awareness
              </span>

              <span className="font-bold" style={{ color: "#38bdf8" }}>
                {safetyScore}%
              </span>
            </div>

            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "#020617" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${safetyScore}%`,
                  background: "linear-gradient(90deg,#38bdf8,#818cf8)",
                }}
              />
            </div>

            <p className="text-xs mt-3" style={{ color: "#64748b" }}>
              Know the rules. Reduce the risk.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          value={rules.length}
          label="Essential Rules"
          color="#38bdf8"
          icon="📘"
        />

        <StatCard
          value={criticalCount}
          label="Critical Rules"
          color="#ef4444"
          icon="⚠️"
        />

        <StatCard value={5} label="Rule Categories" color="#818cf8" icon="🗂️" />

        <StatCard
          value="24/7"
          label="Road Awareness"
          color="#22c55e"
          icon="🛡️"
        />
      </section>

      {/* CATEGORY FILTER */}
      <section className="mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const active = category === activeCategory;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all cursor-pointer"
                style={{
                  background: active
                    ? "linear-gradient(135deg,#38bdf8,#818cf8)"
                    : "rgba(255,255,255,.04)",
                  color: active ? "#06101f" : "#94a3b8",
                  border: active
                    ? "1px solid transparent"
                    : "1px solid rgba(148,163,184,.1)",
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* RULE GRID */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "Outfit" }}>
              Know Before You Drive
            </h2>

            <p className="text-sm mt-1" style={{ color: "#64748b" }}>
              {filteredRules.length} rules in this category
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredRules.map((rule) => {
            const expanded = expandedRule === rule.id;

            return (
              <div
                key={rule.id}
                className="rounded-2xl overflow-hidden transition-all"
                style={{
                  background: "#0d1627",
                  border: `1px solid ${priorityColors[rule.priority]}22`,
                  boxShadow: expanded
                    ? `0 0 30px ${priorityColors[rule.priority]}10`
                    : "none",
                }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{
                        background: `${priorityColors[rule.priority]}12`,
                      }}
                    >
                      {rule.icon}
                    </div>

                    <span
                      className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        color: priorityColors[rule.priority],
                        background: `${priorityColors[rule.priority]}12`,
                      }}
                    >
                      {rule.priority}
                    </span>
                  </div>

                  <p className="text-xs mt-5 mb-1" style={{ color: "#64748b" }}>
                    {rule.category}
                  </p>

                  <h3
                    className="text-xl font-semibold"
                    style={{ fontFamily: "Outfit" }}
                  >
                    {rule.title}
                  </h3>

                  <p
                    className="text-sm leading-6 mt-3"
                    style={{ color: "#94a3b8" }}
                  >
                    {rule.summary}
                  </p>

                  <button
                    onClick={() => setExpandedRule(expanded ? null : rule.id)}
                    className="mt-5 text-sm font-medium cursor-pointer"
                    style={{ color: "#38bdf8" }}
                  >
                    {expanded ? "Hide guidance ↑" : "View guidance →"}
                  </button>
                </div>

                {expanded && (
                  <div
                    className="p-5 space-y-4"
                    style={{
                      background: "rgba(2,6,23,.35)",
                      borderTop: "1px solid rgba(148,163,184,.08)",
                    }}
                  >
                    <Guidance
                      title="DO"
                      text={rule.doText}
                      color="#22c55e"
                      icon="✓"
                    />

                    <Guidance
                      title="DON'T"
                      text={rule.dontText}
                      color="#ef4444"
                      icon="×"
                    />

                    <div>
                      <p
                        className="text-xs uppercase tracking-wider mb-1"
                        style={{ color: "#64748b" }}
                      >
                        Why it matters
                      </p>

                      <p
                        className="text-sm leading-6"
                        style={{ color: "#cbd5e1" }}
                      >
                        {rule.why}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SIGNAL GUIDE */}
      <section className="mt-12">
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{
            background: "linear-gradient(135deg,#0d1627,#101b32)",
            border: "1px solid rgba(56,189,248,.1)",
          }}
        >
          <div className="mb-7">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: "#38bdf8" }}
            >
              Traffic Signals
            </p>

            <h2
              className="text-2xl font-bold mt-1"
              style={{ fontFamily: "Outfit" }}
            >
              Read the Road Before You Move
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {signals.map((signal) => (
              <div
                key={signal.name}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,.025)",
                  border: `1px solid ${signal.color}20`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{
                      background: signal.color,
                      boxShadow: `0 0 25px ${signal.color}30`,
                    }}
                  />

                  <div>
                    <p
                      className="text-lg font-semibold"
                      style={{ fontFamily: "Outfit" }}
                    >
                      {signal.meaning}
                    </p>

                    <p className="text-xs" style={{ color: "#64748b" }}>
                      {signal.name} signal
                    </p>
                  </div>
                </div>

                <p
                  className="text-sm mt-4 leading-6"
                  style={{ color: "#94a3b8" }}
                >
                  {signal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE DRIVE CHECKLIST */}
      <section className="mt-8 mb-10">
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{
            background: "#0d1627",
            border: "1px solid rgba(129,140,248,.12)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
            <div>
              <p
                className="text-xs uppercase tracking-widest"
                style={{ color: "#818cf8" }}
              >
                30 Second Checklist
              </p>

              <h2
                className="text-2xl font-bold mt-1"
                style={{ fontFamily: "Outfit" }}
              >
                Before You Start Driving
              </h2>
            </div>

            <span
              className="text-xs px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(56,189,248,.08)",
                color: "#38bdf8",
              }}
            >
              Safety First
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              "Seat belt / helmet secured",
              "Mirrors adjusted",
              "Phone away",
              "Vehicle surroundings checked",
              "Speed limit understood",
              "Route / navigation ready",
              "Fuel / vehicle condition checked",
              "Mind focused on driving",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,.025)",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "rgba(56,189,248,.1)",
                    color: "#38bdf8",
                  }}
                >
                  {index + 1}
                </div>

                <span className="text-sm" style={{ color: "#cbd5e1" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

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
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}12` }}
        >
          {icon}
        </div>

        <span
          className="text-2xl font-bold"
          style={{
            color,
            fontFamily: "Outfit",
          }}
        >
          {value}
        </span>
      </div>

      <p className="text-xs mt-4" style={{ color: "#64748b" }}>
        {label}
      </p>
    </div>
  );
}

function Guidance({
  title,
  text,
  color,
  icon,
}: {
  title: string;
  text: string;
  color: string;
  icon: string;
}) {
  return (
    <div className="flex gap-3">
      <div
        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold"
        style={{
          background: `${color}12`,
          color,
        }}
      >
        {icon}
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider" style={{ color }}>
          {title}
        </p>

        <p className="text-sm mt-1 leading-5" style={{ color: "#cbd5e1" }}>
          {text}
        </p>
      </div>
    </div>
  );
}
