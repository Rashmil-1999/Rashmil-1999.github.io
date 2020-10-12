import React from "react";

const About = (props) => {
  const {
    first_name,
    last_name,
    current_status,
    contact_message,
    email,
    description,
    resume_download,
    social,
  } = props.about;
  return (
    <div>
      <section className="resume-section" id="about">
        <div className="resume-section-content">
          <h1 className="mb-0">
            {first_name}
            <span className="text-primary">{last_name}</span>
          </h1>
          <div className="subheading mb-5">
            <p className="mb-3">{current_status}</p>
            <p className="lead mb-0">{contact_message}</p>
            <a href={"mailto:" + email}>{email}</a>
          </div>
          <p className="lead mb-5">{description}</p>

          <div className="container">
            <div className="row">
              <div className="col"></div>
              <div className="col text-center">
                <div className="social-icons row">
                  {social.map((handle) => {
                    return (
                      <div className="col" key={handle.name}>
                        <a
                          className="social-icon"
                          href={handle.url}
                          key={handle.name}
                        >
                          <i className={handle.className}></i>
                        </a>{" "}
                      </div>
                    );
                  })}
                </div>
                <div className="row">
                  <div className="col">
                    <p>
                      <a
                        href={resume_download}
                        className="btn btn-primary mt-5 text-center"
                        download
                      >
                        <i className="fas fa-download"></i> Resume
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col"></div>
            </div>
          </div>
        </div>
      </section>
      <hr className="m-0" />
    </div>
  );
};

export default About;
