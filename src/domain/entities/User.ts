/**
 * ユーザーエンティティ
 *
 * ビジネスルール:
 * - 所持いいね数は常に0以上
 * - 表示名は1文字以上100文字以下
 * - ユーザー名は変更不可（不変）
 *
 * 実装方針: interface、typeと関数で実装
 */

import type { UserId, Username, NoiceAmount, UserDisplayName } from "../types";
import {
  isUserIdEqual,
  getUserIdValue,
  generateNewUserId,
} from "../value-objects/UserId";
import { getUsernameValue } from "../value-objects/Username";
import {
  getNoiceAmountValue,
  addNoiceAmount,
  subtractNoiceAmount,
  isNoiceAmountGreaterThanOrEqual,
} from "../value-objects/NoiceAmount";
import { validateUserDisplayName } from "../utils/validators";

/**
 * ユーザーエンティティの型定義
 */
export interface User {
  readonly id: UserId;
  readonly username: Username;
  readonly displayName: UserDisplayName;
  readonly noiceAmount: NoiceAmount;
  readonly createdAt: Date;
}

/**
 * Userエンティティを作成する
 */
export const createUser = (
  id: UserId,
  username: Username,
  displayName: UserDisplayName,
  noiceAmount: NoiceAmount,
  createdAt: Date,
): User => {
  return {
    id,
    username,
    displayName,
    noiceAmount,
    createdAt,
  };
};

/**
 * 新しいUserエンティティを生成する
 */
export const createNewUser = (
  username: Username,
  displayName: UserDisplayName,
  noiceAmount: NoiceAmount,
): User => {
  return createUser(
    generateNewUserId(),
    username,
    displayName,
    noiceAmount,
    new Date(),
  );
};

/**
 * ユーザーIDを取得する
 */
export const getUserId = (user: User): UserId => {
  return user.id;
};

/**
 * ユーザー名を取得する
 */
export const getUsername = (user: User): Username => {
  return user.username;
};

/**
 * 表示名を取得する
 */
export const getUserDisplayName = (user: User): UserDisplayName => {
  return user.displayName;
};

/**
 * 所持いいね数を取得する
 */
export const getUserNoiceAmount = (user: User): NoiceAmount => {
  return user.noiceAmount;
};

/**
 * 作成日時を取得する
 */
export const getUserCreatedAt = (user: User): Date => {
  return user.createdAt;
};

/**
 * いいねを追加する
 */
export const addUserNoice = (user: User, amount: NoiceAmount): User => {
  return {
    ...user,
    noiceAmount: addNoiceAmount(user.noiceAmount, amount),
  };
};

/**
 * いいねを減少する
 */
export const subtractUserNoice = (user: User, amount: NoiceAmount): User => {
  if (!hasEnoughUserNoice(user, amount)) {
    throw new Error("所持いいね数が不足しています");
  }
  return {
    ...user,
    noiceAmount: subtractNoiceAmount(user.noiceAmount, amount),
  };
};

/**
 * 指定されたいいね数が足りているかチェックする
 */
export const hasEnoughUserNoice = (
  user: User,
  amount: NoiceAmount,
): boolean => {
  return isNoiceAmountGreaterThanOrEqual(user.noiceAmount, amount);
};

/**
 * 表示名を更新する
 */
export const updateUserDisplayName = (
  user: User,
  newDisplayName: unknown,
): User => {
  const validated = validateUserDisplayName(newDisplayName);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }
  return {
    ...user,
    displayName: validated.data,
  };
};

/**
 * ユーザーの等価性を判定する（IDで判定）
 */
export const isUserEqual = (user1: User, user2: User): boolean => {
  return isUserIdEqual(user1.id, user2.id);
};

/**
 * ユーザーの表示名を安全に取得する（文字列として）
 */
export const getUserDisplayNameAsString = (user: User): string => {
  return user.displayName as string;
};

/**
 * ユーザーのいいね数を数値として取得する
 */
export const getUserNoiceAmountAsNumber = (user: User): number => {
  return getNoiceAmountValue(user.noiceAmount);
};

/**
 * ユーザーのユーザー名を文字列として取得する
 */
export const getUsernameAsString = (user: User): string => {
  return getUsernameValue(user.username);
};

/**
 * ユーザーのIDを文字列として取得する
 */
export const getUserIdAsString = (user: User): string => {
  return getUserIdValue(user.id);
};
