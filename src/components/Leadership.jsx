import React from "react";

const Leadership = (props) => {
  const { leaderships } = props;
  return (
    <div>
      <section className="resume-section" id="leadership">
        <div className="resume-section-content">
          <h2 className="mb-5">Leadership</h2>
          {leaderships.map((committee, id) => {
            return (
              <div
                className={
                  id === leaderships.length - 1
                    ? "d-flex flex-column flex-md-row justify-content-between"
                    : "d-flex flex-column flex-md-row justify-content-between mb-5"
                }
                key={id}
              >
                <div className="flex-grow-1">
                  <h3 className="mb-0">{committee.title}</h3>
                  <div className="subheading mb-3">{committee.org}</div>
                  <p>{committee.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-secondary">{committee.duration}</span>
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

export default Leadership;
