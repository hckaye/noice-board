/**
 * 投稿コンテンツを表現する値オブジェクト
 * 
 * ビジネスルール:
 * - 1文字以上1000文字以下
 * - 不変オブジェクト
 * - 空文字列やnull/undefinedは許可しない
 * 
 * 実装方針: interface、typeと関数で実装
 */

import type { PostContent, Result } from '../types'
import { validatePostContent } from '../utils/validators'

// 型を再エクスポート
export type { PostContent }

/**
 * 定数
 */
export const POST_CONTENT_MAX_LENGTH = 1000

/**
 * PostContentを作成する
 */
export const createPostContent = (value: string): Result<PostContent> => {
  return validatePostContent(value)
}

/**
 * PostContentの値を取得する
 */
export const getPostContentValue = (postContent: PostContent): string => {
  return postContent as string
}

/**
 * PostContentの等価性を判定する
 */
export const isPostContentEqual = (postContent1: PostContent, postContent2: PostContent): boolean => {
  return getPostContentValue(postContent1) === getPostContentValue(postContent2)
}

/**
 * PostContentを文字列として取得する
 */
export const postContentToString = (postContent: PostContent): string => {
  return getPostContentValue(postContent)
}

/**
 * PostContentの長さを取得する
 */
export const getPostContentLength = (postContent: PostContent): number => {
  return getPostContentValue(postContent).length
}

/**
 * 安全にPostContentを作成する（エラーをスローしない）
 */
export const safeCreatePostContent = (value: unknown): PostContent | null => {
  const result = validatePostContent(value)
  return result.success ? result.data : null
}

/**
 * PostContentを作成する（エラーをスローする版）
 */
export const createPostContentOrThrow = (value: string): PostContent => {
  const result = createPostContent(value)
  if (!result.success) {
    throw new Error(result.error.message)
  }
  return result.data
}
