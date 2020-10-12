import React from "react";

const Skills = (props) => {
  const { skills, skill_array } = props;
  return (
    <div>
      <section className="resume-section" id="skills">
        <div className="resume-section-content">
          <h2 className="mb-5">Skills</h2>
          {skill_array.map((skill, id) => {
            const skill_set = skills[skill].map((skill_item, id) => {
              return skill_item.class !== "iconify mr-2" ? (
                <li className="list-inline-item mr-3" key={id}>
                  <i className={skill_item.class}></i>
                  {skill_item.name}
                </li>
              ) : (
                <li className="list-inline-item mr-3" key={id}>
                  <span
                    className={skill_item.class}
                    data-icon={skill_item["data-icon"]}
                    data-inline="false"
                  ></span>
                  {skill_item.name}
                </li>
              );
            });
            return (
              <div key={id}>
                <div className="subheading mb-3">{skill}</div>
                <ul className="dev-icons">{skill_set}</ul>
              </div>
            );
          })}
        </div>
      </section>
      <hr className="m-0" />
    </div>
  );
};

export default Skills;
