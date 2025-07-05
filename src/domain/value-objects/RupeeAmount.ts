/**
 * ルピー数を表現する値オブジェクト
 *
 * ビジネスルール:
 * - 0以上の整数
 * - 不変オブジェクト
 * - 負の値は許可しない
 *
 * 実装方針: interface、typeと関数で実装
 */

import type { RupeeAmount, Result } from "../types";
import { validateRupeeAmount } from "../utils/validators";

// 型を再エクスポート
export type { RupeeAmount };

/**
 * RupeeAmountを作成する
 */
export const createRupeeAmount = (value: number): Result<RupeeAmount> => {
  return validateRupeeAmount(value);
};

/**
 * RupeeAmountの値を取得する
 */
export const getRupeeAmountValue = (rupeeAmount: RupeeAmount): number => {
  return rupeeAmount as number;
};

/**
 * RupeeAmountの等価性を判定する
 */
export const isRupeeAmountEqual = (
  rupeeAmount1: RupeeAmount,
  rupeeAmount2: RupeeAmount,
): boolean => {
  return (
    getRupeeAmountValue(rupeeAmount1) === getRupeeAmountValue(rupeeAmount2)
  );
};

/**
 * RupeeAmountを数値として取得する
 */
export const rupeeAmountToNumber = (rupeeAmount: RupeeAmount): number => {
  return getRupeeAmountValue(rupeeAmount);
};

/**
 * RupeeAmountを文字列として取得する
 */
export const rupeeAmountToString = (rupeeAmount: RupeeAmount): string => {
  return getRupeeAmountValue(rupeeAmount).toString();
};

/**
 * RupeeAmountを加算する
 */
export const addRupeeAmount = (
  amount1: RupeeAmount,
  amount2: RupeeAmount,
): RupeeAmount => {
  const result = getRupeeAmountValue(amount1) + getRupeeAmountValue(amount2);
  return result as RupeeAmount;
};

/**
 * RupeeAmountを減算する
 */
export const subtractRupeeAmount = (
  amount1: RupeeAmount,
  amount2: RupeeAmount,
): RupeeAmount => {
  const result = getRupeeAmountValue(amount1) - getRupeeAmountValue(amount2);
  if (result < 0) {
    throw new Error("ルピー数は負の値になることはできません");
  }
  return result as RupeeAmount;
};

/**
 * RupeeAmountの大小比較（以上）
 */
export const isRupeeAmountGreaterThanOrEqual = (
  amount1: RupeeAmount,
  amount2: RupeeAmount,
): boolean => {
  return getRupeeAmountValue(amount1) >= getRupeeAmountValue(amount2);
};

/**
 * RupeeAmountの大小比較（より大きい）
 */
export const isRupeeAmountGreaterThan = (
  amount1: RupeeAmount,
  amount2: RupeeAmount,
): boolean => {
  return getRupeeAmountValue(amount1) > getRupeeAmountValue(amount2);
};

/**
 * RupeeAmountの大小比較（以下）
 */
export const isRupeeAmountLessThanOrEqual = (
  amount1: RupeeAmount,
  amount2: RupeeAmount,
): boolean => {
  return getRupeeAmountValue(amount1) <= getRupeeAmountValue(amount2);
};

/**
 * RupeeAmountの大小比較（より小さい）
 */
export const isRupeeAmountLessThan = (
  amount1: RupeeAmount,
  amount2: RupeeAmount,
): boolean => {
  return getRupeeAmountValue(amount1) < getRupeeAmountValue(amount2);
};

/**
 * ゼロのRupeeAmountを作成する
 */
export const createZeroRupeeAmount = (): RupeeAmount => {
  return 0 as RupeeAmount;
};

/**
 * 安全にRupeeAmountを作成する（エラーをスローしない）
 */
export const safeCreateRupeeAmount = (value: unknown): RupeeAmount | null => {
  const result = validateRupeeAmount(value);
  return result.success ? result.data : null;
};

/**
 * RupeeAmountを作成する（エラーをスローする版）
 */
export const createRupeeAmountOrThrow = (value: number): RupeeAmount => {
  const result = createRupeeAmount(value);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return result.data;
};
