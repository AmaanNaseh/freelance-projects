import { useMemo, useState } from "react";

type LawCategory =
  | "Licensing"
  | "Speed & Traffic"
  | "Safety"
  | "Vehicle"
  | "Alcohol"
  | "Accident"
  | "Emergency"
  | "General";

type Law = {
  section: string;
  title: string;
  category: LawCategory;
  effectiveFrom: string;
  regulation: string;
  description: string;
  action: string;
  practicalExample: string;
  severity: "Critical" | "High" | "Medium";
};

const laws: Law[] = [
  {
    section: "Section 3",
    title: "Necessity for Driving Licence",
    category: "Licensing",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "A person must hold an effective driving licence authorising them to drive the relevant motor vehicle in a public place.",
    action:
      "Driving without the required licence is punishable under Section 181.",
    practicalExample:
      "Do not drive a car or motorcycle on a public road unless you hold the appropriate valid licence.",
    severity: "Critical",
  },
  {
    section: "Section 4",
    title: "Age Limit for Driving",
    category: "Licensing",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "The Act establishes minimum age requirements for driving motor vehicles, subject to the specific provisions applicable to different vehicle categories.",
    action: "Contravention is punishable under Section 181.",
    practicalExample:
      "A person must satisfy the applicable minimum age requirements before legally driving a motor vehicle.",
    severity: "Critical",
  },
  {
    section: "Section 112",
    title: "Limits of Speed",
    category: "Speed & Traffic",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "A motor vehicle must not be driven above the maximum speed or below a prescribed minimum speed where such limits apply. Speed limits can be prescribed for vehicles, roads or areas.",
    action: "Violation is punishable under Section 183.",
    practicalExample:
      "If a road sign specifies a lower speed limit, follow the posted limit even if your vehicle is capable of travelling faster.",
    severity: "Critical",
  },
  {
    section: "Section 118",
    title: "Driving Regulations",
    category: "General",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "The Central Government may make regulations governing the driving of motor vehicles.",
    action: "Contravention of applicable regulations can attract Section 177A.",
    practicalExample:
      "Driving conduct can be governed not only by the Act but also by regulations made under it.",
    severity: "High",
  },
  {
    section: "Section 119",
    title: "Obedience to Traffic Signs",
    category: "Speed & Traffic",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Drivers must obey mandatory traffic signs and directions applicable to road users.",
    action:
      "Failure to comply may constitute an offence under the Act and applicable rules.",
    practicalExample:
      "Stop signs, mandatory direction signs and other traffic-control signs must be followed.",
    severity: "Critical",
  },
  {
    section: "Section 123",
    title: "Prohibition of Travelling on Footboard",
    category: "Safety",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "The Act regulates unsafe travelling practices such as travelling on the footboard or exterior of a vehicle in prohibited circumstances.",
    action: "Violation can attract statutory penalties.",
    practicalExample:
      "Do not travel hanging from the exterior of a bus or other vehicle.",
    severity: "High",
  },
  {
    section: "Section 128",
    title: "Safety Measures for Motor Cycle Drivers and Pillion Riders",
    category: "Safety",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "The section prescribes safety requirements concerning the driver and pillion rider of motorcycles.",
    action: "Contravention is punishable under Section 194C.",
    practicalExample:
      "Follow the prescribed requirements for carrying a pillion passenger on a motorcycle.",
    severity: "Critical",
  },
  {
    section: "Section 129",
    title: "Protective Headgear",
    category: "Safety",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Motorcycle riders must wear protective headgear meeting the requirements prescribed by law and applicable rules.",
    action:
      "Penalty for violation is provided by Section 194D: ₹1,000 and three-month licence disqualification under the central Act.",
    practicalExample:
      "A motorcycle rider should wear and properly fasten compliant protective headgear before starting the journey.",
    severity: "Critical",
  },
  {
    section: "Section 130",
    title: "Production of Licence and Documents",
    category: "Licensing",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Drivers may be required to produce their driving licence and other prescribed documents for examination by authorised officers.",
    action: "Failure to comply can attract consequences under the Act.",
    practicalExample:
      "Keep required vehicle and driving documents accessible when operating a vehicle.",
    severity: "High",
  },
  {
    section: "Section 132",
    title: "Duty to Stop in Certain Cases",
    category: "Accident",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "A driver has duties to stop and remain stationary for the required period in specified circumstances, including certain accidents and when required by an authorised police officer.",
    action: "Failure to comply may be punished under Section 187.",
    practicalExample:
      "After a road accident, do not simply leave the location without complying with the applicable legal duties.",
    severity: "Critical",
  },
  {
    section: "Section 133",
    title: "Duty of Owner to Give Information",
    category: "Accident",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "The owner or responsible person must provide specified information about the driver or conductor when lawfully demanded by an authorised police officer.",
    action:
      "Failure to provide required information can lead to statutory consequences.",
    practicalExample:
      "A vehicle owner should maintain accurate information about who is operating the vehicle.",
    severity: "High",
  },
  {
    section: "Section 134",
    title: "Duty of Driver in Case of Accident",
    category: "Accident",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "The section establishes duties of drivers involved in accidents, including reasonable steps concerning injured persons and reporting requirements.",
    action: "Failure to comply can attract Section 187.",
    practicalExample:
      "After an accident involving injury, take reasonable steps to secure medical assistance and comply with reporting duties.",
    severity: "Critical",
  },
  {
    section: "Section 177",
    title: "General Penalty",
    category: "General",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Provides a general punishment framework for contraventions where no specific penalty is provided elsewhere in the Act.",
    action:
      "The applicable punishment depends on the specific contravention and statutory wording.",
    practicalExample:
      "Not every traffic offence has its own dedicated penalty section; some fall under a general penalty provision.",
    severity: "Medium",
  },
  {
    section: "Section 177A",
    title: "Contravention of Driving Regulations",
    category: "General",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Provides a penalty framework for contravention of regulations made under Section 118.",
    action:
      "Penalty may be imposed for violating applicable driving regulations.",
    practicalExample:
      "Rules of road and driving regulations can create enforceable requirements beyond the basic Act provisions.",
    severity: "High",
  },
  {
    section: "Section 180",
    title: "Allowing Unauthorised Persons to Drive",
    category: "Licensing",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "A person responsible for a vehicle must not allow an unauthorised person to drive it.",
    action: "Fine of ₹5,000 under the central Act.",
    practicalExample:
      "Do not hand your car or motorcycle to someone who is not legally authorised to drive it.",
    severity: "Critical",
  },
  {
    section: "Section 181",
    title: "Driving Without Required Licence",
    category: "Licensing",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Applies where a person drives in contravention of Section 3 or Section 4.",
    action: "Up to three months' imprisonment, or ₹5,000 fine, or both.",
    practicalExample:
      "Driving without the legally required licence can result in prosecution.",
    severity: "Critical",
  },
  {
    section: "Section 182",
    title: "Licence-Related Offences",
    category: "Licensing",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Covers specified offences relating to driving licences and licensing-related conduct.",
    action:
      "Penalties can include fines and other consequences depending on the specific subsection.",
    practicalExample:
      "Licence information and eligibility must not be misrepresented or improperly used.",
    severity: "High",
  },
  {
    section: "Section 183",
    title: "Driving at Excessive Speed",
    category: "Speed & Traffic",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Penalises driving in contravention of speed limits referred to in Section 112.",
    action:
      "Light motor vehicle: ₹1,000–₹2,000. Medium/heavy goods or passenger vehicle: ₹2,000–₹4,000. Subsequent offences can result in licence impounding.",
    practicalExample:
      "Exceeding the posted or legally prescribed speed limit can result in a challan and, for repeat offences, licence action.",
    severity: "Critical",
  },
  {
    section: "Section 184",
    title: "Dangerous Driving",
    category: "Speed & Traffic",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Covers driving at a speed or in a manner dangerous to the public. The section specifically includes conduct such as jumping a red light, violating a stop sign, using handheld communications devices, unlawful overtaking and driving against authorised traffic flow.",
    action:
      "First offence: imprisonment of 6 months–1 year, or ₹1,000–₹5,000 fine, or both. Subsequent offence within the statutory period: up to 2 years' imprisonment or ₹10,000 fine or both.",
    practicalExample:
      "Wrong-side driving or dangerous overtaking can fall within dangerous-driving provisions.",
    severity: "Critical",
  },
  {
    section: "Section 185",
    title: "Drunken / Drug-Impaired Driving",
    category: "Alcohol",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Applies when alcohol exceeds the statutory threshold or a person is under the influence of a drug to an extent that they cannot properly control the vehicle.",
    action:
      "First offence: up to 6 months' imprisonment or ₹10,000 fine or both. Subsequent offence: up to 2 years' imprisonment or ₹15,000 fine or both.",
    practicalExample:
      "If you have consumed alcohol or are impaired by drugs, do not drive.",
    severity: "Critical",
  },
  {
    section: "Section 186",
    title: "Driving When Physically or Mentally Unfit",
    category: "Safety",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Applies where a driver knowingly suffers from a disease or disability calculated to make driving dangerous to the public.",
    action:
      "First offence: fine up to ₹1,000. Subsequent offence: fine up to ₹2,000.",
    practicalExample:
      "Do not drive if your condition makes it unsafe for you to control the vehicle.",
    severity: "High",
  },
  {
    section: "Section 187",
    title: "Offences Relating to Accidents",
    category: "Accident",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Provides punishment for failure to comply with specified duties following an accident and related statutory requirements.",
    action:
      "First offence: up to 6 months' imprisonment or ₹5,000 fine or both. Subsequent offence: up to 1 year or ₹10,000 fine or both.",
    practicalExample:
      "Do not ignore legal duties after being involved in a qualifying accident.",
    severity: "Critical",
  },
  {
    section: "Section 189",
    title: "Racing and Trials of Speed",
    category: "Speed & Traffic",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Prohibits unauthorised racing or trials of speed between motor vehicles in public places.",
    action:
      "First offence: up to 3 months' imprisonment or ₹5,000 fine or both. Subsequent offence: up to 1 year or ₹10,000 fine or both.",
    practicalExample: "Public roads are not places for racing or speed trials.",
    severity: "Critical",
  },
  {
    section: "Section 190",
    title: "Using Vehicle in Unsafe Condition",
    category: "Vehicle",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Addresses use of vehicles in conditions that violate prescribed safety requirements.",
    action:
      "Penalties depend on the nature of the unsafe condition and statutory provision.",
    practicalExample:
      "Do not operate a vehicle with a dangerous defect that compromises road safety.",
    severity: "High",
  },
  {
    section: "Section 192",
    title: "Using Vehicle Without Registration",
    category: "Vehicle",
    effectiveFrom: "14 Nov 1994",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Prohibits using a motor vehicle in contravention of the registration requirements of Section 39.",
    action:
      "First offence: ₹2,000–₹5,000. Subsequent offence: ₹5,000–₹10,000, or imprisonment up to one year, or both.",
    practicalExample:
      "A vehicle must not be used on public roads without the registration required by law.",
    severity: "Critical",
  },
  {
    section: "Section 192A",
    title: "Using Vehicle Without Permit",
    category: "Vehicle",
    effectiveFrom: "13 Jan 2025",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Applies to use of a transport vehicle without the required permit or in violation of applicable permit conditions.",
    action:
      "First offence: imprisonment up to 6 months and ₹10,000 fine, or both. Subsequent offence: imprisonment up to 1 year with a minimum of 6 months, or ₹10,000 fine, or both.",
    practicalExample:
      "A commercial/transport vehicle must operate with the required permit and within its conditions.",
    severity: "Critical",
  },
  {
    section: "Section 194",
    title: "Exceeding Permissible Weight",
    category: "Vehicle",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Addresses vehicles operated in violation of statutory weight restrictions.",
    action:
      "₹20,000 fine plus ₹2,000 per tonne of excess load, together with applicable off-loading charges. Refusing weighing can attract ₹40,000.",
    practicalExample:
      "Transport operators must not overload vehicles beyond the permissible weight.",
    severity: "High",
  },
  {
    section: "Section 194B",
    title: "Safety Belts and Child Seating",
    category: "Safety",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Requires safety-belt use and provides requirements for children below 14 years regarding safety belts or child restraint systems.",
    action:
      "₹1,000 fine for applicable seat-belt or child-restraint violations.",
    practicalExample:
      "Children below the statutory age threshold should be secured using the required safety belt or child restraint system.",
    severity: "Critical",
  },
  {
    section: "Section 194C",
    title: "Motorcycle Safety Measures",
    category: "Safety",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Penalises violation of the safety measures prescribed for motorcycle drivers and pillion riders under Section 128 and applicable rules or regulations.",
    action:
      "₹1,000 fine and three-month disqualification from holding a driving licence.",
    practicalExample:
      "Follow the statutory requirements governing motorcycle riders and pillion passengers.",
    severity: "Critical",
  },
  {
    section: "Section 194D",
    title: "Not Wearing Protective Headgear",
    category: "Safety",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Penalises driving a motorcycle in contravention of Section 129 or the applicable rules and regulations concerning protective headgear.",
    action: "₹1,000 fine and three-month licence disqualification.",
    practicalExample:
      "A motorcycle rider should use compliant protective headgear before riding.",
    severity: "Critical",
  },
  {
    section: "Section 194E",
    title: "Failure to Give Way to Emergency Vehicles",
    category: "Emergency",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Requires drivers to draw to the side of the road when an applicable fire service vehicle, ambulance or other specified emergency vehicle approaches.",
    action: "Up to 6 months' imprisonment, or ₹10,000 fine, or both.",
    practicalExample:
      "When an ambulance approaches with emergency warning signals, make room safely and promptly.",
    severity: "Critical",
  },
  {
    section: "Section 194F",
    title: "Improper Horn Use / Silence Zones",
    category: "General",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Restricts needless or continuous horn use, horn use where prohibited, and certain exhaust cut-out practices.",
    action:
      "₹1,000 fine for the first offence and ₹2,000 for subsequent offences.",
    practicalExample:
      "Do not repeatedly honk in a silence zone or use a horn unnecessarily.",
    severity: "Medium",
  },
  {
    section: "Section 196",
    title: "Driving an Uninsured Vehicle",
    category: "Vehicle",
    effectiveFrom: "01 Sep 2019",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Prohibits using a motor vehicle in contravention of the compulsory insurance requirement under Section 146.",
    action:
      "First offence: up to 3 months' imprisonment or ₹2,000 fine or both. Subsequent offence: up to 3 months' imprisonment or ₹4,000 fine or both.",
    practicalExample:
      "Ensure the vehicle has the insurance coverage legally required before using it on public roads.",
    severity: "Critical",
  },
  {
    section: "Section 201",
    title: "Obstruction of Free Flow of Traffic",
    category: "General",
    effectiveFrom: "01 Jul 1989",
    regulation: "Motor Vehicles Act, 1988",
    description:
      "Provides for penalties concerning obstruction that interferes with the free flow of traffic.",
    action:
      "Applicable penalty depends on the specific statutory circumstances.",
    practicalExample:
      "Do not stop or leave a vehicle in a manner that unnecessarily blocks moving traffic.",
    severity: "High",
  },
];

