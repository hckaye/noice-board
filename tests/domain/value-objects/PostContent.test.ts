import { describe, it, expect } from 'vitest'
import { PostContent } from '../../../src/domain/value-objects/PostContent'

describe('PostContent', () => {
  describe('正常なケース', () => {
    it('有効な長さの本文でPostContentを作成できる', () => {
      const content = PostContent.create('これは有効な投稿の本文です。')
      expect(content.getValue()).toBe('これは有効な投稿の本文です。')
    })

    it('1文字の本文でPostContentを作成できる', () => {
      const content = PostContent.create('A')
      expect(content.getValue()).toBe('A')
    })

    it('1000文字の本文でPostContentを作成できる', () => {
      const longContent = 'A'.repeat(1000)
      const content = PostContent.create(longContent)
      expect(content.getValue()).toBe(longContent)
    })

    it('日本語の本文でPostContentを作成できる', () => {
      const content = PostContent.create('こんにちは、投稿掲示板です。\n複数行の投稿も可能です。')
      expect(content.getValue()).toBe('こんにちは、投稿掲示板です。\n複数行の投稿も可能です。')
    })

    it('改行を含む本文でPostContentを作成できる', () => {
      const content = PostContent.create('1行目\n2行目\n3行目')
      expect(content.getValue()).toBe('1行目\n2行目\n3行目')
    })

    it('記号を含む本文でPostContentを作成できる', () => {
      const content = PostContent.create('こんにちは！@#$%^&*()_+{}|:"<>?[]\\;\',./')
      expect(content.getValue()).toBe('こんにちは！@#$%^&*()_+{}|:"<>?[]\\;\',./')
    })
  })

  describe('異常なケース', () => {
    it('空文字列でPostContentを作成しようとするとエラーが発生する', () => {
      expect(() => PostContent.create('')).toThrow('本文は空であってはいけません')
    })

    it('空白のみの文字列でPostContentを作成しようとするとエラーが発生する', () => {
      expect(() => PostContent.create('   \n\t  ')).toThrow('本文は空であってはいけません')
    })

    it('1001文字以上の本文でPostContentを作成しようとするとエラーが発生する', () => {
      const tooLongContent = 'A'.repeat(1001)
      expect(() => PostContent.create(tooLongContent)).toThrow('本文は1000文字以下である必要があります')
    })

    it('nullでPostContentを作成しようとするとエラーが発生する', () => {
      expect(() => PostContent.create(null as unknown as string)).toThrow('本文は空であってはいけません')
    })

    it('undefinedでPostContentを作成しようとするとエラーが発生する', () => {
      expect(() => PostContent.create(undefined as unknown as string)).toThrow('本文は空であってはいけません')
    })
  })

  describe('等価性', () => {
    it('同じ本文のPostContentは等しい', () => {
      const content1 = PostContent.create('同じ本文です')
      const content2 = PostContent.create('同じ本文です')
      expect(content1.equals(content2)).toBe(true)
    })

    it('異なる本文のPostContentは等しくない', () => {
      const content1 = PostContent.create('本文1')
      const content2 = PostContent.create('本文2')
      expect(content1.equals(content2)).toBe(false)
    })

    it('改行の違いで異なるPostContentは等しくない', () => {
      const content1 = PostContent.create('1行目\n2行目')
      const content2 = PostContent.create('1行目 2行目')
      expect(content1.equals(content2)).toBe(false)
    })
  })

  describe('文字列変換', () => {
    it('文字列として取得できる', () => {
      const content = PostContent.create('テスト本文')
      expect(content.toString()).toBe('テスト本文')
    })
  })

  describe('長さ取得', () => {
    it('本文の長さを取得できる', () => {
      const content = PostContent.create('テスト本文')
      expect(content.getLength()).toBe(5)
    })

    it('改行を含む本文の長さを正確に取得できる', () => {
      const content = PostContent.create('1行目\n2行目')
      expect(content.getLength()).toBe(7) // '1行目' + '\n' + '2行目' = 3 + 1 + 3 = 7
    })
  })

  describe('行数取得', () => {
    it('単一行の本文の行数を取得できる', () => {
      const content = PostContent.create('単一行のテキスト')
      expect(content.getLineCount()).toBe(1)
    })

    it('複数行の本文の行数を取得できる', () => {
      const content = PostContent.create('1行目\n2行目\n3行目')
      expect(content.getLineCount()).toBe(3)
    })

    it('空行を含む本文の行数を正確に取得できる', () => {
      const content = PostContent.create('1行目\n\n3行目')
      expect(content.getLineCount()).toBe(3)
    })
  })
})
