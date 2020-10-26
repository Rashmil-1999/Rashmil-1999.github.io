import React from "react";
// Import images from assets
import archive from "../assets/archive.jpeg";
import emotion from "../assets/emotion.png";
import event from "../assets/event.png";
// import eyantra from "../assets/eyantra.png";
import eyantra from "../assets/eyantra.jpg";
import face_detection from "../assets/face_detection.png";
import garduino from "../assets/smgarden.png";
import library from "../assets/attendance1.png";
import resume from "../assets/resume.png";
import asl from "../assets/asl.png";
import SIH from "../assets/SIH.png";
import aowe from "../assets/aowe.jpg";
import chatbot from "../assets/chatbot.png";
import ner from "../assets/ner.png";

const Projects = (props) => {
  const image_style = {
    maxHeight: "200px",
    maxWidth: "200px",
  };
  const image_map = {
    face_detection: face_detection,
    emotion_recognition: emotion,
    library: library,
    eyantra: eyantra,
    archive: archive,
    garduino: garduino,
    resume: resume,
    event: event,
    aowe: aowe,
    asl: asl,
    SIH: SIH,
    chatbot: chatbot,
    ner: ner,
  };
  const { projects } = props;
  return (
    <div>
      <section className="resume-section" id="projects">
        <div className="resume-section-content">
          <h2 className="mb-5">Projects</h2>
          {projects.map((project, id) => {
            return (
              <div key={id} className="card bg-light border border-light mb-3">
                <div className="row ">
                  <div className="col-md-4 text-center">
                    <img
                      src={image_map[project.image]}
                      alt="Project Icon"
                      style={image_style}
                      className="card-img mt-5"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h3 className="card-title">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.title}
                        </a>
                      </h3>
                      <p className="card-text">{project.description}</p>
                      <h4 className="card-title">Tech Stack:</h4>
                      {project.tech_stack.map((tech, id) => {
                        return (
                          <button
                            key={id}
                            type="button"
                            className="btn btn-secondary mr-2 mb-2"
                            disabled
                          >
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <hr className="m-0" />
    </div>
  );
};

export default Projects;
