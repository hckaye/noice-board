/**
 * ユーザー名を表現する値オブジェクト
 *
 * ビジネスルール:
 * - 3文字以上20文字以下
 * - 英数字のみ使用可能
 * - 不変オブジェクト
 * - 空文字列やnull/undefinedは許可しない
 *
 * 実装方針: interface、typeと関数で実装
 */

import type { Username, Result } from "../types";
import { validateUsername } from "../utils/validators";

// 型を再エクスポート
export type { Username };

/**
 * 定数
 */
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

/**
 * Usernameを作成する
 */
export const createUsername = (value: string): Result<Username> => {
  return validateUsername(value);
};

/**
 * Usernameの値を取得する
 */
export const getUsernameValue = (username: Username): string => {
  return username as string;
};

/**
 * Usernameの等価性を判定する
 */
export const isUsernameEqual = (
  username1: Username,
  username2: Username,
): boolean => {
  return getUsernameValue(username1) === getUsernameValue(username2);
};

/**
 * Usernameを文字列として取得する
 */
export const usernameToString = (username: Username): string => {
  return getUsernameValue(username);
};

/**
 * ユーザー名の長さを取得する
 */
export const getUsernameLength = (username: Username): number => {
  return getUsernameValue(username).length;
};

/**
 * 安全にUsernameを作成する（エラーをスローしない）
 */
export const safeCreateUsername = (value: unknown): Username | null => {
  const result = validateUsername(value);
  return result.success ? result.data : null;
};

/**
 * Usernameを作成する（エラーをスローする版）
 */
export const createUsernameOrThrow = (value: string): Username => {
  const result = createUsername(value);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return result.data;
};
