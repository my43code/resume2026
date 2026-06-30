import "./App.css";
import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type ResumeData = {
  name: string;
  title: string;
  profilePicture: string;
  website: string;
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  profile: string;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    duties: string[];
  }>;
  project: {
    title: string;
    organization: string;
    period: string;
    description: string;
    link: string;
  };
  education: Array<{
    school: string;
    qualification: string;
    period: string;
    details: string;
  }>;
  skills: {
    hard: string[];
    soft: string[];
  };
  certificates: Array<{
    title: string;
    issuer: string;
    year: string;
  }>;
  extracurricular: Array<{
    title: string;
    organization: string;
    period: string;
    notes: string;
  }>;
  otherCertificates: Array<{
    title: string;
    issuer: string;
    period: string;
  }>;
  languages: string[];
  references: Array<{
    name: string;
    title: string;
    phone: string;
    email: string;
  }>;
  declaration: string;
};

const fallbackResumeData: ResumeData = {
  name: "Manu Maso",
  title: "IT Officer | ICT Professional",
  profilePicture: "/profile.JPG",
  website: "https://pngtechco.com",
  contact: {
    address: "Port Moresby, Papua New Guinea",
    phone: "+675 78337236",
    email: "masomaso23@gmail.com",
  },
  profile:
    "Resume content is currently loading. If the server is offline, this polished fallback view will keep the page available while you refresh.",
  experience: [],
  project: {
    title: "Portfolio Project",
    organization: "Self-developed",
    period: "Ongoing",
    description: "A modern professional resume experience built with React and Vite.",
    link: "https://pngtechco.com",
  },
  education: [],
  skills: {
    hard: [],
    soft: [],
  },
  certificates: [],
  extracurricular: [],
  otherCertificates: [],
  languages: ["English", "Pidgin"],
  references: [],
  declaration: "Professional resume information will appear here once the data source is reachable.",
};

