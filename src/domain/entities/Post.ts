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
  NoiceAmount,
} from "../types";
import {
  isPostIdEqual,
  getPostIdValue,
  generateNewPostId,
} from "../value-objects/PostId";
import { isUserIdEqual, getUserIdValue } from "../value-objects/UserId";
import { getPostTitleValue } from "../value-objects/PostTitle";
import { getPostContentValue } from "../value-objects/PostContent";
import {
  getNoiceAmountValue,
  addNoiceAmount,
  createZeroNoiceAmount,
} from "../value-objects/NoiceAmount";
import {
  type ReviewStatus,
  getReviewStatusValue,
  createPendingReviewStatus,
} from "../value-objects/ReviewStatus";

/**
 * 投稿エンティティの型定義
 */
export interface Post {
  readonly id: PostId;
  readonly title: PostTitle;
  readonly content: PostContent;
  readonly authorId: UserId;
  readonly totalNoiceAmount: NoiceAmount;
  readonly reviewStatus: ReviewStatus;
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
  totalNoiceAmount: NoiceAmount,
  reviewStatus: ReviewStatus,
  createdAt: Date,
  updatedAt: Date,
): Post => {
  return {
    id,
    title,
    content,
    authorId,
    totalNoiceAmount,
    reviewStatus,
    createdAt,
    updatedAt,
  };
};

/**
 * 新しいPostエンティティを生成する
 */
export const createNewPost = (
  title: PostTitle,
  content: PostContent,
  authorId: UserId,
): Post => {
  const now = new Date();
  return createPost(
    generateNewPostId(),
    title,
    content,
    authorId,
    createZeroNoiceAmount(),
    createPendingReviewStatus(),
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
 * 累計いいね数を取得する
 */
export const getPostTotalNoiceAmount = (post: Post): NoiceAmount => {
  return post.totalNoiceAmount;
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
 * いいねを受け取る
 */
export const receivePostNoice = (post: Post, amount: NoiceAmount): Post => {
  return {
    ...post,
    totalNoiceAmount: addNoiceAmount(post.totalNoiceAmount, amount),
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
  return getNoiceAmountValue(post.totalNoiceAmount);
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
