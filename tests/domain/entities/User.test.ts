import { describe, it, expect } from "vitest";
import {
  createUser,
  createNewUser,
  getUserId,
  getUsername,
  getUserDisplayName,
  getUserNoiceAmount,
  getUserCreatedAt,
  addUserNoice,
  subtractUserNoice,
  hasEnoughUserNoice,
  updateUserDisplayName,
  isUserEqual,
} from "../../../src/domain/entities/User";
import {
  createUserIdOrThrow,
  isUserIdEqual,
} from "../../../src/domain/value-objects/UserId";
import {
  createUsernameOrThrow,
  isUsernameEqual,
} from "../../../src/domain/value-objects/Username";
import {
  createNoiceAmountOrThrow,
  isNoiceAmountEqual,
  getNoiceAmountValue,
} from "../../../src/domain/value-objects/NoiceAmount";
import type { UserDisplayName } from "../../../src/domain/types";

describe("User", () => {
  const userId = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
  const username = createUsernameOrThrow("testuser");
  const displayName = "テストユーザー" as UserDisplayName;
  const noiceAmount = createNoiceAmountOrThrow(1000);
  const now = new Date();

  describe("ユーザーの作成", () => {
    it("有効な値でUserを作成できる", () => {
      const user = createUser(userId, username, displayName, noiceAmount, now);

      expect(isUserIdEqual(getUserId(user), userId)).toBe(true);
      expect(isUsernameEqual(getUsername(user), username)).toBe(true);
      expect(getUserDisplayName(user)).toBe(displayName);
      expect(isNoiceAmountEqual(getUserNoiceAmount(user), noiceAmount)).toBe(
        true,
      );
      expect(getUserCreatedAt(user)).toBe(now);
    });

    it("新しいUserを生成できる", () => {
      const newUser = createNewUser(username, displayName, noiceAmount);

      expect(isUsernameEqual(getUsername(newUser), username)).toBe(true);
      expect(getUserDisplayName(newUser)).toBe(displayName);
      expect(isNoiceAmountEqual(getUserNoiceAmount(newUser), noiceAmount)).toBe(
        true,
      );
      expect(getUserCreatedAt(newUser)).toBeInstanceOf(Date);
    });
  });

  describe("いいねの操作", () => {
    it("いいねを追加できる", () => {
      const user = createUser(userId, username, displayName, noiceAmount, now);
      const addAmount = createNoiceAmountOrThrow(500);

      const updatedUser = addUserNoice(user, addAmount);

      expect(getNoiceAmountValue(getUserNoiceAmount(updatedUser))).toBe(1500);
    });

    it("いいねを減少できる", () => {
      const user = createUser(userId, username, displayName, noiceAmount, now);
      const subtractAmount = createNoiceAmountOrThrow(300);

      const updatedUser = subtractUserNoice(user, subtractAmount);

      expect(getNoiceAmountValue(getUserNoiceAmount(updatedUser))).toBe(700);
    });

    it("所持いいね数を超える減少はエラーになる", () => {
      const user = createUser(userId, username, displayName, noiceAmount, now);
      const subtractAmount = createNoiceAmountOrThrow(1500);

      expect(() => subtractUserNoice(user, subtractAmount)).toThrow(
        "所持いいね数が不足しています",
      );
    });

    it("いいねが足りているかチェックできる", () => {
      const user = createUser(userId, username, displayName, noiceAmount, now);
      const checkAmount1 = createNoiceAmountOrThrow(500);
      const checkAmount2 = createNoiceAmountOrThrow(1500);

      expect(hasEnoughUserNoice(user, checkAmount1)).toBe(true);
      expect(hasEnoughUserNoice(user, checkAmount2)).toBe(false);
    });
  });

  describe("表示名の更新", () => {
    it("表示名を更新できる", () => {
      const user = createUser(userId, username, displayName, noiceAmount, now);
      const newDisplayName = "新しい表示名";

      const updatedUser = updateUserDisplayName(user, newDisplayName);

      expect(getUserDisplayName(updatedUser)).toBe(newDisplayName);
    });

    it("空の表示名に更新しようとするとエラーになる", () => {
      const user = createUser(userId, username, displayName, noiceAmount, now);

      expect(() => updateUserDisplayName(user, "")).toThrow(
        "表示名は空であってはいけません",
      );
    });

    it("100文字を超える表示名に更新しようとするとエラーになる", () => {
      const user = createUser(userId, username, displayName, noiceAmount, now);
      const longDisplayName = "あ".repeat(101);

      expect(() => updateUserDisplayName(user, longDisplayName)).toThrow(
        "表示名は100文字以下である必要があります",
      );
    });
  });

  describe("等価性", () => {
    it("同じIDのUserは等しい", () => {
      const user1 = createUser(userId, username, displayName, noiceAmount, now);
      const user2 = createUser(
        userId,
        createUsernameOrThrow("different"),
        "Different" as UserDisplayName,
        createNoiceAmountOrThrow(2000),
        new Date(),
      );

      expect(isUserEqual(user1, user2)).toBe(true);
    });

    it("異なるIDのUserは等しくない", () => {
      const differentUserId = createUserIdOrThrow(
        "550e8400-e29b-41d4-a716-446655440001",
      );
      const user1 = createUser(userId, username, displayName, noiceAmount, now);
      const user2 = createUser(
        differentUserId,
        username,
        displayName,
        noiceAmount,
        now,
      );

      expect(isUserEqual(user1, user2)).toBe(false);
    });
  });

  describe("不変条件", () => {
    it("いいね数は常に0以上である", () => {
      const user = createUser(
        userId,
        username,
        displayName,
        createNoiceAmountOrThrow(100),
        now,
      );
      const subtractAmount = createNoiceAmountOrThrow(150);

      expect(() => subtractUserNoice(user, subtractAmount)).toThrow(
        "所持いいね数が不足しています",
      );
      expect(getNoiceAmountValue(getUserNoiceAmount(user))).toBe(100); // 変更されていない
    });
  });
});
