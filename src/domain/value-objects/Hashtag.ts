/**
 * ハッシュタグ値オブジェクト
 *
 * ビジネスルール:
 * - ハッシュタグは1文字以上50文字以下
 * - ハッシュタグは英数字、日本語、ハイフン、アンダースコアのみ使用可能
 * - ハッシュタグは#で始まる必要がある
 * - 重複は許可しない
 *
 * 実装方針: interface、typeと関数で実装
 */

import { isNonEmptyString } from "../utils/validators";
import type { Hashtag, HashtagList } from "../types";

// 型を再エクスポート
export type { Hashtag, HashtagList };

/**
 * ハッシュタグの最大文字数
 */
const MAX_HASHTAG_LENGTH = 50;

/**
 * ハッシュタグの正規表現パターン（#で始まり、英数字、日本語、ハイフン、アンダースコアを含む）
 */
const HASHTAG_PATTERN = /^#[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\-_]+$/;

/**
 * ハッシュタグを作成する
 */
export const createHashtag = (value: string): Hashtag => {
  validateHashtag(value);
  return value as Hashtag;
};

/**
 * ハッシュタグのバリデーション
 */
const validateHashtag = (value: string): void => {
  if (!isNonEmptyString(value)) {
    throw new Error("ハッシュタグが空です");
  }
  
  if (value.length > MAX_HASHTAG_LENGTH) {
    throw new Error(`ハッシュタグは${MAX_HASHTAG_LENGTH}文字以下である必要があります`);
  }
  
  if (!HASHTAG_PATTERN.test(value)) {
    throw new Error(
      "ハッシュタグは#で始まり、英数字、日本語、ハイフン、アンダースコアのみ使用できます"
    );
  }
};

/**
 * ハッシュタグの値を取得する
 */
export const getHashtagValue = (hashtag: Hashtag): string => {
  return hashtag as string;
};

/**
 * ハッシュタグの等価性を判定する
 */
export const isHashtagEqual = (hashtag1: Hashtag, hashtag2: Hashtag): boolean => {
  return getHashtagValue(hashtag1) === getHashtagValue(hashtag2);
};

/**
 * ハッシュタグリストを作成する
 */
export const createHashtagList = (hashtags: string[]): HashtagList => {
  // 重複を除去
  const uniqueHashtags = Array.from(new Set(hashtags));
  return uniqueHashtags.map(createHashtag);
};

/**
 * ハッシュタグリストに新しいハッシュタグを追加する
 */
export const addHashtagToList = (
  hashtagList: HashtagList,
  newHashtag: string
): HashtagList => {
  const hashtag = createHashtag(newHashtag);
  
  // 既に存在する場合は追加しない
  if (hashtagList.some(h => isHashtagEqual(h, hashtag))) {
    return hashtagList;
  }
  
  return [...hashtagList, hashtag];
};

/**
 * ハッシュタグリストからハッシュタグを削除する
 */
export const removeHashtagFromList = (
  hashtagList: HashtagList,
  targetHashtag: string
): HashtagList => {
  const hashtag = createHashtag(targetHashtag);
  return hashtagList.filter(h => !isHashtagEqual(h, hashtag));
};

/**
 * ハッシュタグリストを文字列配列として取得する
 */
export const getHashtagListAsStringArray = (hashtagList: HashtagList): string[] => {
  return hashtagList.map(getHashtagValue);
};

/**
 * ハッシュタグリストの数を取得する
 */
export const getHashtagListCount = (hashtagList: HashtagList): number => {
  return hashtagList.length;
};

/**
 * ハッシュタグリストが指定されたハッシュタグを含むかチェックする
 */
export const hasHashtagInList = (
  hashtagList: HashtagList,
  targetHashtag: string
): boolean => {
  try {
    const hashtag = createHashtag(targetHashtag);
    return hashtagList.some(h => isHashtagEqual(h, hashtag));
  } catch {
    return false;
  }
};

/**
 * 空のハッシュタグリストを作成する
 */
export const createEmptyHashtagList = (): HashtagList => {
  return [];
};
