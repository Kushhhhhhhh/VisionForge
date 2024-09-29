'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Spline from '@splinetool/react-spline/next';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Vortex } from "@/components/ui/vortex";
import { CoolMode } from '@/components/ui/cool-mode';

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
    <main className="w-full h-screen overflow-hidden">
      <Vortex className="absolute inset-0 w-full h-full">
        <div className="flex flex-col items-center justify-between w-full h-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 lg:py-16 relative">
          <MotionDiv
            className="flex flex-col justify-start items-center w-full max-w-4xl mx-auto mt-4 sm:mt-6 md:mt-8 lg:mt-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <MotionH1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center"
            >
              VisionForge
            </MotionH1>
            <MotionP
              variants={itemVariants}
              className='text-center text-white/50 mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg'
            >
              A cutting-edge platform for free image generation
            </MotionP>
            <MotionDiv variants={itemVariants} className="mt-4 sm:mt-6 md:mt-8 lg:mt-10">
              <Link href="/create">
                <CoolMode>
                  <Button className='px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-sm sm:text-base md:text-lg font-semibold'>Get Started</Button>
                </CoolMode>
              </Link>
            </MotionDiv>
          </MotionDiv>
          <MotionDiv 
            className="w-full h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] flex justify-end items-center mt-6 sm:mt-8 md:mt-10 lg:mt-12"
            variants={modelVariants}
            initial="hidden"
            animate={isModelLoaded ? "visible" : "hidden"}
          >
            {isModelLoaded && (
              <Spline
                scene="https://prod.spline.design/Y1ofKjfzeWlaMUmU/scene.splinecode"
                className='w-full h-full'
                style={{ 
                  clipPath: 'inset(0 0 16% 0)',
                }}
              />
            )}
          </MotionDiv>
        </div>
      </Vortex>
    </main>
  );
}