const categories: Array<"All" | LawCategory> = [
  "All",
  "Licensing",
  "Speed & Traffic",
  "Safety",
  "Vehicle",
  "Alcohol",
  "Accident",
  "Emergency",
  "General",
];

const severityColors = {
  Critical: "#ef4444",
  High: "#fbbf24",
  Medium: "#38bdf8",
};

export default function DrivingLaws() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | LawCategory>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredLaws = useMemo(() => {
    const query = search.toLowerCase().trim();

    return laws.filter((law) => {
      const matchesCategory = category === "All" || law.category === category;

      if (!query) return matchesCategory;

      const searchable = [
        law.section,
        law.title,
        law.category,
        law.regulation,
        law.description,
        law.action,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchable.includes(query);
    });
  }, [search, category]);

  const critical = laws.filter((law) => law.severity === "Critical").length;

  const fineRelated = laws.filter((law) => law.action.includes("₹")).length;

  const licenceRelated = laws.filter(
    (law) =>
      law.category === "Licensing" ||
      law.action.toLowerCase().includes("licence"),
  ).length;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      {/* HEADER */}
      <section className="mb-10">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div>
            <p
              className="text-xs uppercase tracking-[0.25em] mb-3"
              style={{ color: "#818cf8" }}
            >
              CivicSenseAI • Legal Intelligence
            </p>

            <h1
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "Outfit" }}
            >
              Driving <span style={{ color: "#818cf8" }}>Laws</span>
            </h1>

            <p
              className="max-w-3xl text-sm sm:text-base mt-3 leading-7"
              style={{ color: "#94a3b8" }}
            >
              Explore important driver-facing provisions of the Indian Motor
              Vehicles Act, including section numbers, effective dates,
              descriptions and statutory consequences.
            </p>
          </div>

          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: "rgba(129,140,248,.07)",
              border: "1px solid rgba(129,140,248,.15)",
            }}
          >
            <p className="text-xs" style={{ color: "#64748b" }}>
              Legal framework
            </p>

            <p
              className="text-lg font-semibold mt-1"
              style={{ fontFamily: "Outfit" }}
            >
              Motor Vehicles Act, 1988
            </p>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <LawStat
          value={laws.length}
          label="Key Provisions"
          color="#38bdf8"
          icon="§"
        />

        <LawStat
          value={critical}
          label="Critical Provisions"
          color="#ef4444"
          icon="!"
        />

        <LawStat
          value={fineRelated}
          label="Penalty Provisions"
          color="#fbbf24"
          icon="₹"
        />

        <LawStat
          value={licenceRelated}
          label="Licence Related"
          color="#818cf8"
          icon="🪪"
        />
      </section>

      {/* LEGAL NOTICE */}
      <div
        className="rounded-2xl p-4 mb-8 flex gap-3"
        style={{
          background: "rgba(251,191,36,.05)",
          border: "1px solid rgba(251,191,36,.15)",
        }}
      >
        <span className="text-lg">⚖️</span>

        <div>
          <p className="text-sm font-semibold" style={{ color: "#fbbf24" }}>
            Central-law reference
          </p>

          <p className="text-xs mt-1 leading-5" style={{ color: "#94a3b8" }}>
            Penalties shown here are based on the central Motor Vehicles Act.
            State amendments, notifications and local compounding schedules may
            change the amount applicable to a particular challan.
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <section className="mb-7">
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "#64748b" }}
          >
            🔍
          </span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search section, law, penalty, helmet, licence..."
            className="w-full rounded-2xl px-11 py-4 outline-none text-sm"
            style={{
              background: "#0d1627",
              border: "1px solid rgba(56,189,248,.1)",
              color: "#e2e8f0",
            }}
          />
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className="px-4 py-2 rounded-full text-xs whitespace-nowrap cursor-pointer transition-all"
                style={{
                  background: active
                    ? "linear-gradient(135deg,#38bdf8,#818cf8)"
                    : "rgba(255,255,255,.04)",
                  color: active ? "#06101f" : "#94a3b8",
                  border: active ? "none" : "1px solid rgba(148,163,184,.1)",
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      </section>

      {/* RESULTS */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "Outfit" }}>
              Indian Motor Vehicle Provisions
            </h2>

            <p className="text-xs mt-1" style={{ color: "#64748b" }}>
              Showing {filteredLaws.length} of {laws.length} indexed provisions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredLaws.map((law) => {
            const isExpanded = expanded === law.section;
            const severityColor = severityColors[law.severity];

            return (
              <article
                key={law.section}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "#0d1627",
                  border: `1px solid ${severityColor}18`,
                }}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : law.section)}
                  className="w-full text-left p-5 sm:p-6 cursor-pointer"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    {/* SECTION */}
                    <div
                      className="rounded-xl px-4 py-3 min-w-31.25 text-center"
                      style={{
                        background: `${severityColor}0d`,
                        border: `1px solid ${severityColor}18`,
                      }}
                    >
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        SECTION
                      </p>

                      <p
                        className="text-xl font-bold mt-1"
                        style={{
                          color: severityColor,
                          fontFamily: "Outfit",
                        }}
                      >
                        {law.section.replace("Section ", "§ ")}
                      </p>
                    </div>

                    {/* TITLE */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
                          style={{
                            color: severityColor,
                            background: `${severityColor}10`,
                          }}
                        >
                          {law.severity}
                        </span>

                        <span
                          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
                          style={{
                            color: "#818cf8",
                            background: "rgba(129,140,248,.08)",
                          }}
                        >
                          {law.category}
                        </span>
                      </div>

                      <h3
                        className="text-lg sm:text-xl font-semibold"
                        style={{ fontFamily: "Outfit" }}
                      >
                        {law.title}
                      </h3>

                      <p
                        className="text-sm mt-2 line-clamp-2"
                        style={{ color: "#94a3b8" }}
                      >
                        {law.description}
                      </p>
                    </div>

                    {/* ACTION */}
                    <div className="lg:w-67.5">
                      <p
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "#64748b" }}
                      >
                        Fine / Action
                      </p>

                      <p
                        className="text-sm font-medium mt-1"
                        style={{ color: "#e2e8f0" }}
                      >
                        {law.action}
                      </p>
                    </div>

                    <span className="text-xl" style={{ color: "#475569" }}>
                      {isExpanded ? "−" : "+"}
                    </span>
                  </div>
                </button>

                {/* EXPANDED INFORMATION */}
                {isExpanded && (
                  <div
                    className="px-5 sm:px-6 pb-6 pt-1"
                    style={{
                      borderTop: "1px solid rgba(148,163,184,.08)",
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-5">
                      <InfoBox
                        title="Regulation"
                        value={law.regulation}
                        color="#38bdf8"
                      />

                      <InfoBox
                        title="Effective From"
                        value={law.effectiveFrom}
                        color="#818cf8"
                      />

                      <InfoBox
                        title="Category"
                        value={law.category}
                        color="#22c55e"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                      <InfoBox
                        title="Complete Description"
                        value={law.description}
                        color="#38bdf8"
                        large
                      />

                      <InfoBox
                        title="Fine / Legal Action"
                        value={law.action}
                        color="#ef4444"
                        large
                      />
                    </div>

                    <div
                      className="mt-4 rounded-2xl p-5"
                      style={{
                        background: "rgba(56,189,248,.035)",
                        border: "1px solid rgba(56,189,248,.08)",
                      }}
                    >
                      <div className="flex gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{
                            background: "rgba(56,189,248,.1)",
                          }}
                        >
                          💡
                        </div>

                        <div>
                          <p
                            className="text-xs uppercase tracking-wider"
                            style={{ color: "#38bdf8" }}
                          >
                            Everyday Example
                          </p>

                          <p
                            className="text-sm leading-6 mt-1"
                            style={{ color: "#cbd5e1" }}
                          >
                            {law.practicalExample}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {filteredLaws.length === 0 && (
          <div
            className="rounded-2xl p-12 text-center"
            style={{
              background: "#0d1627",
              border: "1px solid rgba(56,189,248,.08)",
            }}
          >
            <div className="text-4xl mb-4">🔎</div>

            <h3
              className="text-xl font-semibold"
              style={{ fontFamily: "Outfit" }}
            >
              No laws found
            </h3>

            <p className="text-sm mt-2" style={{ color: "#64748b" }}>
              Try another section number, keyword or category.
            </p>
          </div>
        )}
      </section>

      {/* FOOTER NOTE */}
      <section className="mt-10 mb-6">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(129,140,248,.035)",
            border: "1px solid rgba(129,140,248,.08)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: "#818cf8" }}
          >
            CivicSenseAI Legal Reference
          </p>

          <p className="text-xs leading-6 mt-2" style={{ color: "#64748b" }}>
            This interface is intended as an educational and informational
            reference. The Motor Vehicles Act, Central Motor Vehicles Rules,
            Motor Vehicles (Driving) Regulations, subsequent amendments,
            Central/State notifications and state-specific provisions should be
            consulted when making legal or compliance decisions.
          </p>
        </div>
      </section>
    </main>
  );
}

function LawStat({
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
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
          style={{
            background: `${color}12`,
            color,
          }}
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

function InfoBox({
  title,
  value,
  color,
  large = false,
}: {
  title: string;
  value: string;
  color: string;
  large?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${large ? "min-h-35" : ""}`}
      style={{
        background: "rgba(255,255,255,.02)",
        border: `1px solid ${color}12`,
      }}
    >
      <p className="text-[10px] uppercase tracking-wider" style={{ color }}>
        {title}
      </p>

      <p className="text-sm leading-6 mt-2" style={{ color: "#cbd5e1" }}>
        {value}
      </p>
    </div>
  );
}
