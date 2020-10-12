import React from "react";

const Work = (props) => {
  const jobs = props.work;
  return (
    <div>
      <section className="resume-section" id="experience">
        <div className="resume-section-content">
          <h2 className="mb-5">Experience</h2>
          {jobs.map((job, id) => {
            return (
              <div
                className={
                  id === jobs.length - 1
                    ? "d-flex flex-column flex-md-row justify-content-between"
                    : "d-flex flex-column flex-md-row justify-content-between mb-5"
                }
                key={id}
              >
                <div className="flex-grow-1">
                  <h3 className="mb-0">{job.title}</h3>
                  <div className="subheading mb-3">{job.company}</div>
                  <p>{job.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-secondary">{job.duration}</span>
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

export default Work;
