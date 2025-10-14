import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define interfaces for props and types used
interface User {
  id: number;
  username: string;
  roles: string[];
}

interface HeaderProps {
  currentUser: User | undefined;
  logOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, logOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Removed activeLinkStyle as it's not directly used in the current implementation
  // const activeLinkStyle = {
  //   color: '#22d3ee',
  //   borderBottom: '2px solid #22d3ee'
  // };

  const handleLinkClick = (path: string) => {
    console.log(`Navigating to: ${path}`);
    setIsOpen(false);
    navigate(path);
  };

  // Helper to determine if a link should be active
  const getLinkClassName = (linkPath: string): string => {
    const baseClasses = "py-2 transition-colors duration-300 hover:text-cyan-400 cursor-pointer";
    if (window.location.pathname === linkPath) {
      return `${baseClasses} text-cyan-400 border-b-2 border-cyan-400`;
    }
    return baseClasses;
  };

  const getMobileLinkClassName = (linkPath: string): string => {
    const baseClasses = "block py-2 px-4 text-center rounded-md transition-colors duration-300 hover:bg-gray-700 cursor-pointer";
    if (window.location.pathname === linkPath) {
      return `${baseClasses} bg-gray-700`;
    }
    return baseClasses;
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
            className={getLinkClassName('/')}
          >
            Home
          </div>
          <div
            onClick={() => handleLinkClick('/students')}
            className={getLinkClassName('/students')}
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
              className={getLinkClassName('/login')} // Reusing getLinkClassName for logout link style
            >
              Logout
            </div>
          ) : (
            <>
              <div
                onClick={() => handleLinkClick('/login')}
                className={getLinkClassName('/login')}
              >
                Login
              </div>
              <div
                onClick={() => handleLinkClick('/register')}
                className={getLinkClassName('/register')}
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
              className={getMobileLinkClassName('/')}
            >
              Home
            </div>
            <div
              onClick={() => handleLinkClick('/students')}
              className={getMobileLinkClassName('/students')}
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
                className={getMobileLinkClassName('/login')} // Reusing getMobileLinkClassName for logout link style
              >
                Logout
              </div>
            ) : (
              <>
                <div
                  onClick={() => handleLinkClick('/login')}
                  className={getMobileLinkClassName('/login')}
                >
                  Login
                </div>
                <div
                  onClick={() => handleLinkClick('/register')}
                  className={getMobileLinkClassName('/register')}
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
