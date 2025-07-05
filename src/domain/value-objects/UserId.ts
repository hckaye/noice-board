/**
 * ユーザーIDを表現する値オブジェクト
 * 
 * ビジネスルール:
 * - UUID v4形式
 * - 不変オブジェクト
 * - 空文字列やnull/undefinedは許可しない
 * 
 * 実装方針: interface、typeと関数で実装
 */

import type { UserId, Result } from '../types'
import { validateUserId, generateUserId } from '../utils/validators'

// 型を再エクスポート
export type { UserId }

/**
 * UserIdを作成する
 */
export const createUserId = (value: string): Result<UserId> => {
  return validateUserId(value)
}

/**
 * 新しいUserIdを生成する
 */
export const generateNewUserId = (): UserId => {
  return generateUserId()
}

/**
 * UserIdの値を取得する
 */
export const getUserIdValue = (userId: UserId): string => {
  return userId as string
}

/**
 * UserIdの等価性を判定する
 */
export const isUserIdEqual = (userId1: UserId, userId2: UserId): boolean => {
  return getUserIdValue(userId1) === getUserIdValue(userId2)
}

/**
 * UserIdを文字列として取得する
 */
export const userIdToString = (userId: UserId): string => {
  return getUserIdValue(userId)
}

/**
 * 安全にUserIdを作成する（エラーをスローしない）
 */
export const safeCreateUserId = (value: unknown): UserId | null => {
  const result = validateUserId(value)
  return result.success ? result.data : null
}

/**
 * UserIdを作成する（エラーをスローする版）
 */
export const createUserIdOrThrow = (value: string): UserId => {
  const result = createUserId(value)
  if (!result.success) {
    throw new Error(result.error.message)
  }
  return result.data
}
