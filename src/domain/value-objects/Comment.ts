/**
 * コメント値オブジェクト
 * 
 * ビジネスルール:
 * - コメントは1-1000文字
 * - 空文字は許可されない
 * - コメント投稿者IDが必要
 * 
 * 実装方針: interface、typeと関数で実装
 */

import type { UserId } from '../types'
import { getUserIdValue } from './UserId'

/**
 * コメントの型定義
 */
export interface Comment {
  readonly id: string
  readonly content: string
  readonly authorId: UserId
  readonly createdAt: Date
}

/**
 * コメントが有効かどうか判定する
 */
export const isValidComment = (content: string): boolean => {
  return content.length >= 1 && content.length <= 1000
}

/**
 * コメントIDを生成する
 */
export const generateCommentId = (): string => {
  return crypto.randomUUID()
}

/**
 * コメントを作成する
 */
export const createComment = (
  content: string,
  authorId: UserId
): Comment => {
  if (!isValidComment(content)) {
    throw new Error('コメントは1-1000文字である必要があります')
  }

  return {
    id: generateCommentId(),
    content,
    authorId,
    createdAt: new Date()
  }
}

/**
 * コメントIDを取得する
 */
export const getCommentId = (comment: Comment): string => {
  return comment.id
}

/**
 * コメント内容を取得する
 */
export const getCommentContent = (comment: Comment): string => {
  return comment.content
}

/**
 * コメント投稿者IDを取得する
 */
export const getCommentAuthorId = (comment: Comment): UserId => {
  return comment.authorId
}

/**
 * コメント作成日時を取得する
 */
export const getCommentCreatedAt = (comment: Comment): Date => {
  return comment.createdAt
}

/**
 * コメント投稿者IDを文字列として取得する
 */
export const getCommentAuthorIdAsString = (comment: Comment): string => {
  return getUserIdValue(comment.authorId)
}

/**
 * コメントの等価性を判定する（IDで判定）
 */
export const isCommentEqual = (comment1: Comment, comment2: Comment): boolean => {
  return comment1.id === comment2.id
}
