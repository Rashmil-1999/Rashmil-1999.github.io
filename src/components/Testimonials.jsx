import React from "react";

const Testimonials = (props) => {
  const { testimonials } = props;
  return (
    <div>
      <section className="resume-section" id="testimonials">
        <div className="resume-section-content">
          <h2 className="mb-5">Testimonials</h2>
          {testimonials.map((testimonial, id) => {
            return (
              <blockquote key={id} className="blockquote">
                <p className="mb-0 lead">
                  <em>{testimonial.text}</em>
                </p>
                <footer className="blockquote-footer">
                  <strong><cite title="Source Title">{testimonial.user}</cite></strong>
                </footer>
              </blockquote>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
