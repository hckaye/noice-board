/**
 * 投稿タイトルを表現する値オブジェクト
 * 
 * ビジネスルール:
 * - 1文字以上100文字以下
 * - 不変オブジェクト
 * - 空文字列やnull/undefinedは許可しない
 * 
 * 実装方針: interface、typeと関数で実装
 */

import type { PostTitle, Result } from '../types'
import { validatePostTitle } from '../utils/validators'

// 型を再エクスポート
export type { PostTitle }

/**
 * 定数
 */
export const POST_TITLE_MAX_LENGTH = 100

/**
 * PostTitleを作成する
 */
export const createPostTitle = (value: string): Result<PostTitle> => {
  return validatePostTitle(value)
}

/**
 * PostTitleの値を取得する
 */
export const getPostTitleValue = (postTitle: PostTitle): string => {
  return postTitle as string
}

/**
 * PostTitleの等価性を判定する
 */
export const isPostTitleEqual = (postTitle1: PostTitle, postTitle2: PostTitle): boolean => {
  return getPostTitleValue(postTitle1) === getPostTitleValue(postTitle2)
}

/**
 * PostTitleを文字列として取得する
 */
export const postTitleToString = (postTitle: PostTitle): string => {
  return getPostTitleValue(postTitle)
}

/**
 * PostTitleの長さを取得する
 */
export const getPostTitleLength = (postTitle: PostTitle): number => {
  return getPostTitleValue(postTitle).length
}

/**
 * 安全にPostTitleを作成する（エラーをスローしない）
 */
export const safeCreatePostTitle = (value: unknown): PostTitle | null => {
  const result = validatePostTitle(value)
  return result.success ? result.data : null
}

/**
 * PostTitleを作成する（エラーをスローする版）
 */
export const createPostTitleOrThrow = (value: string): PostTitle => {
  const result = createPostTitle(value)
  if (!result.success) {
    throw new Error(result.error.message)
  }
  return result.data
}
