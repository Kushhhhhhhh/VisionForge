'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, Download, Trash2 } from 'lucide-react';
import { Post } from '@prisma/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Lens } from '@/components/ui/lens';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hovering, setHovering] = useState<string | null>(null);

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

  return (
    <div className='w-full min-h-dvh flex justify-center items-center p-6 pt-[72px]'>
      {loading ? (
        <Loader2 className='animate-spin' />
      ) : posts.length === 0 ? (
        <div className='text-white/50'>
          No posts available. Please generate an image first.
        </div>
      ) : (
        <div className='w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeInOut', delay: index * 0.05 }}
                className='bg-[#212121] text-white/80 shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform duration-500 ease-in-out p-4'
              >
                <Lens
                  hovering={hovering === post.id}
                  setHovering={(hover) => setHovering(hover ? post.id : null)}
                >
                  <Image
                    src={post.url}
                    alt={post.prompt}
                    width={200}
                    height={200}
                    className='w-full object-cover mb-3'
                    loading="lazy"
                  />
                </Lens>
                <motion.div
                  animate={{
                    filter: hovering === post.id ? 'blur(2px)' : 'blur(0px)',
                  }}
                  className='p-3'
                >
                  <h2 className='text-lg'>{post.prompt}</h2>
                  <div className='flex justify-between mt-2'>
                    <Button
                      onClick={() => handleDownload(post.url)}
                      className='flex items-center text-blue-500'
                    >
                      <Download className='mr-1 h-4 w-4' />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleRemove(post.id)}
                      className='flex items-center text-red-500'
                    >
                      <Trash2 className='mr-1 h-4 w-4' />
                      Remove
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}