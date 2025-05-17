// src/components/ServiceRequest.jsx
import React, { useState } from "react";
import "./ServiceRequest.css";

const ServiceRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    device: "",
    issue: "",
    preferredDate: "",
    preferredTime: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, we can just log or show an alert.
    console.log("Service Request Submitted:", formData);
    setSubmitted(true);

    // Optionally reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      device: "",
      issue: "",
      preferredDate: "",
      preferredTime: "",
    });
  };

  return (
    <div className="service-request-container">
      <h1>Book a Service Appointment</h1>

      {submitted ? (
        <p className="success-message">
          ✅ Thank you! Your service request has been submitted. We’ll get back
          to you shortly.
        </p>
      ) : (
        <form className="service-request-form" onSubmit={handleSubmit}>
          <label>
            Full Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email Address:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone Number:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Device Type:
            <input
              type="text"
              name="device"
              placeholder="e.g., Laptop, Phone, Console"
              value={formData.device}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Describe the Issue:
            <textarea
              name="issue"
              rows="4"
              value={formData.issue}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Preferred Date:
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
            />
          </label>

          <label>
            Preferred Time:
            <input
              type="time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="submit-button">
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};

export default ServiceRequest;
