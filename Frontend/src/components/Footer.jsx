import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center mt-6">
      <p className="text-sm text-gray-600 font-medium tracking-wide">
        © {currentYear} || Designed and Developed by <span className="font-semibold">INCRONIX TECHNOLOGY Pvt. Ltd. & MCA-ICEM</span> 
      </p>
    </footer>
  );
};

export default Footer;