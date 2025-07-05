/**
 * 投稿グループ値オブジェクト
 *
 * ビジネスルール:
 * - グループ名は1-50文字の英数字とハイフン、アンダースコアのみ
 * - 先頭と末尾にハイフン、アンダースコアは使用不可
 * - 連続するハイフン、アンダースコアは使用不可
 * - 大文字小文字を区別する
 *
 * 実装方針: interface、typeと関数で実装
 */

import type { Brand, Result } from "../types";

/**
 * 投稿グループ型
 */
export type PostGroup = Brand<string, "PostGroup">;

/**
 * グループ名の最小文字数
 */
const MIN_GROUP_NAME_LENGTH = 1;

/**
 * グループ名の最大文字数
 */
const MAX_GROUP_NAME_LENGTH = 50;

/**
 * グループ名の正規表現パターン
 * 英数字、ハイフン、アンダースコアのみ、先頭末尾は英数字、連続する記号は不可
 */
const GROUP_NAME_PATTERN = /^[a-zA-Z0-9]([a-zA-Z0-9]|[-_](?![_-]))*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;

/**
 * PostGroupを作成する
 */
export const createPostGroup = (value: string): Result<PostGroup> => {
  // 文字列型チェック
  if (typeof value !== "string") {
    return {
      success: false,
      error: {
        message: "グループ名は文字列である必要があります",
        field: "postGroup",
      },
    };
  }

  // 長さチェック
  if (value.length < MIN_GROUP_NAME_LENGTH || value.length > MAX_GROUP_NAME_LENGTH) {
    return {
      success: false,
      error: {
        message: `グループ名は${MIN_GROUP_NAME_LENGTH}-${MAX_GROUP_NAME_LENGTH}文字である必要があります`,
        field: "postGroup",
      },
    };
  }

  // パターンチェック
  if (!GROUP_NAME_PATTERN.test(value)) {
    return {
      success: false,
      error: {
        message: "グループ名は英数字、ハイフン、アンダースコアのみ使用可能で、先頭末尾は英数字、連続する記号は使用できません",
        field: "postGroup",
      },
    };
  }

  return {
    success: true,
    data: value as PostGroup,
  };
};

/**
 * PostGroupの値を取得する
 */
export const getPostGroupValue = (postGroup: PostGroup): string => {
  return postGroup;
};

/**
 * PostGroupの等価性を判定する
 */
export const isPostGroupEqual = (group1: PostGroup, group2: PostGroup): boolean => {
  return group1 === group2;
};

/**
 * PostGroupが有効かどうかを判定する型ガード
 */
export const isPostGroup = (value: unknown): value is PostGroup => {
  if (typeof value !== "string") {
    return false;
  }
  
  const result = createPostGroup(value);
  return result.success;
};

/**
 * デフォルトグループを作成する（一般投稿用）
 */
export const createDefaultPostGroup = (): PostGroup => {
  const result = createPostGroup("general");
  if (!result.success) {
    throw new Error("デフォルトグループの作成に失敗しました");
  }
  return result.data;
};

/**
 * PostGroupを検証する
 */
export const validatePostGroup = (value: unknown): Result<PostGroup> => {
  return createPostGroup(value as string);
};
