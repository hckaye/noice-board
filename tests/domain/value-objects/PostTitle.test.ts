import { describe, it, expect } from 'vitest'
import { PostTitle } from '../../../src/domain/value-objects/PostTitle'

describe('PostTitle', () => {
  describe('正常なケース', () => {
    it('有効な長さのタイトルでPostTitleを作成できる', () => {
      const title = PostTitle.create('有効なタイトル')
      expect(title.getValue()).toBe('有効なタイトル')
    })

    it('1文字のタイトルでPostTitleを作成できる', () => {
      const title = PostTitle.create('A')
      expect(title.getValue()).toBe('A')
    })

    it('100文字のタイトルでPostTitleを作成できる', () => {
      const longTitle = 'A'.repeat(100)
      const title = PostTitle.create(longTitle)
      expect(title.getValue()).toBe(longTitle)
    })

    it('日本語のタイトルでPostTitleを作成できる', () => {
      const title = PostTitle.create('こんにちは投稿掲示板')
      expect(title.getValue()).toBe('こんにちは投稿掲示板')
    })
  })

  describe('異常なケース', () => {
    it('空文字列でPostTitleを作成しようとするとエラーが発生する', () => {
      expect(() => PostTitle.create('')).toThrow('タイトルは空であってはいけません')
    })

    it('空白のみの文字列でPostTitleを作成しようとするとエラーが発生する', () => {
      expect(() => PostTitle.create('   ')).toThrow('タイトルは空であってはいけません')
    })

    it('101文字以上のタイトルでPostTitleを作成しようとするとエラーが発生する', () => {
      const tooLongTitle = 'A'.repeat(101)
      expect(() => PostTitle.create(tooLongTitle)).toThrow('タイトルは100文字以下である必要があります')
    })

    it('nullでPostTitleを作成しようとするとエラーが発生する', () => {
      expect(() => PostTitle.create(null as unknown as string)).toThrow('タイトルは空であってはいけません')
    })

    it('undefinedでPostTitleを作成しようとするとエラーが発生する', () => {
      expect(() => PostTitle.create(undefined as unknown as string)).toThrow('タイトルは空であってはいけません')
    })
  })

  describe('等価性', () => {
    it('同じタイトルのPostTitleは等しい', () => {
      const title1 = PostTitle.create('同じタイトル')
      const title2 = PostTitle.create('同じタイトル')
      expect(title1.equals(title2)).toBe(true)
    })

    it('異なるタイトルのPostTitleは等しくない', () => {
      const title1 = PostTitle.create('タイトル1')
      const title2 = PostTitle.create('タイトル2')
      expect(title1.equals(title2)).toBe(false)
    })
  })

  describe('文字列変換', () => {
    it('文字列として取得できる', () => {
      const title = PostTitle.create('テストタイトル')
      expect(title.toString()).toBe('テストタイトル')
    })
  })

  describe('長さ取得', () => {
    it('タイトルの長さを取得できる', () => {
      const title = PostTitle.create('テスト')
      expect(title.getLength()).toBe(3)
    })

    it('英字のタイトルの長さを取得できる', () => {
      const title = PostTitle.create('Hello')
      expect(title.getLength()).toBe(5)
    })
  })
})
