import React from "react";

// CSS
import "./App.css";

// components import
import SideNav from "./components/Navbar";
import About from "./components/About";
import Education from "./components/Education";
import Work from "./components/Work";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Leaderships from "./components/Leadership";
import Testimonials from "./components/Testimonials";

// data import
import resume from "./resumeData.json";

function App() {
  const {
    sections,
    links,
    about,
    resumeData,
    projects,
    testimonials,
    leaderships,
  } = resume;
  return (
    <div>
      {/* <!-- Navigation --> */}
      <SideNav
        sections={sections}
        links={links}
        name={about.first_name + " " + about.last_name}
      />
      {/* <!-- Page Content --> */}
      <div className="container-fluid p-0">
        {/* <!-- About --> */}
        <About about={about} />
        {/* <!-- Education --> */}
        <Education education={resumeData.education} />
        {/* <!-- Experience --> */}
        <Work work={resumeData.work} />
        {/* <!-- Skills --> */}
        <Skills
          skills={resumeData.skills}
          skill_array={resumeData.skill_array}
        />
        {/* <!-- Projects --> */}
        <Projects projects={projects} />
        {/* <!-- Leaderships --> */}
        <Leaderships leaderships={leaderships} />
        {/* <!-- Testimonials --> */}
        <Testimonials testimonials={testimonials} />
      </div>
    </div>
  );
}

export default App;
