/**
 * 投稿IDを表現する値オブジェクト
 * 
 * ビジネスルール:
 * - UUID v4形式
 * - 不変オブジェクト
 * - 空文字列やnull/undefinedは許可しない
 * 
 * 実装方針: interface、typeと関数で実装
 */

import type { PostId, Result } from '../types'
import { validatePostId, generatePostId } from '../utils/validators'

// 型を再エクスポート
export type { PostId }

/**
 * PostIdを作成する
 */
export const createPostId = (value: string): Result<PostId> => {
  return validatePostId(value)
}

/**
 * 新しいPostIdを生成する
 */
export const generateNewPostId = (): PostId => {
  return generatePostId()
}

/**
 * PostIdの値を取得する
 */
export const getPostIdValue = (postId: PostId): string => {
  return postId as string
}

/**
 * PostIdの等価性を判定する
 */
export const isPostIdEqual = (postId1: PostId, postId2: PostId): boolean => {
  return getPostIdValue(postId1) === getPostIdValue(postId2)
}

/**
 * PostIdを文字列として取得する
 */
export const postIdToString = (postId: PostId): string => {
  return getPostIdValue(postId)
}

/**
 * 安全にPostIdを作成する（エラーをスローしない）
 */
export const safeCreatePostId = (value: unknown): PostId | null => {
  const result = validatePostId(value)
  return result.success ? result.data : null
}

/**
 * PostIdを作成する（エラーをスローする版）
 */
export const createPostIdOrThrow = (value: string): PostId => {
  const result = createPostId(value)
  if (!result.success) {
    throw new Error(result.error.message)
  }
  return result.data
}
