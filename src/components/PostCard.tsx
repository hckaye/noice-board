import React from 'react';
import { useAtom } from 'jotai';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, MessageCircle, MoreHorizontal, Clock } from 'lucide-react';
import type { Post } from '../domain/entities/Post';
import { currentUserAtom, usersAtom } from '../store/atoms';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getUserIdValue } from '../domain/value-objects/UserId';
import { getPostIdValue } from '../domain/value-objects/PostId';
import { getPostTitleValue } from '../domain/value-objects/PostTitle';
import { getPostContentValue } from '../domain/value-objects/PostContent';
import { getNoiceAmountValue } from '../domain/value-objects/NoiceAmount';
import { getPostGroupPathValue } from '../domain/value-objects/PostGroupPath';
import { getReviewStatusValue, REVIEW_STATUS_VALUES } from '../domain/value-objects/ReviewStatus';

interface PostCardProps {
  post: Post;
  onNoice: (postId: string) => void;
  onComment: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onNoice, onComment }) => {
  const [currentUser] = useAtom(currentUserAtom);
  const [users] = useAtom(usersAtom);
  const author = users.get(getUserIdValue(post.authorId));

  const totalNoiceAmount = post.noices.reduce((sum, noice) => sum + getNoiceAmountValue(noice.amount), 0);
  const hasUserNoiced = currentUser && post.noices.some(noice => getUserIdValue(noice.fromUserId) === getUserIdValue(currentUser.id));

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={author?.avatarUrl} alt={author?.displayName} />
              <AvatarFallback>{author?.displayName?.slice(0, 2) || 'UN'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{author?.displayName || 'Unknown User'}</p>
              <p className="text-sm text-slate-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ja })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        
        <CardTitle className="text-xl">{getPostTitleValue(post.title)}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {getPostContentValue(post.content)}
        </p>
        
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNoice(getPostIdValue(post.id))}
            className={`transition-all duration-200 ${hasUserNoiced ? 'text-pink-500' : ''}`}
          >
            <Heart className={`w-4 h-4 mr-1 ${hasUserNoiced ? 'fill-current' : ''}`} />
            <span className="font-semibold">{totalNoiceAmount}</span>
            <span className="ml-1">Noice</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComment(getPostIdValue(post.id))}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            <span>{post.comments.length}</span>
            <span className="ml-1">コメント</span>
          </Button>
        </div>
        
        <Badge 
          variant={getReviewStatusValue(post.reviewStatus) === REVIEW_STATUS_VALUES.COMPLETED ? 'default' : 'secondary'}
          className="text-xs"
        >
          {getPostGroupPathValue(post.groupPath).slice(1)}
        </Badge>
      </CardFooter>
    </Card>
  );
};