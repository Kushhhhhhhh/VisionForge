'use client';

import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Post } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';

const PostCard = lazy(() => import('@/components/PostCard'));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/image');
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownload = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleRemove = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/image`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete post');

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return <Loader2 className='animate-spin mx-auto w-8 h-8' />;
  }

  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='text-white/50 text-center text-lg sm:text-xl'
      >
        No posts available. Please generate an image first.
      </motion.div>
    );
  }

  return (
    <div className='w-full min-h-screen p-4 sm:p-6 md:p-8 pt-20'>
      <motion.div 
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {posts.map((post) => (
            <Suspense key={post.id} fallback={<div>Loading...</div>}>
              <PostCard 
                post={post} 
                onDownload={handleDownload}
                onRemove={handleRemove}
              />
            </Suspense>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}