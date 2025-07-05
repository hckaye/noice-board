import { describe, it, expect } from "vitest";
import {
  createPostIdOrThrow,
  generateNewPostId,
  getPostIdValue,
  isPostIdEqual,
  postIdToString,
} from "../../../src/domain/value-objects/PostId";

describe("PostId", () => {
  describe("正常なケース", () => {
    it("UUIDでPostIdを作成できる", () => {
      const id = createPostIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
      expect(getPostIdValue(id)).toBe("550e8400-e29b-41d4-a716-446655440000");
    });

    it("新しいPostIdを生成できる", () => {
      const id = generateNewPostId();
      expect(getPostIdValue(id)).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe("異常なケース", () => {
    it("空文字列でPostIdを作成しようとするとエラーが発生する", () => {
      expect(() => createPostIdOrThrow("")).toThrow(
        "PostIdは空であってはいけません",
      );
    });

    it("無効なUUID形式でPostIdを作成しようとするとエラーが発生する", () => {
      expect(() => createPostIdOrThrow("invalid-uuid")).toThrow(
        "PostIdはUUID形式である必要があります",
      );
    });

    it("nullでPostIdを作成しようとするとエラーが発生する", () => {
      expect(() => createPostIdOrThrow(null as unknown as string)).toThrow(
        "PostIdは空であってはいけません",
      );
    });

    it("undefinedでPostIdを作成しようとするとエラーが発生する", () => {
      expect(() => createPostIdOrThrow(undefined as unknown as string)).toThrow(
        "PostIdは空であってはいけません",
      );
    });
  });

  describe("等価性", () => {
    it("同じIDのPostIdは等しい", () => {
      const id1 = createPostIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
      const id2 = createPostIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
      expect(isPostIdEqual(id1, id2)).toBe(true);
    });

    it("異なるIDのPostIdは等しくない", () => {
      const id1 = createPostIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
      const id2 = createPostIdOrThrow("550e8400-e29b-41d4-a716-446655440001");
      expect(isPostIdEqual(id1, id2)).toBe(false);
    });

    it("生成された2つのPostIdは異なる", () => {
      const id1 = generateNewPostId();
      const id2 = generateNewPostId();
      expect(isPostIdEqual(id1, id2)).toBe(false);
    });
  });

  describe("文字列変換", () => {
    it("文字列として取得できる", () => {
      const id = createPostIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
      expect(postIdToString(id)).toBe("550e8400-e29b-41d4-a716-446655440000");
    });
  });
});
