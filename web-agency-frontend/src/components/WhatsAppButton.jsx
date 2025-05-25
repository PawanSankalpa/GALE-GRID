import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './styles/WhatsAppButton.css';

const WhatsAppButton = () => {
  const phoneNumber = '94776868537'; 
  const message = "Hi! I'm interested in your web design services. Could you help me?"; // Optional default message

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={30} color="#25D366" />
    </a>
  );
};

export default WhatsAppButton;
