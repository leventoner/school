import React from 'react';
import { motion } from 'framer-motion';

const icons = [
  '🎓', '📚', '🔬', '💻', '💡', '📈', '🪐', '⚛️', '🧬', '➗', '✖️', '➕', '➖'
];

const formulas = ['E=mc²', 'a²+b²=c²', 'F=ma'];

const getRandomPosition = () => ({
  x: Math.random() * (window.innerWidth - 50),
  y: Math.random() * (window.innerHeight - 50),
});

const BackgroundAnimations: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      {[...icons, ...formulas].map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-white text-3xl"
          initial={{ ...getRandomPosition(), opacity: 0 }}
          animate={{
            ...getRandomPosition(),
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
};

export default BackgroundAnimations;
