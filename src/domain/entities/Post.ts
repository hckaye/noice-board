/**
 * 投稿エンティティ
 *
 * ビジネスルール:
 * - 累計いいね数は常に0以上
 * - 投稿者IDは変更不可（不変）
 * - 作成日時は変更不可（不変）
 * - 編集時は更新日時が自動更新される
 *
 * 実装方針: interface、typeと関数で実装
 */

import type {
  PostId,
  UserId,
  PostTitle,
  PostContent,
  HashtagList,
} from "../types";
import type { PostGroupPath } from "../value-objects/PostGroupPath";
import {
  isPostIdEqual,
  getPostIdValue,
  generateNewPostId,
} from "../value-objects/PostId";
import { isUserIdEqual, getUserIdValue } from "../value-objects/UserId";
import { getPostTitleValue } from "../value-objects/PostTitle";
import { getPostContentValue } from "../value-objects/PostContent";
import {
  type ReviewStatus,
  getReviewStatusValue,
  createPendingReviewStatus,
} from "../value-objects/ReviewStatus";
import {
  type ReviewComment,
  createReviewComment,
} from "../value-objects/ReviewComment";
import {
  type Comment,
  createComment,
} from "../value-objects/Comment";
import {
  type Noice,
  getNoiceTotalAmount,
} from "./Noice";
import {
  createEmptyHashtagList,
  getHashtagListAsStringArray,
  addHashtagToList,
  removeHashtagFromList,
  hasHashtagInList,
  getHashtagListCount,
} from "../value-objects/Hashtag";

/**
 * 投稿エンティティの型定義
 */
