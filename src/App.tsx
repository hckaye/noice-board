import { useState } from 'react';
import { Provider } from 'jotai';
import { Layout } from './components/Layout';
import { PostList } from './components/PostList';
import { CreatePostDialog } from './components/CreatePostDialog';
import { useInitializeApp } from './hooks/useInitializeApp';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { postsAtom, currentUserAtom } from './store/atoms';
import { MockNoiceBoardDataStoreApi } from './infrastructure/mock/MockNoiceBoardDataStoreApi';
import type { Post } from './domain/entities/Post';
import type { PostId } from './domain/value-objects/PostId';
import { getPostIdValue } from './domain/value-objects/PostId';

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useAtom(postsAtom);
  const [currentUser] = useAtom(currentUserAtom);
  const api = new MockNoiceBoardDataStoreApi();

  useInitializeApp();

  const handleNoice = async (postId: string) => {
    if (!currentUser) {
      toast.error('ログインしてください');
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.addNoice(
        postId as unknown as PostId,
        currentUser.id
      );

      if (result.success) {
        // Refresh post data
        const postResult = await api.getPost(postId as unknown as PostId);
        if (postResult.success) {
          const updatedPosts = new Map(posts);
          updatedPosts.set(postId, postResult.value);
          setPosts(updatedPosts);
          toast.success('Noice！を送りました');
        }
      } else {
        toast.error(result.error.message || 'エラーが発生しました');
      }
    } catch {
      toast.error('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = () => {
    toast.info('コメント機能は準備中です');
  };

  const handleCreatePost = async (post: Post) => {
    const result = await api.createPost(post);
    if (result.success) {
      const updatedPosts = new Map(posts);
      updatedPosts.set(getPostIdValue(post.id), post);
      setPosts(updatedPosts);
    }
  };

  return (
    <Layout>
      <PostList
        isLoading={isLoading}
        onNoice={handleNoice}
        onComment={handleComment}
      />
      <CreatePostDialog onCreatePost={handleCreatePost} />
      <Toaster position="bottom-right" richColors />
    </Layout>
  );
}

function App() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}

export default App;