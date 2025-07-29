import React from 'react';
import { useAtom } from 'jotai';
import { filteredPostsAtom } from '../store/atoms';
import { PostCard } from './PostCard';
import { Loader2 } from 'lucide-react';
import { getPostIdValue } from '../domain/value-objects/PostId';

interface PostListProps {
  isLoading?: boolean;
  onNoice: (postId: string) => void;
  onComment: (postId: string) => void;
}

export const PostList: React.FC<PostListProps> = ({ isLoading = false, onNoice, onComment }) => {
  const [posts] = useAtom(filteredPostsAtom);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold mb-2">投稿がありません</h3>
        <p className="text-slate-500">最初の投稿を作成してみましょう！</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard
          key={getPostIdValue(post.id)}
          post={post}
          onNoice={onNoice}
          onComment={onComment}
        />
      ))}
    </div>
  );
};