/**
 * レビューコメント値オブジェクト
 * 
 * ビジネスルール:
 * - レビューコメントは1-500文字
 * - 空文字は許可されない
 * - レビュアーIDが必要
 * 
 * 実装方針: interface、typeと関数で実装
 */

import type { UserId } from '../types'
import { getUserIdValue } from './UserId'

/**
 * レビューコメントの型定義
 */
export interface ReviewComment {
  readonly id: string
  readonly content: string
  readonly reviewerId: UserId
  readonly createdAt: Date
}

/**
 * レビューコメントが有効かどうか判定する
 */
export const isValidReviewComment = (content: string): boolean => {
  return content.length >= 1 && content.length <= 500
}

/**
 * レビューコメントIDを生成する
 */
export const generateReviewCommentId = (): string => {
  return crypto.randomUUID()
}

/**
 * レビューコメントを作成する
 */
export const createReviewComment = (
  content: string,
  reviewerId: UserId
): ReviewComment => {
  if (!isValidReviewComment(content)) {
    throw new Error('レビューコメントは1-500文字である必要があります')
  }

  return {
    id: generateReviewCommentId(),
    content,
    reviewerId,
    createdAt: new Date()
  }
}

/**
 * レビューコメントIDを取得する
 */
export const getReviewCommentId = (comment: ReviewComment): string => {
  return comment.id
}

/**
 * レビューコメント内容を取得する
 */
export const getReviewCommentContent = (comment: ReviewComment): string => {
  return comment.content
}

/**
 * レビュアーIDを取得する
 */
export const getReviewCommentReviewerId = (comment: ReviewComment): UserId => {
  return comment.reviewerId
}

/**
 * レビューコメント作成日時を取得する
 */
export const getReviewCommentCreatedAt = (comment: ReviewComment): Date => {
  return comment.createdAt
}

/**
 * レビュアーIDを文字列として取得する
 */
export const getReviewCommentReviewerIdAsString = (comment: ReviewComment): string => {
  return getUserIdValue(comment.reviewerId)
}

/**
 * レビューコメントの等価性を判定する（IDで判定）
 */
export const isReviewCommentEqual = (comment1: ReviewComment, comment2: ReviewComment): boolean => {
  return comment1.id === comment2.id
}
