import { describe, it, expect } from "vitest";
import {
  createUsernameOrThrow,
  getUsernameValue,
  isUsernameEqual,
  usernameToString,
  getUsernameLength,
} from "../../../src/domain/value-objects/Username";

describe("Username", () => {
  describe("正常なケース", () => {
    it("有効な英数字のUsernameを作成できる", () => {
      const username = createUsernameOrThrow("user123");
      expect(getUsernameValue(username)).toBe("user123");
    });

    it("3文字のUsernameを作成できる", () => {
      const username = createUsernameOrThrow("abc");
      expect(getUsernameValue(username)).toBe("abc");
    });

    it("20文字のUsernameを作成できる", () => {
      const longUsername = "a".repeat(20);
      const username = createUsernameOrThrow(longUsername);
      expect(getUsernameValue(username)).toBe(longUsername);
    });

    it("大文字と数字を含むUsernameを作成できる", () => {
      const username = createUsernameOrThrow("User123ABC");
      expect(getUsernameValue(username)).toBe("User123ABC");
    });
  });

  describe("異常なケース", () => {
    it("空文字列でUsernameを作成しようとするとエラーが発生する", () => {
      expect(() => createUsernameOrThrow("")).toThrow(
        "ユーザー名は空であってはいけません",
      );
    });

    it("空白のみの文字列でUsernameを作成しようとするとエラーが発生する", () => {
      expect(() => createUsernameOrThrow("   ")).toThrow(
        "ユーザー名は空であってはいけません",
      );
    });

    it("2文字以下のUsernameを作成しようとするとエラーが発生する", () => {
      expect(() => createUsernameOrThrow("ab")).toThrow(
        "ユーザー名は3文字以上である必要があります",
      );
    });

    it("21文字以上のUsernameを作成しようとするとエラーが発生する", () => {
      const tooLongUsername = "a".repeat(21);
      expect(() => createUsernameOrThrow(tooLongUsername)).toThrow(
        "ユーザー名は20文字以下である必要があります",
      );
    });

    it("日本語を含むUsernameを作成しようとするとエラーが発生する", () => {
      expect(() => createUsernameOrThrow("ユーザー123")).toThrow(
        "ユーザー名は英数字のみ使用可能です",
      );
    });

    it("記号を含むUsernameを作成しようとするとエラーが発生する", () => {
      expect(() => createUsernameOrThrow("user@123")).toThrow(
        "ユーザー名は英数字のみ使用可能です",
      );
    });

    it("空白を含むUsernameを作成しようとするとエラーが発生する", () => {
      expect(() => createUsernameOrThrow("user 123")).toThrow(
        "ユーザー名は英数字のみ使用可能です",
      );
    });

    it("nullでUsernameを作成しようとするとエラーが発生する", () => {
      expect(() => createUsernameOrThrow(null as unknown as string)).toThrow(
        "ユーザー名は空であってはいけません",
      );
    });

    it("undefinedでUsernameを作成しようとするとエラーが発生する", () => {
      expect(() =>
        createUsernameOrThrow(undefined as unknown as string),
      ).toThrow("ユーザー名は空であってはいけません");
    });
  });

  describe("等価性", () => {
    it("同じUsernameは等しい", () => {
      const username1 = createUsernameOrThrow("user123");
      const username2 = createUsernameOrThrow("user123");
      expect(isUsernameEqual(username1, username2)).toBe(true);
    });

    it("異なるUsernameは等しくない", () => {
      const username1 = createUsernameOrThrow("user123");
      const username2 = createUsernameOrThrow("user456");
      expect(isUsernameEqual(username1, username2)).toBe(false);
    });

    it("大文字小文字が異なるUsernameは等しくない", () => {
      const username1 = createUsernameOrThrow("user123");
      const username2 = createUsernameOrThrow("USER123");
      expect(isUsernameEqual(username1, username2)).toBe(false);
    });
  });

  describe("文字列変換", () => {
    it("文字列として取得できる", () => {
      const username = createUsernameOrThrow("testuser");
      expect(usernameToString(username)).toBe("testuser");
    });
  });

  describe("長さ取得", () => {
    it("ユーザー名の長さを取得できる", () => {
      const username = createUsernameOrThrow("user123");
      expect(getUsernameLength(username)).toBe(7);
    });
  });
});
