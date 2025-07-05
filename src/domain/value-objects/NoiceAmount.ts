/**
 * いいね数を表現する値オブジェクト
 *
 * ビジネスルール:
 * - 0以上の整数
 * - 不変オブジェクト
 * - 負の値は許可しない
 *
 * 実装方針: interface、typeと関数で実装
 */

import type { NoiceAmount, Result } from "../types";
import { validateNoiceAmount } from "../utils/validators";

// 型を再エクスポート
export type { NoiceAmount };

/**
 * NoiceAmountを作成する
 */
export const createNoiceAmount = (value: number): Result<NoiceAmount> => {
  return validateNoiceAmount(value);
};

/**
 * NoiceAmountの値を取得する
 */
export const getNoiceAmountValue = (noiceAmount: NoiceAmount): number => {
  return noiceAmount as number;
};

/**
 * NoiceAmountの等価性を判定する
 */
export const isNoiceAmountEqual = (
  noiceAmount1: NoiceAmount,
  noiceAmount2: NoiceAmount,
): boolean => {
  return (
    getNoiceAmountValue(noiceAmount1) === getNoiceAmountValue(noiceAmount2)
  );
};

/**
 * NoiceAmountを数値として取得する
 */
export const noiceAmountToNumber = (noiceAmount: NoiceAmount): number => {
  return getNoiceAmountValue(noiceAmount);
};

/**
 * NoiceAmountを文字列として取得する
 */
export const noiceAmountToString = (noiceAmount: NoiceAmount): string => {
  return getNoiceAmountValue(noiceAmount).toString();
};

/**
 * NoiceAmountを加算する
 */
export const addNoiceAmount = (
  amount1: NoiceAmount,
  amount2: NoiceAmount,
): NoiceAmount => {
  const result = getNoiceAmountValue(amount1) + getNoiceAmountValue(amount2);
  const validated = createNoiceAmount(result);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }
  return validated.data;
};

/**
 * NoiceAmountを減算する
 */
export const subtractNoiceAmount = (
  amount1: NoiceAmount,
  amount2: NoiceAmount,
): NoiceAmount => {
  const result = getNoiceAmountValue(amount1) - getNoiceAmountValue(amount2);
  if (result < 0) {
    throw new Error("いいね数は負の値になることはできません");
  }
  const validated = createNoiceAmount(result);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }
  return validated.data;
};

/**
 * NoiceAmountの大小比較（以上）
 */
export const isNoiceAmountGreaterThanOrEqual = (
  amount1: NoiceAmount,
  amount2: NoiceAmount,
): boolean => {
  return getNoiceAmountValue(amount1) >= getNoiceAmountValue(amount2);
};

/**
 * NoiceAmountの大小比較（より大きい）
 */
export const isNoiceAmountGreaterThan = (
  amount1: NoiceAmount,
  amount2: NoiceAmount,
): boolean => {
  return getNoiceAmountValue(amount1) > getNoiceAmountValue(amount2);
};

/**
 * NoiceAmountの大小比較（以下）
 */
export const isNoiceAmountLessThanOrEqual = (
  amount1: NoiceAmount,
  amount2: NoiceAmount,
): boolean => {
  return getNoiceAmountValue(amount1) <= getNoiceAmountValue(amount2);
};

/**
 * NoiceAmountの大小比較（より小さい）
 */
export const isNoiceAmountLessThan = (
  amount1: NoiceAmount,
  amount2: NoiceAmount,
): boolean => {
  return getNoiceAmountValue(amount1) < getNoiceAmountValue(amount2);
};

/**
 * ゼロのNoiceAmountを作成する
 */
export const createZeroNoiceAmount = (): NoiceAmount => {
  return 0 as NoiceAmount;
};

/**
 * 安全にNoiceAmountを作成する（エラーをスローしない）
 */
export const safeCreateNoiceAmount = (value: unknown): NoiceAmount | null => {
  const result = validateNoiceAmount(value);
  return result.success ? result.data : null;
};

/**
 * NoiceAmountを作成する（エラーをスローする版）
 */
export const createNoiceAmountOrThrow = (value: number): NoiceAmount => {
  const result = createNoiceAmount(value);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return result.data;
};