function App() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    profile: true,
    experience: true,
    project: true,
    education: true,
    extras: true,
    references: true,
    declaration: true,
  });

  useEffect(() => {
    let active = true;

    const fetchResume = async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 4000);
      let data: ResumeData | null = null;

      try {
        const response = await fetch("/api/resume", { signal: controller.signal });
        if (!response.ok) throw new Error("Resume API request failed");

        data = (await response.json()) as ResumeData;
      } catch (apiError) {
        console.warn("Resume API unavailable, falling back to static JSON", apiError);

        try {
          const response = await fetch("/resume.json", { signal: controller.signal });
          if (!response.ok) throw new Error("Static resume request failed");

          data = (await response.json()) as ResumeData;
        } catch (staticError) {
          console.error("Failed to load fallback resume data", staticError);
        }
      } finally {
        window.clearTimeout(timeoutId);
        if (active) {
          setResumeData(data ?? fallbackResumeData);
          setLoading(false);
        }
      }
    };

    fetchResume();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setImgError(false);
  }, [resumeData?.profilePicture]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const downloadPDF = async () => {
    const input = resumeRef.current;

    if (!input || !resumeData) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${resumeData.name.replace(/\s+/g, "-")}-Resume.pdf`);
  };

  const skillList = useMemo(() => {
    if (!resumeData) return [];
    return [...resumeData.skills.hard, ...resumeData.skills.soft];
  }, [resumeData]);

  const profileInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  if (loading || !resumeData) {
    return (
      <div className="page loading-state">
        <div className="loading-card">
          <div className="loading-ring" />
          <span>Preparing your professional showcase…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="top-bar">
        <div className="pill">Professional Resume</div>
        <button onClick={downloadPDF}>Download PDF</button>
      </div>

      <div className="resume" ref={resumeRef}>
        <aside className="sidebar">
          <div className="avatar-wrap">
            {!imgError ? (
              <img
                src={resumeData.profilePicture || "/profile.JPG"}
                alt={resumeData.name}
                className="avatar-image"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="avatar-fallback">
                <span>{profileInitials(resumeData.name)}</span>
              </div>
            )}
          </div>
          <h1>{resumeData.name}</h1>
          <p className="title">{resumeData.title}</p>

          <div className="info-card">
            <h2>Contact</h2>
            <p>Email: {resumeData.contact.email}</p>
            <p>Phone: {resumeData.contact.phone}</p>
            <p>Location: {resumeData.contact.address}</p>
            <p>
              Website: <a href={resumeData.website} target="_blank" rel="noreferrer">{resumeData.website}</a>
            </p>
          </div>

          <div className="info-card">
            <h2>Core Skills</h2>
            <ul>
              {skillList.length ? (
                skillList.map((skill) => <li key={skill}>{skill}</li>)
              ) : (
                <li>No skills available</li>
              )}
            </ul>
          </div>

          <div className="info-card">
            <h2>Certificates</h2>
            <ul>
              {resumeData.certificates?.length ? (
                resumeData.certificates.map((certificate) => (
                  <li key={`${certificate.title}-${certificate.year}`}>
                    {certificate.title} ({certificate.year})
                  </li>
                ))
              ) : (
                <li>No certificates available</li>
              )}
            </ul>
          </div>

          <div className="info-card">
            <h2>Languages</h2>
            <ul>
              {resumeData.languages?.length ? (
                resumeData.languages.map((language) => <li key={language}>{language}</li>)
              ) : (
                <li>No languages available</li>
              )}
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <section className={`hero-card ${openSections.profile ? "expanded" : ""}`}>
            <button className="section-toggle" type="button" onClick={() => toggleSection("profile")}>
              <h2>Profile Summary</h2>
              <span>{openSections.profile ? "−" : "+"}</span>
            </button>
            {openSections.profile && (
              <div className="section-content">
                <p>{resumeData.profile}</p>
              </div>
            )}
          </section>

          <section className={`content-card ${openSections.experience ? "expanded" : ""}`}>
            <button className="section-toggle" type="button" onClick={() => toggleSection("experience")}>
              <h2>Professional Experience</h2>
              <span>{openSections.experience ? "−" : "+"}</span>
            </button>
            {openSections.experience && (
              <div className="section-content">
                {resumeData.experience?.length ? (
                  resumeData.experience.map((item) => (
                    <div className="experience-item" key={`${item.role}-${item.period}`}>
                      <div className="experience-heading">
                        <h3>{item.role}</h3>
                        <span>{item.period}</span>
                      </div>
                      <p className="company-name">{item.company}</p>
                      <ul>
                        {item.duties?.length ? (
                          item.duties.map((duty) => <li key={duty}>{duty}</li>)
                        ) : (
                          <li>No duties listed</li>
                        )}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p>No experience available</p>
                )}
              </div>
            )}
          </section>

          <section className={`content-card ${openSections.project ? "expanded" : ""}`}>
            <button className="section-toggle" type="button" onClick={() => toggleSection("project")}>
              <h2>Project</h2>
              <span>{openSections.project ? "−" : "+"}</span>
            </button>
            {openSections.project && (
              <div className="section-content">
                <p>
                  <strong>{resumeData.project.title}</strong> — {resumeData.project.organization}
                  <br />
                  {resumeData.project.period}
                </p>
                <p>{resumeData.project.description}</p>
                <p>
                  Project Link: {" "}
                  <a href={resumeData.project.link} target="_blank" rel="noreferrer">
                    {resumeData.project.link}
                  </a>
                </p>
              </div>
            )}
          </section>

          <section className={`content-card ${openSections.education ? "expanded" : ""}`}>
            <button className="section-toggle" type="button" onClick={() => toggleSection("education")}>
              <h2>Education</h2>
              <span>{openSections.education ? "−" : "+"}</span>
            </button>
            {openSections.education && (
              <div className="section-content">
                <ul className="plain-list">
                  {resumeData.education?.length ? (
                    resumeData.education.map((item) => (
                      <li key={`${item.school}-${item.period}`}>
                        <strong>{item.qualification}</strong> — {item.school} ({item.period})
                        <div className="detail-text">{item.details}</div>
                      </li>
                    ))
                  ) : (
                    <li>No education data available</li>
                  )}
                </ul>
              </div>
            )}
          </section>

          <section className={`content-card ${openSections.extras ? "expanded" : ""}`}>
            <button className="section-toggle" type="button" onClick={() => toggleSection("extras")}>
              <h2>Extracurricular & Additional Learning</h2>
              <span>{openSections.extras ? "−" : "+"}</span>
            </button>
            {openSections.extras && (
              <div className="section-content">
                <div className="two-column-list">
                  <div>
                    <h3>Activities</h3>
                    <ul>
                      {resumeData.extracurricular?.length ? (
                        resumeData.extracurricular.map((item) => (
                          <li key={`${item.title}-${item.period}`}>
                            <strong>{item.title}</strong>, {item.organization} ({item.period}) — {item.notes}
                          </li>
                        ))
                      ) : (
                        <li>No extracurricular activities available</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3>Online Certificates</h3>
                    <ul>
                      {resumeData.otherCertificates?.length ? (
                        resumeData.otherCertificates.map((item) => (
                          <li key={`${item.title}-${item.period}`}>
                            {item.title} — {item.issuer} ({item.period})
                          </li>
                        ))
                      ) : (
                        <li>No online certificates available</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className={`content-card ${openSections.references ? "expanded" : ""}`}>
            <button className="section-toggle" type="button" onClick={() => toggleSection("references")}>
              <h2>References</h2>
              <span>{openSections.references ? "−" : "+"}</span>
            </button>
            {openSections.references && (
              <div className="section-content">
                <ul className="reference-list">
                  {resumeData.references?.length ? (
                    resumeData.references.map((reference) => (
                      <li key={reference.name}>
                        <strong>{reference.name}</strong>
                        <div>{reference.title}</div>
                        <div>Phone: {reference.phone}</div>
                        <div>Email: {reference.email}</div>
                      </li>
                    ))
                  ) : (
                    <li>No references available</li>
                  )}
                </ul>
              </div>
            )}
          </section>

          <section className={`content-card ${openSections.declaration ? "expanded" : ""}`}>
            <button className="section-toggle" type="button" onClick={() => toggleSection("declaration")}>
              <h2>Declaration</h2>
              <span>{openSections.declaration ? "−" : "+"}</span>
            </button>
            {openSections.declaration && (
              <div className="section-content">
                <p>{resumeData.declaration}</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;