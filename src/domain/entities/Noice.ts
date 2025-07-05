/**
 * いいねエンティティ
 *
 * ビジネスルール:
 * - いいね数は常に正の値
 * - いいねを送るユーザーIDは変更不可（不変）
 * - いいねを受ける投稿IDは変更不可（不変）
 * - 作成日時は変更不可（不変）
 * - いいねにはオプションでコメントを付けることができる
 *
 * 実装方針: interface、typeと関数で実装
 */

import type {
  UserId,
  PostId,
  NoiceAmount,
} from "../types";
import {
  isUserIdEqual,
  getUserIdValue,
} from "../value-objects/UserId";
import {
  getNoiceAmountValue,
} from "../value-objects/NoiceAmount";
import {
  getPostIdValue,
} from "../value-objects/PostId";

/**
 * NoiceIDの型定義
 */
export interface NoiceId {
  readonly value: string;
}

/**
 * NoiceIDを作成する
 */
export const createNoiceId = (value: string): NoiceId => {
  if (!value || value.trim().length === 0) {
    throw new Error('NoiceIDは空文字にできません');
  }
  return { value: value.trim() };
};

/**
 * 新しいNoiceIDを生成する
 */
export const generateNewNoiceId = (): NoiceId => {
  return createNoiceId(crypto.randomUUID());
};

/**
 * NoiceIDの値を取得する
 */
export const getNoiceIdValue = (noiceId: NoiceId): string => {
  return noiceId.value;
};

/**
 * NoiceIDの等価性を判定する
 */
export const isNoiceIdEqual = (id1: NoiceId, id2: NoiceId): boolean => {
  return id1.value === id2.value;
};

/**
 * いいねエンティティの型定義
 */
export interface Noice {
  readonly id: NoiceId;
  readonly fromUserId: UserId;
  readonly postId: PostId;
  readonly amount: NoiceAmount;
  readonly comment?: string;
  readonly noices: readonly Noice[];
  readonly createdAt: Date;
}

/**
 * Noiceエンティティを作成する
 */
export const createNoice = (
  id: NoiceId,
  fromUserId: UserId,
  postId: PostId,
  amount: NoiceAmount,
  comment: string | undefined,
  noices: readonly Noice[],
  createdAt: Date,
): Noice => {
  return {
    id,
    fromUserId,
    postId,
    amount,
    comment,
    noices,
    createdAt,
  };
};

/**
 * 新しいNoiceエンティティを生成する（コメントなし）
 */
export const createNewNoice = (
  fromUserId: UserId,
  postId: PostId,
  amount: NoiceAmount,
): Noice => {
  return createNoice(
    generateNewNoiceId(),
    fromUserId,
    postId,
    amount,
    undefined,
    [],
    new Date(),
  );
};

/**
 * 新しいNoiceエンティティを生成する（コメント付き）
 */
export const createNewNoiceWithComment = (
  fromUserId: UserId,
  postId: PostId,
  amount: NoiceAmount,
  comment: string,
): Noice => {
  if (!comment || comment.trim().length === 0) {
    throw new Error('コメントが空の場合はcreateNewNoiceを使用してください');
  }
  if (comment.length > 200) {
    throw new Error('いいねのコメントは200文字以内である必要があります');
  }
  
  return createNoice(
    generateNewNoiceId(),
    fromUserId,
    postId,
    amount,
    comment.trim(),
    [],
    new Date(),
  );
};

/**
 * いいねIDを取得する
 */
export const getNoiceId = (noice: Noice): NoiceId => {
  return noice.id;
};

/**
 * いいねを送ったユーザーIDを取得する
 */
export const getNoiceFromUserId = (noice: Noice): UserId => {
  return noice.fromUserId;
};

/**
 * いいねを受けた投稿IDを取得する
 */
export const getNoicePostId = (noice: Noice): PostId => {
  return noice.postId;
};

/**
 * いいね数を取得する
 */
export const getNoiceAmountFromNoice = (noice: Noice): NoiceAmount => {
  return noice.amount;
};

/**
 * いいねのコメントを取得する
 */
export const getNoiceComment = (noice: Noice): string | undefined => {
  return noice.comment;
};

/**
 * いいねの作成日時を取得する
 */
export const getNoiceCreatedAt = (noice: Noice): Date => {
  return noice.createdAt;
};

/**
 * いいねにコメントがあるかどうか判定する
 */
export const hasNoiceComment = (noice: Noice): boolean => {
  return noice.comment !== undefined && noice.comment.length > 0;
};

/**
 * 指定されたユーザーがいいねを送ったかどうか判定する
 */
export const isNoiceFromUser = (noice: Noice, userId: UserId): boolean => {
  return isUserIdEqual(noice.fromUserId, userId);
};

/**
 * 指定された投稿にいいねが付けられたかどうか判定する
 */
export const isNoiceToPost = (noice: Noice, postId: PostId): boolean => {
  return noice.postId === postId;
};

/**
 * いいねの等価性を判定する（IDで判定）
 */
export const isNoiceEqual = (noice1: Noice, noice2: Noice): boolean => {
  return isNoiceIdEqual(noice1.id, noice2.id);
};

/**
 * いいねのIDを文字列として取得する
 */
export const getNoiceIdAsString = (noice: Noice): string => {
  return getNoiceIdValue(noice.id);
};

/**
 * いいねを送ったユーザーIDを文字列として取得する
 */
export const getNoiceFromUserIdAsString = (noice: Noice): string => {
  return getUserIdValue(noice.fromUserId);
};

/**
 * いいねを受けた投稿IDを文字列として取得する
 */
export const getNoicePostIdAsString = (noice: Noice): string => {
  return getPostIdValue(noice.postId);
};

/**
 * いいね数を数値として取得する
 */
export const getNoiceAmountAsNumber = (noice: Noice): number => {
  return getNoiceAmountValue(noice.amount);
};

/**
 * いいねに付けられたいいね一覧を取得する
 */
export const getNoiceNoices = (noice: Noice): readonly Noice[] => {
  return noice.noices;
};

/**
 * いいねに付けられたいいね数を取得する
 */
export const getNoiceNoiceCount = (noice: Noice): number => {
  return noice.noices.length;
};

/**
 * いいねにいいねを追加する
 */
export const addNoiceToNoice = (noice: Noice, subNoice: Noice): Noice => {
  return {
    ...noice,
    noices: [...noice.noices, subNoice],
  };
};

/**
 * いいねの総いいね数を再帰的に計算する（自分のいいね数 + サブいいねの総数）
 */
export const getNoiceTotalAmount = (noice: Noice): number => {
  const ownAmount = getNoiceAmountValue(noice.amount);
  const subNoicesAmount = noice.noices.reduce((total, subNoice) => {
    return total + getNoiceTotalAmount(subNoice);
  }, 0);
  return ownAmount + subNoicesAmount;
};

/**
 * 指定されたユーザーのいいねを取得する
 */
export const getNoiceNoicesByUser = (
  noice: Noice,
  userId: UserId,
): readonly Noice[] => {
  return noice.noices.filter(subNoice => 
    isUserIdEqual(subNoice.fromUserId, userId)
  );
};
