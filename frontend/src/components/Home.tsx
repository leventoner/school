import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackgroundAnimations from './BackgroundAnimations';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundAnimations />
      <motion.div
        className="text-white relative z-10 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-gray-800 bg-opacity-75 p-8 rounded-xl shadow-lg mb-12 text-center"
          variants={itemVariants}
        >
        <h1 className="text-5xl font-bold text-cyan-400 mb-4">Welcome to the Student Management System</h1>
        <p className="text-gray-300 text-lg">
          Your one-stop solution for managing student information efficiently and effectively.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-8 mb-12"
        variants={containerVariants}
      >
        <motion.div className="bg-gray-800 bg-opacity-75 p-6 rounded-lg shadow-lg" variants={itemVariants}>
          <h2 className="text-3xl font-semibold text-cyan-400 mb-3">Our Vision</h2>
          <p className="text-gray-400">
            To provide a seamless and intuitive platform for educators and administrators to track student progress, manage courses, and foster a collaborative learning environment. We believe in the power of technology to transform education.
          </p>
        </motion.div>
        <motion.div className="bg-gray-800 bg-opacity-75 p-6 rounded-lg shadow-lg" variants={itemVariants}>
          <h2 className="text-3xl font-semibold text-cyan-400 mb-3">Featured Courses</h2>
          <p className="text-gray-400">
            We offer a wide range of courses in modern technologies, including Computer Science, Data Analytics, Web Development, and Machine Learning. Our curriculum is designed by industry experts to equip students with the skills they need for the future.
          </p>
        </motion.div>
      </motion.div>

      <motion.div className="text-center" variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/students" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg inline-block">
            View All Students
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
    </div>
  );
};

export default Home;
