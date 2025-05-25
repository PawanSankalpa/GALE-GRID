import React, { useState } from "react";
import "./ContactPage.css";
import NavBar from "../../components/NavBar";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    ContactMethod: "",
    projectType: "",
    requirements: "",
    budget: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Send data to backend or email service (e.g., EmailJS, Formspree, your own API)
    console.log("User submitted:", formData);
    alert("Thanks! We'll get back to you soon.");

    setFormData({
      fullName: "",
      email: "",
      ContactMethod: "",
      projectType: "",
      requirements: "",
      budget: "",
    });
  };

  return (
    <div >
    <NavBar />
    <div className="contact-page">
      <h2>Tell Us What You Need</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="contactMethod"
          placeholder="Contact method: Email/ Whatsapp/ Telegram/ Facebook"
          value={formData.ContactMethod}
          onChange={handleChange}
        />

        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          required
        >
          <option value="">Select Project Type</option>
          <option value="Business Website">Business Website</option>
          <option value="E-commerce Store">E-commerce Store</option>
          <option value="Portfolio Website">Portfolio Website</option>
          <option value="Landing Page">Landing Page</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          name="requirements"
          placeholder="Describe your project requirements here..."
          rows="5"
          value={formData.requirements}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="budget"
          placeholder="Estimated Budget (optional)"
          value={formData.budget}
          onChange={handleChange}
        />

        <button type="submit">Send Project Info</button>
      </form>
    </div>
    </div>
  );
};

export default Contact;
