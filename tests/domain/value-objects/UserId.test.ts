import { describe, it, expect } from "vitest";
import {
  createUserIdOrThrow,
  generateNewUserId,
  getUserIdValue,
  isUserIdEqual,
  userIdToString,
} from "../../../src/domain/value-objects/UserId";

describe("UserId", () => {
  describe("正常なケース", () => {
    it("UUIDでUserIdを作成できる", () => {
      const id = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
      expect(getUserIdValue(id)).toBe("550e8400-e29b-41d4-a716-446655440000");
    });

    it("新しいUserIdを生成できる", () => {
      const id = generateNewUserId();
      expect(getUserIdValue(id)).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe("異常なケース", () => {
    it("空文字列でUserIdを作成しようとするとエラーが発生する", () => {
      expect(() => createUserIdOrThrow("")).toThrow(
        "UserIdは空であってはいけません",
      );
    });

    it("無効なUUID形式でUserIdを作成しようとするとエラーが発生する", () => {
      expect(() => createUserIdOrThrow("invalid-uuid")).toThrow(
        "UserIdはUUID形式である必要があります",
      );
    });

    it("nullでUserIdを作成しようとするとエラーが発生する", () => {
      expect(() => createUserIdOrThrow(null as unknown as string)).toThrow(
        "UserIdは空であってはいけません",
      );
    });

    it("undefinedでUserIdを作成しようとするとエラーが発生する", () => {
      expect(() => createUserIdOrThrow(undefined as unknown as string)).toThrow(
        "UserIdは空であってはいけません",
      );
    });
  });

  describe("等価性", () => {
    it("同じIDのUserIdは等しい", () => {
      const id1 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
      const id2 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
      expect(isUserIdEqual(id1, id2)).toBe(true);
    });

    it("異なるIDのUserIdは等しくない", () => {
      const id1 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
      const id2 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440001");
      expect(isUserIdEqual(id1, id2)).toBe(false);
    });

    it("生成された2つのUserIdは異なる", () => {
      const id1 = generateNewUserId();
      const id2 = generateNewUserId();
      expect(isUserIdEqual(id1, id2)).toBe(false);
    });
  });

  describe("文字列変換", () => {
    it("文字列として取得できる", () => {
      const id = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
      expect(userIdToString(id)).toBe("550e8400-e29b-41d4-a716-446655440000");
    });
  });
});
