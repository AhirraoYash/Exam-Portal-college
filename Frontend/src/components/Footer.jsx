import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center py-6">
      <p className="text-sm text-gray-500 font-medium tracking-wide">
        © {currentYear} <span className="font-semibold text-indigo-600">EduTestify</span> — Secure Online Examination Portal
      </p>
    </footer>
  );
};

export default Footer;