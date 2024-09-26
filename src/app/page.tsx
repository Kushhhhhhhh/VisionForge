'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Spline from '@splinetool/react-spline/next';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });
const MotionH1 = dynamic(() => import('framer-motion').then((mod) => mod.motion.h1), { ssr: false });
const MotionP = dynamic(() => import('framer-motion').then((mod) => mod.motion.p), { ssr: false });

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

  const modelVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
        duration: 1,
      },
    },
  };

  return (
    <div className="bg-black/80 flex flex-col items-center justify-between w-full min-h-dvh px-4 py-8 md:py-16 relative">
      <MotionDiv
        className="flex flex-col justify-center items-center w-full max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionH1
          variants={itemVariants}
          className="text-3xl md:text-4xl lg:text-6xl font-bold text-center"
        >
          VisionForge
        </MotionH1>
        <MotionP
          variants={itemVariants}
          className='text-center text-white/50 mt-2 md:mt-4 text-sm md:text-base lg:text-lg'
        >
          A cutting-edge platform for free image generation
        </MotionP>
        <MotionDiv variants={itemVariants}>
          <Link href="/create">
            <Button variant="outline" className='mt-4 md:mt-8 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold'>Get Started</Button>
          </Link>
        </MotionDiv>
      </MotionDiv>
      <MotionDiv 
        className="absolute bottom-0 left-0 right-0 w-full h-[50vh] md:h-[60vh] lg:h-[70vh]"
        variants={modelVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Spline
          scene="https://prod.spline.design/Y1ofKjfzeWlaMUmU/scene.splinecode"
          className='w-full h-full'
          style={{ clipPath: 'inset(0 0 15% 0)' }}
        />
      </MotionDiv>
    </div>
  );
}