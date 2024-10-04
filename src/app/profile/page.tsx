'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, Download, Trash2 } from 'lucide-react';
import { Post } from '@prisma/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 10
    }
  }
};

const truncateText = (text: string, limit: number) => 
  text.length <= limit ? text : `${text.slice(0, limit)}...`;

interface PostCardProps {
  post: Post;
  onDownload: (url: string) => void;
  onRemove: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = React.memo(({ post, onDownload, onRemove }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={itemVariants}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-[#212121] text-white/80 rounded-lg p-4 sm:p-6 flex flex-col shadow-lg">
        <CardContainer className="w-full mb-4">
          <CardBody className="w-full aspect-square">
            <CardItem translateZ="100" className="w-full h-full relative">
              <Image
                src={post.url}
                alt={post.prompt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-xl group-hover/card:shadow-xl object-cover"
                loading="lazy"
              />
            </CardItem>
          </CardBody>
        </CardContainer>
        <div className="mb-4 flex-grow">
          <h2 className="text-sm sm:text-base">{truncateText(post.prompt, 100)}</h2>
        </div>
        <div className="flex justify-between space-x-2">
          <Button
            onClick={() => onDownload(post.url)}
            className="flex-1 flex items-center justify-center text-blue-500 text-xs sm:text-sm p-2"
          >
            <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            Download
          </Button>
          <Button
            onClick={() => onRemove(post.id)}
            className="flex-1 flex items-center justify-center text-red-500 text-xs sm:text-sm p-2"
          >
            <Trash2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            Remove
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

PostCard.displayName = 'PostCard';

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/image');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
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
    return <Loader2 className="animate-spin mx-auto w-8 h-8" />;
  }

  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-white/50 text-center text-lg sm:text-xl"
      >
        No posts available. Please generate an image first.
      </motion.div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 pt-20">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onDownload={handleDownload}
              onRemove={handleRemove}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}