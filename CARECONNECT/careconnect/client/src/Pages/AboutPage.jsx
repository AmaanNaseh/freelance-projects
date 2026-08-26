import React from "react";

const AboutPage = () => {
  return (
    <>
      <div className="m-4 md:m-8 lg:m-12">
        <h1 className="text-center text-2xl font-bold my-4">Developers</h1>
        <ul className="list-disc flex flex-col gap-4">
          <li>Faiza</li>
          <li>Eram Zaffer</li>
        </ul>
        <h1 className="text-center text-2xl font-bold my-4">References</h1>
        <ul className="list-disc flex flex-col gap-4">
          <a
            href="https://www.flaticon.com/free-icons/doctor-patient"
            title="doctor patient icons"
            target="_blank"
            rel="noreferrer"
          >
            <li>Doctor patient icons created by Backwoods - Flaticon</li>
          </a>
          <a
            href="https://www.flaticon.com/free-icons/professions-and-jobs"
            title="professions and jobs icons"
            target="_blank"
            rel="noreferrer"
          >
            <li>
              Professions and jobs icons created by Prosymbols Premium -
              Flaticon
            </li>
          </a>
          <a
            href="https://www.flaticon.com/free-icons/patient"
            title="patient icons"
            target="_blank"
            rel="noreferrer"
          >
            <li> Patient icons created by Freepik - Flaticon</li>
          </a>
          <a
            href="https://pngtree.com/freebackground/health-care-abstract-light-effect-icon-decoration_1591329.html"
            target="_blank"
            rel="noreferrer"
          >
            <li> Background Poster</li>
          </a>
          <a
            href="https://www.flaticon.com/free-icons/monitoring"
            title="monitoring icons"
            target="_blank"
            rel="noreferrer"
          >
            <li> Monitoring icons created by Talha Dogar - Flaticon</li>
          </a>
          <a
            href="https://www.flaticon.com/free-icons/artificial-intelligence"
            title="artificial intelligence icons"
            target="_blank"
            rel="noreferrer"
          >
            <li>
              Artificial intelligence icons created by Design Circle - Flaticon
            </li>
          </a>
          <a
            href="https://www.flaticon.com/free-icons/calendar"
            title="calendar icons"
            target="_blank"
            rel="noreferrer"
          >
            <li>Calendar icons created by Gajah Mada - Flaticon</li>
          </a>
        </ul>
      </div>
    </>
  );
};

export default AboutPage;
