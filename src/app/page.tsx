'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Spline from '@splinetool/react-spline/next';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });
const MotionH1 = dynamic(() => import('framer-motion').then((mod) => mod.motion.h1), { ssr: false });
const MotionP = dynamic(() => import('framer-motion').then((mod) => mod.motion.p), { ssr: false });

export default function Home() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
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

  useEffect(() => {
    const cachedModelState = localStorage.getItem('modelLoaded');
    if (cachedModelState === 'true') {
      setIsModelLoaded(true);
    } else {
      const timer = setTimeout(() => {
        setIsModelLoaded(true);
        localStorage.setItem('modelLoaded', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="bg-black/80 flex flex-col items-center justify-start sm:justify-between w-full min-h-dvh px-4 py-8 md:py-16 relative">
      <MotionDiv
        className="flex flex-col justify-center items-center w-full max-w-4xl mx-auto mt-8 sm:mt-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionH1
          variants={itemVariants}
          className="text-3xl md:text-5xl lg:text-7xl font-bold text-center"
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
            <Button className='mt-4 md:mt-8 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold'>Get Started</Button>
          </Link>
        </MotionDiv>
      </MotionDiv>
      <MotionDiv 
        className="w-full h-[52vh] sm:h-[57vh] md:h-[60vh] lg:h-[70vh] mt-8 sm:mt-0"
        variants={modelVariants}
        initial="hidden"
        animate={isModelLoaded ? "visible" : "hidden"}
      >
        {isModelLoaded && (
          <Spline
            scene="https://prod.spline.design/Y1ofKjfzeWlaMUmU/scene.splinecode"
            className='w-full h-full'
            style={{ clipPath: 'inset(0 0 15% 0)' }}
          />
        )}
      </MotionDiv>
    </div>
  );
}