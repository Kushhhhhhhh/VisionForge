import React from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2 } from 'lucide-react';
import { Post } from '@prisma/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: Post;
  onDownload: (url: string) => void;
  onRemove: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDownload, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-[#242424] rounded-lg overflow-hidden shadow-lg"
    >
      <Image
        src={post.url}
        alt={post.prompt}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
        priority
      />
      <div className="p-4">
        <p className="text-white text-sm md:text-md font-thin mb-2 line-clamp-2">{post.prompt}</p>
        <div className="flex justify-between items-center">
          <Button
            onClick={() => onDownload(post.url)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Download size={20} />
          </Button>
          <Button
            onClick={() => onRemove(post.id)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;