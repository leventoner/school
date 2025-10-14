import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg mb-12 text-center">
        <h1 className="text-5xl font-bold text-cyan-400 mb-4">Welcome to the Student Management System</h1>
        <p className="text-gray-300 text-lg">
          Your one-stop solution for managing student information efficiently and effectively.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-cyan-400 mb-3">Our Vision</h2>
          <p className="text-gray-400">
            To provide a seamless and intuitive platform for educators and administrators to track student progress, manage courses, and foster a collaborative learning environment. We believe in the power of technology to transform education.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-cyan-400 mb-3">Featured Courses</h2>
          <p className="text-gray-400">
            We offer a wide range of courses in modern technologies, including Computer Science, Data Analytics, Web Development, and Machine Learning. Our curriculum is designed by industry experts to equip students with the skills they need for the future.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link to="/students" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg">
          View All Students
        </Link>
      </div>
    </div>
  );
};

export default Home;
