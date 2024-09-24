'use client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BackgroundLines } from "@/components/ui/background-lines";

export default function Home() {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.5,
      },
    },
  };

  return (
    <BackgroundLines className="bg-black/80 flex items-center justify-center w-full min-h-dvh flex-col px-4">
      <motion.div
        className="flex flex-col justify-center items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-bold"
        >
          VisionForge
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className='text-center text-white/50'
        >
          A cutting-edge platform for free image generation
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link href="/create">
            <Button className='mt-5 p-5 font-semibold'>Get Started</Button>
          </Link>
        </motion.div>
      </motion.div>
    </BackgroundLines>
  );
}