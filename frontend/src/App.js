import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Skills from "./components/Skills";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/resume")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="container">
      <Header data={data} />
      <div className="grid">
        <div className="left">
          <Profile profile={data.profile} />
          <Experience experience={data.experience} />
        </div>
        <div className="right">
          <Education education={data.education} />
          <Skills skills={data.skills} />
        </div>
      </div>
    </div>
  );
}

export default App;