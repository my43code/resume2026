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

function App() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/resume");
        const data = (await response.json()) as ResumeData;
        setResumeData(data);
      } catch (error) {
        console.error("Failed to load resume data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

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

  if (loading || !resumeData) {
    return (
      <div className="page loading-state">
        <div className="loading-card">Loading professional resume…</div>
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
            <img src={resumeData.profilePicture} alt={resumeData.name} className="avatar-image" />
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
          <section className="hero-card">
            <h2>Profile Summary</h2>
            <p>{resumeData.profile}</p>
          </section>

          <section className="content-card">
            <h2>Professional Experience</h2>
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
          </section>

          <section className="content-card">
            <h2>Project</h2>
            <p>
              <strong>{resumeData.project.title}</strong> — {resumeData.project.organization}
              <br />
              {resumeData.project.period}
            </p>
            <p>{resumeData.project.description}</p>
            <p>
              Project Link:{" "}
              <a href={resumeData.project.link} target="_blank" rel="noreferrer">
                {resumeData.project.link}
              </a>
            </p>
          </section>

          <section className="content-card">
            <h2>Education</h2>
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
          </section>

          <section className="content-card">
            <h2>Extracurricular & Additional Learning</h2>
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
          </section>

          <section className="content-card">
            <h2>References</h2>
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
          </section>

          <section className="content-card">
            <h2>Declaration</h2>
            <p>{resumeData.declaration}</p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App; 