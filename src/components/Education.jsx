import React from "react";

const Education = (props) => {
  const schools = props.education;
  return (
    <div>
      <section className="resume-section" id="education">
        <div className="resume-section-content">
          <h2 className="mb-5">Education</h2>
          {schools.map((school, id) => {
            return (
              <div
                className={
                  id === schools.length - 1
                    ? "d-flex flex-column flex-md-row justify-content-between"
                    : "d-flex flex-column flex-md-row justify-content-between mb-5"
                }
                key={id}
              >
                <div className="flex-grow-1">
                  <h3 className="mb-0">{school.name}</h3>
                  <div className="subheading mb-3">{school.degree}</div>
                  <p>{school.score}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-secondary">{school.graduated}</span>
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

export default Education;
