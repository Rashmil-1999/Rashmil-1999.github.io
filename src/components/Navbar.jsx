import React from "react";
import { Link, animateScroll as scroll } from "react-scroll";

import profilepic from "../assets/profilepic.jpg";

const SideNav = (props) => {
  const { sections, links, name } = props;
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top"
      id="sideNav"
    >
      <a className="navbar-brand js-scroll-trigger" href="#page-top">
        <span className="d-block d-lg-none">{name}</span>
        <span className="d-none d-lg-block">
          <img
            className="img-fluid img-profile rounded-circle mx-auto mb-2 profile-pic"
            src={profilepic}
            alt="Profile Pic"
          />
        </span>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          {sections.map((section, id) => {
            return (
              <li className="nav-item" key={id}>
                <a className="nav-link js-scroll-trigger" href={links[id]}>
                  {section}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default SideNav;
