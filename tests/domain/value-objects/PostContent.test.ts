import { describe, it, expect } from "vitest";
import {
  createPostContentOrThrow,
  getPostContentValue,
  isPostContentEqual,
  postContentToString,
  getPostContentLength,
  getPostContentLineCount,
} from "../../../src/domain/value-objects/PostContent";

describe("PostContent", () => {
  describe("正常なケース", () => {
    it("有効な長さの本文でPostContentを作成できる", () => {
      const content = createPostContentOrThrow("これはテストの本文です。");
      expect(getPostContentValue(content)).toBe("これはテストの本文です。");
    });

    it("1文字の本文でPostContentを作成できる", () => {
      const content = createPostContentOrThrow("A");
      expect(getPostContentValue(content)).toBe("A");
    });

    it("1000文字の本文でPostContentを作成できる", () => {
      const longContent = "A".repeat(1000);
      const content = createPostContentOrThrow(longContent);
      expect(getPostContentValue(content)).toBe(longContent);
    });

    it("日本語の本文でPostContentを作成できる", () => {
      const content = createPostContentOrThrow(
        "これは日本語の本文です。改行やスペースも含むことができます。",
      );
      expect(getPostContentValue(content)).toBe(
        "これは日本語の本文です。改行やスペースも含むことができます。",
      );
    });

    it("改行を含む本文でPostContentを作成できる", () => {
      const content = createPostContentOrThrow("1行目\n2行目\n3行目");
      expect(getPostContentValue(content)).toBe("1行目\n2行目\n3行目");
    });

    it("記号を含む本文でPostContentを作成できる", () => {
      const content = createPostContentOrThrow(
        "記号: !@#$%^&*()_+-=[]{}|;:,.<>?",
      );
      expect(getPostContentValue(content)).toBe(
        "記号: !@#$%^&*()_+-=[]{}|;:,.<>?",
      );
    });
  });

  describe("異常なケース", () => {
    it("空文字列でPostContentを作成しようとするとエラーが発生する", () => {
      expect(() => createPostContentOrThrow("")).toThrow(
        "本文は空であってはいけません",
      );
    });

    it("空白のみの文字列でPostContentを作成しようとするとエラーが発生する", () => {
      expect(() => createPostContentOrThrow("   ")).toThrow(
        "本文は空であってはいけません",
      );
    });

    it("1001文字以上の本文でPostContentを作成しようとするとエラーが発生する", () => {
      const tooLongContent = "A".repeat(1001);
      expect(() => createPostContentOrThrow(tooLongContent)).toThrow(
        "本文は1000文字以下である必要があります",
      );
    });

    it("nullでPostContentを作成しようとするとエラーが発生する", () => {
      expect(() => createPostContentOrThrow(null as unknown as string)).toThrow(
        "本文は空であってはいけません",
      );
    });

    it("undefinedでPostContentを作成しようとするとエラーが発生する", () => {
      expect(() =>
        createPostContentOrThrow(undefined as unknown as string),
      ).toThrow("本文は空であってはいけません");
    });
  });

  describe("等価性", () => {
    it("同じ本文のPostContentは等しい", () => {
      const content1 = createPostContentOrThrow("同じ本文");
      const content2 = createPostContentOrThrow("同じ本文");
      expect(isPostContentEqual(content1, content2)).toBe(true);
    });

    it("異なる本文のPostContentは等しくない", () => {
      const content1 = createPostContentOrThrow("本文1");
      const content2 = createPostContentOrThrow("本文2");
      expect(isPostContentEqual(content1, content2)).toBe(false);
    });

    it("改行の違いで異なるPostContentは等しくない", () => {
      const content1 = createPostContentOrThrow("1行目\n2行目");
      const content2 = createPostContentOrThrow("1行目 2行目");
      expect(isPostContentEqual(content1, content2)).toBe(false);
    });
  });

  describe("文字列変換", () => {
    it("文字列として取得できる", () => {
      const content = createPostContentOrThrow("テスト本文");
      expect(postContentToString(content)).toBe("テスト本文");
    });
  });

  describe("長さ取得", () => {
    it("本文の長さを取得できる", () => {
      const content = createPostContentOrThrow("テスト本文");
      expect(getPostContentLength(content)).toBe(5);
    });

    it("改行を含む本文の長さを正確に取得できる", () => {
      const content = createPostContentOrThrow("1行目\n2行目");
      expect(getPostContentLength(content)).toBe(7); // '1行目' + '\n' + '2行目'
    });
  });

  describe("行数取得", () => {
    it("単一行の本文の行数を取得できる", () => {
      const content = createPostContentOrThrow("単一行の本文");
      expect(getPostContentLineCount(content)).toBe(1);
    });

    it("複数行の本文の行数を取得できる", () => {
      const content = createPostContentOrThrow("1行目\n2行目\n3行目");
      expect(getPostContentLineCount(content)).toBe(3);
    });

    it("空行を含む本文の行数を正確に取得できる", () => {
      const content = createPostContentOrThrow("1行目\n\n3行目");
      expect(getPostContentLineCount(content)).toBe(3);
    });
  });
});
