import React from "react";
import { Link } from "react-router-dom"; // If you want to link to a Service Request page
import "./OtherServices.css"; // make sure your CSS matches the layout

const OtherServices = () => {
  return (
    <div className="other-services-container">
      {/* Big heading */}
      <h1>Free Estimate & Expert Repairs</h1>

      {/* Introduction */}
      <p>
        We offer a wide range of additional services including PC repair, mobile
        phone repair, console repair, and other electronics. Our expert technicians
        provide <strong>free estimates</strong> and fast, reliable service to get your devices
        working like new.
      </p>

      {/* Service list */}
      <ul className="service-list">
        <li>✅ PC & Laptop Repair</li>
        <li>✅ Mobile Phone Repair</li>
        <li>✅ Game Console Repair</li>
        <li>✅ TV & Home Electronics</li>
        <li>✅ Custom Builds & Upgrades</li>
      </ul>

      {/* Call to Action */}
      <div className="cta-box">
        <p>
          Have a device that needs fixing? Book a <strong>free diagnosis</strong> today and
          let us help you get back up and running!
        </p>
        {/* You can link to a booking page or create a form later */}
        <Link to="/service-request" className="service-request-button">
          Request a Service Appointment
        </Link>
      </div>

      {/* Additional note */}
      <p className="note">
        Walk-ins are always welcome too! Visit us in-store or contact us for more info.
      </p>
    </div>
  );
};

export default OtherServices;
