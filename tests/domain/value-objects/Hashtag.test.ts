/**
 * ハッシュタグ値オブジェクトのテスト
 */

import { describe, it, expect } from "vitest";
import {
  createHashtag,
  getHashtagValue,
  isHashtagEqual,
  createHashtagList,
  addHashtagToList,
  removeHashtagFromList,
  getHashtagListAsStringArray,
  getHashtagListCount,
  hasHashtagInList,
  createEmptyHashtagList,
} from "../../../src/domain/value-objects/Hashtag";

describe("Hashtag Value Object", () => {
  describe("createHashtag", () => {
    it("有効なハッシュタグを作成できる", () => {
      const hashtag = createHashtag("#test");
      expect(getHashtagValue(hashtag)).toBe("#test");
    });

    it("英数字を含むハッシュタグを作成できる", () => {
      const hashtag = createHashtag("#test123");
      expect(getHashtagValue(hashtag)).toBe("#test123");
    });

    it("ハイフンを含むハッシュタグを作成できる", () => {
      const hashtag = createHashtag("#test-hashtag");
      expect(getHashtagValue(hashtag)).toBe("#test-hashtag");
    });

    it("アンダースコアを含むハッシュタグを作成できる", () => {
      const hashtag = createHashtag("#test_hashtag");
      expect(getHashtagValue(hashtag)).toBe("#test_hashtag");
    });

    it("空文字列の場合はエラーをスローする", () => {
      expect(() => createHashtag("")).toThrow("ハッシュタグが空です");
    });

    it("#で始まらない場合はエラーをスローする", () => {
      expect(() => createHashtag("test")).toThrow(
        "ハッシュタグは#で始まり、英数字、日本語、ハイフン、アンダースコアのみ使用できます"
      );
    });

    it("50文字を超える場合はエラーをスローする", () => {
      const longHashtag = "#" + "a".repeat(50);
      expect(() => createHashtag(longHashtag)).toThrow(
        "ハッシュタグは50文字以下である必要があります"
      );
    });

    it("無効な文字を含む場合はエラーをスローする", () => {
      expect(() => createHashtag("#test@")).toThrow(
        "ハッシュタグは#で始まり、英数字、日本語、ハイフン、アンダースコアのみ使用できます"
      );
    });
  });

  describe("isHashtagEqual", () => {
    it("同じハッシュタグの場合はtrueを返す", () => {
      const hashtag1 = createHashtag("#test");
      const hashtag2 = createHashtag("#test");
      expect(isHashtagEqual(hashtag1, hashtag2)).toBe(true);
    });

    it("異なるハッシュタグの場合はfalseを返す", () => {
      const hashtag1 = createHashtag("#test1");
      const hashtag2 = createHashtag("#test2");
      expect(isHashtagEqual(hashtag1, hashtag2)).toBe(false);
    });
  });

  describe("createHashtagList", () => {
    it("空のリストを作成できる", () => {
      const list = createHashtagList([]);
      expect(getHashtagListCount(list)).toBe(0);
    });

    it("ハッシュタグのリストを作成できる", () => {
      const list = createHashtagList(["#test1", "#test2", "#test3"]);
      expect(getHashtagListCount(list)).toBe(3);
      expect(getHashtagListAsStringArray(list)).toEqual(["#test1", "#test2", "#test3"]);
    });

    it("重複するハッシュタグは除去される", () => {
      const list = createHashtagList(["#test1", "#test2", "#test1"]);
      expect(getHashtagListCount(list)).toBe(2);
      expect(getHashtagListAsStringArray(list)).toEqual(["#test1", "#test2"]);
    });
  });

  describe("addHashtagToList", () => {
    it("新しいハッシュタグをリストに追加できる", () => {
      const list = createHashtagList(["#test1"]);
      const newList = addHashtagToList(list, "#test2");
      expect(getHashtagListCount(newList)).toBe(2);
      expect(hasHashtagInList(newList, "#test2")).toBe(true);
    });

    it("既存のハッシュタグは追加されない", () => {
      const list = createHashtagList(["#test1", "#test2"]);
      const newList = addHashtagToList(list, "#test1");
      expect(getHashtagListCount(newList)).toBe(2);
      expect(getHashtagListAsStringArray(newList)).toEqual(["#test1", "#test2"]);
    });
  });

  describe("removeHashtagFromList", () => {
    it("指定されたハッシュタグをリストから削除できる", () => {
      const list = createHashtagList(["#test1", "#test2", "#test3"]);
      const newList = removeHashtagFromList(list, "#test2");
      expect(getHashtagListCount(newList)).toBe(2);
      expect(hasHashtagInList(newList, "#test2")).toBe(false);
      expect(getHashtagListAsStringArray(newList)).toEqual(["#test1", "#test3"]);
    });

    it("存在しないハッシュタグを削除しようとしても元のリストが返される", () => {
      const list = createHashtagList(["#test1", "#test2"]);
      const newList = removeHashtagFromList(list, "#test3");
      expect(getHashtagListCount(newList)).toBe(2);
      expect(getHashtagListAsStringArray(newList)).toEqual(["#test1", "#test2"]);
    });
  });

  describe("hasHashtagInList", () => {
    it("リストに含まれるハッシュタグの場合はtrueを返す", () => {
      const list = createHashtagList(["#test1", "#test2"]);
      expect(hasHashtagInList(list, "#test1")).toBe(true);
    });

    it("リストに含まれないハッシュタグの場合はfalseを返す", () => {
      const list = createHashtagList(["#test1", "#test2"]);
      expect(hasHashtagInList(list, "#test3")).toBe(false);
    });

    it("無効なハッシュタグの場合はfalseを返す", () => {
      const list = createHashtagList(["#test1", "#test2"]);
      expect(hasHashtagInList(list, "invalid")).toBe(false);
    });
  });

  describe("createEmptyHashtagList", () => {
    it("空のハッシュタグリストを作成できる", () => {
      const list = createEmptyHashtagList();
      expect(getHashtagListCount(list)).toBe(0);
      expect(getHashtagListAsStringArray(list)).toEqual([]);
    });
  });
});
