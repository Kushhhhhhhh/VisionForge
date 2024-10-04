'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, Download, Trash2 } from 'lucide-react';
import { Post } from '@prisma/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/image');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]);
        console.error('Error: fetched data is not an array');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownload = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  const handleRemove = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const PostCard = ({ post }: { post: Post }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={itemVariants}
      >
        <CardContainer className="inter-var w-full">
          <CardBody className="bg-[#212121] text-white/80 shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform duration-500 ease-in-out p-4 flex flex-col h-[400px]">
            <CardItem
              translateZ="100"
              className="w-full aspect-square mb-4 flex-shrink-0"
            >
              <Image
                src={post.url}
                alt={post.prompt}
                layout="responsive"
                width={200}
                height={200}
                className='object-cover rounded-md'
                loading="lazy"
              />
            </CardItem>
            <CardItem
              translateZ="50"
              className="w-full mb-3 flex-grow overflow-y-auto"
            >
              <h2 className='text-sm font-thin'>{truncateText(post.prompt, 40)}</h2>
            </CardItem>
            <CardItem
              translateZ="75"
              className="w-full flex justify-between space-x-2 mt-auto"
            >
              <Button
                onClick={() => handleDownload(post.url)}
                className='flex-1 flex items-center justify-center text-blue-500 text-sm py-2'
              >
                <Download className='mr-1 h-4 w-4' />
                Download
              </Button>
              <Button
                onClick={() => handleRemove(post.id)}
                className='flex-1 flex items-center justify-center text-red-500 text-sm py-2'
              >
                <Trash2 className='mr-1 h-4 w-4' />
                Remove
              </Button>
            </CardItem>
          </CardBody>
        </CardContainer>
      </motion.div>
    );
  };

  return (
    <div className='w-full min-h-screen flex justify-center items-start p-4 sm:p-6 pt-20 sm:pt-24'>
      {loading ? (
        <Loader2 className='animate-spin' />
      ) : posts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-white/50'
        >
          No posts available. Please generate an image first.
        </motion.div>
      ) : (
        <motion.div 
          className='w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}