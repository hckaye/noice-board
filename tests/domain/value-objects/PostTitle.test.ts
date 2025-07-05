import { describe, it, expect } from "vitest";
import {
  createPostTitleOrThrow,
  getPostTitleValue,
  isPostTitleEqual,
  postTitleToString,
  getPostTitleLength,
} from "../../../src/domain/value-objects/PostTitle";

describe("PostTitle", () => {
  describe("正常なケース", () => {
    it("有効な長さのタイトルでPostTitleを作成できる", () => {
      const title = createPostTitleOrThrow("テスト投稿のタイトル");
      expect(getPostTitleValue(title)).toBe("テスト投稿のタイトル");
    });

    it("1文字のタイトルでPostTitleを作成できる", () => {
      const title = createPostTitleOrThrow("A");
      expect(getPostTitleValue(title)).toBe("A");
    });

    it("100文字のタイトルでPostTitleを作成できる", () => {
      const longTitle = "A".repeat(100);
      const title = createPostTitleOrThrow(longTitle);
      expect(getPostTitleValue(title)).toBe(longTitle);
    });

    it("日本語のタイトルでPostTitleを作成できる", () => {
      const title = createPostTitleOrThrow("こんにちは世界");
      expect(getPostTitleValue(title)).toBe("こんにちは世界");
    });
  });

  describe("異常なケース", () => {
    it("空文字列でPostTitleを作成しようとするとエラーが発生する", () => {
      expect(() => createPostTitleOrThrow("")).toThrow(
        "タイトルは空であってはいけません",
      );
    });

    it("空白のみの文字列でPostTitleを作成しようとするとエラーが発生する", () => {
      expect(() => createPostTitleOrThrow("   ")).toThrow(
        "タイトルは空であってはいけません",
      );
    });

    it("101文字以上のタイトルでPostTitleを作成しようとするとエラーが発生する", () => {
      const tooLongTitle = "A".repeat(101);
      expect(() => createPostTitleOrThrow(tooLongTitle)).toThrow(
        "タイトルは100文字以下である必要があります",
      );
    });

    it("nullでPostTitleを作成しようとするとエラーが発生する", () => {
      expect(() => createPostTitleOrThrow(null as unknown as string)).toThrow(
        "タイトルは空であってはいけません",
      );
    });

    it("undefinedでPostTitleを作成しようとするとエラーが発生する", () => {
      expect(() =>
        createPostTitleOrThrow(undefined as unknown as string),
      ).toThrow("タイトルは空であってはいけません");
    });
  });

  describe("等価性", () => {
    it("同じタイトルのPostTitleは等しい", () => {
      const title1 = createPostTitleOrThrow("テストタイトル");
      const title2 = createPostTitleOrThrow("テストタイトル");
      expect(isPostTitleEqual(title1, title2)).toBe(true);
    });

    it("異なるタイトルのPostTitleは等しくない", () => {
      const title1 = createPostTitleOrThrow("タイトル1");
      const title2 = createPostTitleOrThrow("タイトル2");
      expect(isPostTitleEqual(title1, title2)).toBe(false);
    });
  });

  describe("文字列変換", () => {
    it("文字列として取得できる", () => {
      const title = createPostTitleOrThrow("テストタイトル");
      expect(postTitleToString(title)).toBe("テストタイトル");
    });
  });

  describe("長さ取得", () => {
    it("タイトルの長さを取得できる", () => {
      const title = createPostTitleOrThrow("テストタイトル");
      expect(getPostTitleLength(title)).toBe(7);
    });

    it("英字のタイトルの長さを取得できる", () => {
      const title = createPostTitleOrThrow("Test Title");
      expect(getPostTitleLength(title)).toBe(10);
    });
  });
});
