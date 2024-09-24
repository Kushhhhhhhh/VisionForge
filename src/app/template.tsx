'use client';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {

    const path = usePathname();

    return <motion.div 
    key={path}
    initial={{ opacity: 0, scale:0.9, filter:'blur(10px)' }} 
    animate={{ opacity: 1, scale:1, filter:'blur(0px)' }} 
    transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}>
        {children}
    </motion.div>
  }