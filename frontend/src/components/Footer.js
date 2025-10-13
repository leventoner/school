import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-12 shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Student Management System. All Rights Reserved.</p>
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-cyan-400 transition-colors duration-300">Home</Link>
          <Link to="/students" className="hover:text-cyan-400 transition-colors duration-300">Students</Link>
          <Link to="/add" className="hover:text-cyan-400 transition-colors duration-300">Add Student</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
