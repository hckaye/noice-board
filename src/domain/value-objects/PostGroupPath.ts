/**
 * 投稿グループパス値オブジェクト
 *
 * ビジネスルール:
 * - スラッシュ区切りでグループ階層を表現（例: "parent/child/grandchild"）
 * - 各セグメントはPostGroupのルールに従う
 * - 1階層以上必須
 * - 先頭・末尾にスラッシュ不可
 * - 連続スラッシュ不可
 *
 * 実装方針: interface、typeと関数で実装
 */

import type { Brand, Result } from "../types";
import { createPostGroup } from "./PostGroup";

/**
 * 投稿グループパス型
 */
export type PostGroupPath = Brand<string, "PostGroupPath">;

/**
 * PostGroupPathを作成する
 */
export const createPostGroupPath = (value: string): Result<PostGroupPath> => {
  if (typeof value !== "string") {
    return {
      success: false,
      error: {
        message: "グループパスは文字列である必要があります",
        field: "postGroupPath",
      },
    };
  }

  if (value.length === 0) {
    return {
      success: false,
      error: {
        message: "グループパスは1文字以上必要です",
        field: "postGroupPath",
      },
    };
  }

  if (value.startsWith("/") || value.endsWith("/")) {
    return {
      success: false,
      error: {
        message: "グループパスの先頭・末尾にスラッシュは使用できません",
        field: "postGroupPath",
      },
    };
  }

  if (value.includes("//")) {
    return {
      success: false,
      error: {
        message: "グループパスに連続するスラッシュは使用できません",
        field: "postGroupPath",
      },
    };
  }

  const segments = value.split("/");
  if (segments.length === 0) {
    return {
      success: false,
      error: {
        message: "グループパスは1階層以上必要です",
        field: "postGroupPath",
      },
    };
  }

  for (const segment of segments) {
    const groupResult = createPostGroup(segment);
    if (!groupResult.success) {
      return {
        success: false,
        error: {
          message: `グループパス内のセグメント「${segment}」が無効です: ${groupResult.error.message}`,
          field: "postGroupPath",
        },
      };
    }
  }

  return {
    success: true,
    data: value as PostGroupPath,
  };
};

/**
 * PostGroupPathの値を取得する
 */
export const getPostGroupPathValue = (path: PostGroupPath): string => {
  return path;
};

/**
 * PostGroupPathの等価性を判定する
 */
export const isPostGroupPathEqual = (a: PostGroupPath, b: PostGroupPath): boolean => {
  return a === b;
};

/**
 * PostGroupPathが有効かどうかを判定する型ガード
 */
export const isPostGroupPath = (value: unknown): value is PostGroupPath => {
  if (typeof value !== "string") return false;
  const result = createPostGroupPath(value);
  return result.success;
};

/**
 * デフォルトグループパスを作成する（"general"）
 */
export const createDefaultPostGroupPath = (): PostGroupPath => {
  const result = createPostGroupPath("general");
  if (!result.success) {
    throw new Error("デフォルトグループパスの作成に失敗しました");
  }
  return result.data;
};

/**
 * PostGroupPathを検証する
 */
export const validatePostGroupPath = (value: unknown): Result<PostGroupPath> => {
  return createPostGroupPath(value as string);
};
