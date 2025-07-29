import React, { useState } from 'react';
import { useAtom } from 'jotai';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { isCreatePostDialogOpenAtom, postGroupsAtom, currentUserAtom } from '../store/atoms';
import { toast } from 'sonner';
import { createPostTitle } from '../domain/value-objects/PostTitle';
import { createPostContent } from '../domain/value-objects/PostContent';
import { createPostGroupPath } from '../domain/value-objects/PostGroupPath';
import { generateNewPostId } from '../domain/value-objects/PostId';
import type { Post } from '../domain/entities/Post';
import type { Hashtag } from '../domain/value-objects/Hashtag';
import { createCompletedReviewStatus } from '../domain/value-objects/ReviewStatus';

interface CreatePostDialogProps {
  onCreatePost: (post: Post) => Promise<void>;
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ onCreatePost }) => {
  const [isOpen, setIsOpen] = useAtom(isCreatePostDialogOpenAtom);
  const [postGroups] = useAtom(postGroupsAtom);
  const [currentUser] = useAtom(currentUserAtom);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('ログインしてください');
      return;
    }

    if (!selectedGroup) {
      toast.error('グループを選択してください');
      return;
    }

    setIsSubmitting(true);
    try {
      const titleResult = createPostTitle(title);
      if (!titleResult.success) {
        toast.error(titleResult.error.message);
        return;
      }

      const contentResult = createPostContent(content);
      if (!contentResult.success) {
        toast.error(contentResult.error.message);
        return;
      }

      const groupPathResult = createPostGroupPath(selectedGroup);
      if (!groupPathResult.success) {
        toast.error(groupPathResult.error.message);
        return;
      }

      const newPost: Post = {
        id: generateNewPostId(),
        title: titleResult.data,
        content: contentResult.data,
        authorId: currentUser.id,
        groupPath: groupPathResult.data,
        hashtags: hashtags as unknown as Hashtag[],
        reviewStatus: createCompletedReviewStatus(),
        reviewComments: [],
        comments: [],
        noices: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await onCreatePost(newPost);
      
      // Reset form
      setTitle('');
      setContent('');
      setSelectedGroup('');
      setHashtags([]);
      setHashtagInput('');
      setIsOpen(false);
      
      toast.success('投稿を作成しました');
    } catch {
      toast.error('投稿の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddHashtag = () => {
    if (hashtagInput && !hashtags.includes(hashtagInput)) {
      const newTag = hashtagInput.startsWith('#') ? hashtagInput : `#${hashtagInput}`;
      setHashtags([...hashtags, newTag]);
      setHashtagInput('');
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>新しい投稿を作成</DialogTitle>
            <DialogDescription>
              あなたの知識や経験を共有しましょう
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                placeholder="わかりやすいタイトルを入力"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                placeholder="投稿の内容を入力"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group">グループ</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup} required>
                <SelectTrigger id="group">
                  <SelectValue placeholder="グループを選択" />
                </SelectTrigger>
                <SelectContent>
                  {postGroups.map((group) => (
                    <SelectItem key={group.name} value={`/${group.name}`}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hashtags">ハッシュタグ</Label>
              <div className="flex gap-2">
                <Input
                  id="hashtags"
                  placeholder="#タグを追加"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHashtag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddHashtag} variant="outline">
                  追加
                </Button>
              </div>
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveHashtag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '投稿中...' : '投稿する'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};