export interface Post {
  readonly id: PostId;
  readonly title: PostTitle;
  readonly content: PostContent;
  readonly authorId: UserId;
  readonly groupPath: PostGroupPath;
  readonly hashtags: HashtagList;
  readonly reviewStatus: ReviewStatus;
  readonly reviewComments: readonly ReviewComment[];
  readonly comments: readonly Comment[];
  readonly noices: readonly Noice[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Postエンティティを作成する
 */
export const createPost = (
  id: PostId,
  title: PostTitle,
  content: PostContent,
  authorId: UserId,
  groupPath: PostGroupPath,
  hashtags: HashtagList,
  reviewStatus: ReviewStatus,
  reviewComments: readonly ReviewComment[],
  comments: readonly Comment[],
  noices: readonly Noice[],
  createdAt: Date,
  updatedAt: Date,
): Post => {
  return {
    id,
    title,
    content,
    authorId,
    groupPath,
    hashtags,
    reviewStatus,
    reviewComments,
    comments,
    noices,
    createdAt,
    updatedAt,
  };
};

/**
 * 新しいPostエンティティを生成する
 */
import { createDefaultPostGroupPath } from "../value-objects/PostGroupPath";

export const createNewPost = (
  title: PostTitle,
  content: PostContent,
  authorId: UserId,
  groupPath?: PostGroupPath,
  hashtags?: HashtagList,
): Post => {
  const now = new Date();
  return createPost(
    generateNewPostId(),
    title,
    content,
    authorId,
    groupPath ?? createDefaultPostGroupPath(),
    hashtags ?? createEmptyHashtagList(),
    createPendingReviewStatus(),
    [],
    [],
    [],
    now,
    now,
  );
};

/**
 * 投稿IDを取得する
 */
export const getPostId = (post: Post): PostId => {
  return post.id;
};

/**
 * タイトルを取得する
 */
export const getPostTitle = (post: Post): PostTitle => {
  return post.title;
};

/**
 * 本文を取得する
 */
export const getPostContent = (post: Post): PostContent => {
  return post.content;
};

/**
 * 投稿者IDを取得する
 */
export const getPostAuthorId = (post: Post): UserId => {
  return post.authorId;
};

/**
 * 累計いいね数を取得する（Noiceに付いたいいねも含めて再帰的に計算）
 */
export const getPostTotalNoiceAmount = (post: Post): number => {
  return post.noices.reduce((total, noice) => {
    return total + getNoiceTotalAmount(noice);
  }, 0);
};

/**
 * 作成日時を取得する
 */
export const getPostCreatedAt = (post: Post): Date => {
  return post.createdAt;
};

/**
 * 更新日時を取得する
 */
export const getPostUpdatedAt = (post: Post): Date => {
  return post.updatedAt;
};

/**
 * タイトルを更新する
 */
export const updatePostTitle = (post: Post, newTitle: PostTitle): Post => {
  return {
    ...post,
    title: newTitle,
    updatedAt: new Date(),
  };
};

/**
 * 本文を更新する
 */
export const updatePostContent = (
  post: Post,
  newContent: PostContent,
): Post => {
  return {
    ...post,
    content: newContent,
    updatedAt: new Date(),
  };
};

/**
 * 投稿を更新する（タイトルと本文を同時に更新）
 */
export const updatePost = (
  post: Post,
  newTitle: PostTitle,
  newContent: PostContent,
): Post => {
  return {
    ...post,
    title: newTitle,
    content: newContent,
    updatedAt: new Date(),
  };
};

/**
 * いいねを追加する
 */

/**
 * いいねを追加する（純粋関数）
 */
export const addNoiceToPost = (
  post: Post,
  noice: Noice,
): Post => {
  return {
    ...post,
    noices: [...post.noices, noice],
  };
};

/**
 * 指定されたユーザーが投稿者かどうか判定する
 */
export const isPostAuthor = (post: Post, userId: UserId): boolean => {
  return isUserIdEqual(post.authorId, userId);
};

/**
 * 投稿の等価性を判定する（IDで判定）
 */
export const isPostEqual = (post1: Post, post2: Post): boolean => {
  return isPostIdEqual(post1.id, post2.id);
};

/**
 * 投稿のIDを文字列として取得する
 */
export const getPostIdAsString = (post: Post): string => {
  return getPostIdValue(post.id);
};

/**
 * 投稿の投稿者IDを文字列として取得する
 */
export const getPostAuthorIdAsString = (post: Post): string => {
  return getUserIdValue(post.authorId);
};

/**
 * 投稿のタイトルを文字列として取得する
 */
export const getPostTitleAsString = (post: Post): string => {
  return getPostTitleValue(post.title);
};

/**
 * 投稿の本文を文字列として取得する
 */
export const getPostContentAsString = (post: Post): string => {
  return getPostContentValue(post.content);
};

/**
 * 投稿の累計いいね数を数値として取得する
 */
export const getPostTotalNoiceAmountAsNumber = (post: Post): number => {
  return getPostTotalNoiceAmount(post);
};

/**
 * レビューステータスを取得する
 */
export const getPostReviewStatus = (post: Post): ReviewStatus => {
  return post.reviewStatus;
};

/**
 * レビューステータスを文字列として取得する
 */
export const getPostReviewStatusAsString = (post: Post): string => {
  return getReviewStatusValue(post.reviewStatus);
};

/**
 * レビューステータスを更新する
 */
export const updatePostReviewStatus = (
  post: Post,
  newReviewStatus: ReviewStatus,
): Post => {
  return {
    ...post,
    reviewStatus: newReviewStatus,
    updatedAt: new Date(),
  };
};

/**
 * レビューコメントを取得する
 */
export const getPostReviewComments = (post: Post): readonly ReviewComment[] => {
  return post.reviewComments;
};

/**
 * レビューコメントを追加する
 */
export const addReviewCommentToPost = (
  post: Post,
  content: string,
  reviewerId: UserId,
): Post => {
  const newComment = createReviewComment(content, reviewerId);
  return {
    ...post,
    reviewComments: [...post.reviewComments, newComment],
    updatedAt: new Date(),
  };
};

/**
 * レビューコメント数を取得する
 */
export const getPostReviewCommentCount = (post: Post): number => {
  return post.reviewComments.length;
};

/**
 * 指定されたレビュアーのコメントを取得する
 */
export const getPostReviewCommentsByReviewer = (
  post: Post,
  reviewerId: UserId,
): readonly ReviewComment[] => {
  return post.reviewComments.filter(comment => 
    isUserIdEqual(comment.reviewerId, reviewerId)
  );
};

/**
 * コメントを取得する
 */
export const getPostComments = (post: Post): readonly Comment[] => {
  return post.comments;
};

/**
 * コメントを追加する
 */
export const addCommentToPost = (
  post: Post,
  content: string,
  authorId: UserId,
): Post => {
  const newComment = createComment(content, authorId);
  return {
    ...post,
    comments: [...post.comments, newComment],
    updatedAt: new Date(),
  };
};

/**
 * コメント数を取得する
 */
export const getPostCommentCount = (post: Post): number => {
  return post.comments.length;
};

/**
 * 指定されたユーザーのコメントを取得する
 */
export const getPostCommentsByUser = (
  post: Post,
  userId: UserId,
): readonly Comment[] => {
  return post.comments.filter(comment => 
    isUserIdEqual(comment.authorId, userId)
  );
};

/**
 * いいね一覧を取得する
 */
export const getPostNoices = (post: Post): readonly Noice[] => {
  return post.noices;
};

/**
 * いいね数を取得する
 */
export const getPostNoiceCount = (post: Post): number => {
  return post.noices.length;
};

/**
 * 指定されたユーザーのいいねを取得する
 */
export const getPostNoicesByUser = (
  post: Post,
  userId: UserId,
): readonly Noice[] => {
  return post.noices.filter(noice => 
    isUserIdEqual(noice.fromUserId, userId)
  );
};


/**
 * ハッシュタグを文字列配列として取得する
 */
export const getPostHashtagsAsStringArray = (post: Post): string[] => {
  return getHashtagListAsStringArray(post.hashtags);
};

/**
 * ハッシュタグ数を取得する
 */
export const getPostHashtagCount = (post: Post): number => {
  return getHashtagListCount(post.hashtags);
};

/**
 * 指定されたハッシュタグが含まれているかチェックする
 */
export const hasPostHashtag = (post: Post, hashtag: string): boolean => {
  return hasHashtagInList(post.hashtags, hashtag);
};

/**
 * ハッシュタグを追加する
 */
export const addHashtagToPost = (post: Post, hashtag: string): Post => {
  const updatedHashtags = addHashtagToList(post.hashtags, hashtag);
  return {
    ...post,
    hashtags: updatedHashtags,
    updatedAt: new Date(),
  };
};

/**
 * ハッシュタグを削除する
 */
export const removeHashtagFromPost = (post: Post, hashtag: string): Post => {
  const updatedHashtags = removeHashtagFromList(post.hashtags, hashtag);
  return {
    ...post,
    hashtags: updatedHashtags,
    updatedAt: new Date(),
  };
};

/**
 * ハッシュタグを更新する
 */
export const updatePostHashtags = (post: Post, hashtags: HashtagList): Post => {
  return {
    ...post,
    hashtags,
    updatedAt: new Date(),
  };
};
