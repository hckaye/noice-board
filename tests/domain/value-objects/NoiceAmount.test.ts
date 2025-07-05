import { describe, it, expect } from "vitest";
import {
  createNoiceAmountOrThrow,
  getNoiceAmountValue,
  isNoiceAmountEqual,
  addNoiceAmount,
  subtractNoiceAmount,
  isNoiceAmountGreaterThan,
  isNoiceAmountGreaterThanOrEqual,
} from "../../../src/domain/value-objects/NoiceAmount";

describe("NoiceAmount", () => {
  describe("正常なケース", () => {
    it("正の整数でNoiceAmountを作成できる", () => {
      const amount = createNoiceAmountOrThrow(100);
      expect(getNoiceAmountValue(amount)).toBe(100);
    });

    it("0でNoiceAmountを作成できる", () => {
      const amount = createNoiceAmountOrThrow(0);
      expect(getNoiceAmountValue(amount)).toBe(0);
    });

    it("最大値でNoiceAmountを作成できる", () => {
      const amount = createNoiceAmountOrThrow(999999);
      expect(getNoiceAmountValue(amount)).toBe(999999);
    });
  });

  describe("異常なケース", () => {
    it("負の数でNoiceAmountを作成しようとするとエラーが発生する", () => {
      expect(() => createNoiceAmountOrThrow(-1)).toThrow(
        "いいね数は0以上である必要があります",
      );
    });

    it("最大値を超える数でNoiceAmountを作成しようとするとエラーが発生する", () => {
      expect(() => createNoiceAmountOrThrow(1000000)).toThrow(
        "いいね数は999999以下である必要があります",
      );
    });

    it("小数点を含む数でNoiceAmountを作成しようとするとエラーが発生する", () => {
      expect(() => createNoiceAmountOrThrow(10.5)).toThrow(
        "いいね数は整数である必要があります",
      );
    });
  });

  describe("等価性", () => {
    it("同じ値のNoiceAmountは等しい", () => {
      const amount1 = createNoiceAmountOrThrow(100);
      const amount2 = createNoiceAmountOrThrow(100);
      expect(isNoiceAmountEqual(amount1, amount2)).toBe(true);
    });

    it("異なる値のNoiceAmountは等しくない", () => {
      const amount1 = createNoiceAmountOrThrow(100);
      const amount2 = createNoiceAmountOrThrow(200);
      expect(isNoiceAmountEqual(amount1, amount2)).toBe(false);
    });
  });

  describe("演算", () => {
    it("NoiceAmountを加算できる", () => {
      const amount1 = createNoiceAmountOrThrow(100);
      const amount2 = createNoiceAmountOrThrow(50);
      const result = addNoiceAmount(amount1, amount2);
      expect(getNoiceAmountValue(result)).toBe(150);
    });

    it("NoiceAmountを減算できる", () => {
      const amount1 = createNoiceAmountOrThrow(100);
      const amount2 = createNoiceAmountOrThrow(30);
      const result = subtractNoiceAmount(amount1, amount2);
      expect(getNoiceAmountValue(result)).toBe(70);
    });

    it("減算結果が負になる場合はエラーが発生する", () => {
      const amount1 = createNoiceAmountOrThrow(100);
      const amount2 = createNoiceAmountOrThrow(200);
      expect(() => subtractNoiceAmount(amount1, amount2)).toThrow(
        "いいね数は負の値になることはできません",
      );
    });

    it("加算結果が最大値を超える場合はエラーが発生する", () => {
      const amount1 = createNoiceAmountOrThrow(999999);
      const amount2 = createNoiceAmountOrThrow(1);
      expect(() => addNoiceAmount(amount1, amount2)).toThrow(
        "いいね数は999999以下である必要があります",
      );
    });

    it("より大きいかどうかを判定できる", () => {
      const amount1 = createNoiceAmountOrThrow(100);
      const amount2 = createNoiceAmountOrThrow(50);
      expect(isNoiceAmountGreaterThan(amount1, amount2)).toBe(true);
      expect(isNoiceAmountGreaterThan(amount2, amount1)).toBe(false);
    });

    it("以上かどうかを判定できる", () => {
      const amount1 = createNoiceAmountOrThrow(100);
      const amount2 = createNoiceAmountOrThrow(100);
      const amount3 = createNoiceAmountOrThrow(50);
      expect(isNoiceAmountGreaterThanOrEqual(amount1, amount2)).toBe(true);
      expect(isNoiceAmountGreaterThanOrEqual(amount1, amount3)).toBe(true);
      expect(isNoiceAmountGreaterThanOrEqual(amount3, amount1)).toBe(false);
    });
  });
});
