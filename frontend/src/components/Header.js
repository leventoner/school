import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ currentUser, logOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const activeLinkStyle = {
    color: '#22d3ee',
    borderBottom: '2px solid #22d3ee'
  };

  const handleLinkClick = (path) => {
    console.log(`Navigating to: ${path}`);
    setIsOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div 
          onClick={() => handleLinkClick('/')} 
          className="text-3xl font-black tracking-wider text-cyan-400 cursor-pointer"
        >
          SMS
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-lg">
          <div 
            onClick={() => handleLinkClick('/')}
            className={`py-2 transition-colors duration-300 hover:text-cyan-400 cursor-pointer ${window.location.pathname === '/' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''}`}
          >
            Home
          </div>
          <div 
            onClick={() => handleLinkClick('/students')}
            className={`py-2 transition-colors duration-300 hover:text-cyan-400 cursor-pointer ${window.location.pathname === '/students' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''}`}
          >
            Students
          </div>
          {currentUser && (
            <div 
              onClick={() => handleLinkClick('/add')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-5 rounded-full transition duration-300 cursor-pointer"
            >
              Add Student
            </div>
          )}
          {currentUser ? (
            <div 
              onClick={() => { logOut(); handleLinkClick('/login'); }}
              className="py-2 transition-colors duration-300 hover:text-cyan-400 cursor-pointer"
            >
              Logout
            </div>
          ) : (
            <>
              <div 
                onClick={() => handleLinkClick('/login')}
                className={`py-2 transition-colors duration-300 hover:text-cyan-400 cursor-pointer ${window.location.pathname === '/login' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''}`}
              >
                Login
              </div>
              <div 
                onClick={() => handleLinkClick('/register')}
                className={`py-2 transition-colors duration-300 hover:text-cyan-400 cursor-pointer ${window.location.pathname === '/register' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''}`}
              >
                Sign Up
              </div>
            </>
          )}
        </nav>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-4 space-y-2">
            <div 
              onClick={() => handleLinkClick('/')}
              className={`block py-2 px-4 text-center rounded-md transition-colors duration-300 hover:bg-gray-700 cursor-pointer ${window.location.pathname === '/' ? 'bg-gray-700' : ''}`}
            >
              Home
            </div>
            <div 
              onClick={() => handleLinkClick('/students')}
              className={`block py-2 px-4 text-center rounded-md transition-colors duration-300 hover:bg-gray-700 cursor-pointer ${window.location.pathname === '/students' ? 'bg-gray-700' : ''}`}
            >
              Students
            </div>
            {currentUser && (
              <div 
                onClick={() => handleLinkClick('/add')}
                className="block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-5 rounded-full transition duration-300 w-full text-center cursor-pointer"
              >
                Add Student
              </div>
            )}
            {currentUser ? (
              <div 
                onClick={() => { logOut(); handleLinkClick('/login'); }}
                className="block py-2 px-4 text-center rounded-md transition-colors duration-300 hover:bg-gray-700 cursor-pointer"
              >
                Logout
              </div>
            ) : (
              <>
                <div 
                  onClick={() => handleLinkClick('/login')}
                  className={`block py-2 px-4 text-center rounded-md transition-colors duration-300 hover:bg-gray-700 cursor-pointer ${window.location.pathname === '/login' ? 'bg-gray-700' : ''}`}
                >
                  Login
                </div>
                <div 
                  onClick={() => handleLinkClick('/register')}
                  className={`block py-2 px-4 text-center rounded-md transition-colors duration-300 hover:bg-gray-700 cursor-pointer ${window.location.pathname === '/register' ? 'bg-gray-700' : ''}`}
                >
                  Sign Up
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
