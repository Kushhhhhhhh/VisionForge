'use client';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-900">
      <motion.div
        className="w-3/4 h-2 bg-gray-700 rounded-full overflow-hidden"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}