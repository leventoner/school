import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const activeLinkStyle = {
    color: '#22d3ee',
    borderBottom: '2px solid #22d3ee'
  };

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <NavLink to="/" className="text-3xl font-black tracking-wider text-cyan-400">
          SMS
        </NavLink>
        <nav>
          <ul className="flex items-center space-x-6 text-lg">
            <li>
              <NavLink 
                to="/" 
                className="py-2 transition-colors duration-300 hover:text-cyan-400"
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/students" 
                className="py-2 transition-colors duration-300 hover:text-cyan-400"
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              >
                Students
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/add" 
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-5 rounded-full transition duration-300"
              >
                Add Student
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
