import { describe, it, expect } from 'vitest'
import {
  createComment,
  getCommentId,
  getCommentContent,
  getCommentAuthorId,
  getCommentCreatedAt,
  getCommentAuthorIdAsString,
  isCommentEqual,
  isValidComment
} from '../../../src/domain/value-objects/Comment'
import { createUserIdOrThrow } from '../../../src/domain/value-objects/UserId'

describe('Comment', () => {
  const authorId = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440000')
  const validContent = 'これは有効なコメントです。'

  describe('createComment', () => {
    it('有効な内容でコメントを作成できる', () => {
      const comment = createComment(validContent, authorId)
      
      expect(getCommentContent(comment)).toBe(validContent)
      expect(getCommentAuthorId(comment)).toBe(authorId)
      expect(getCommentId(comment)).toBeDefined()
      expect(getCommentCreatedAt(comment)).toBeInstanceOf(Date)
    })

    it('最小文字数（1文字）でコメントを作成できる', () => {
      const comment = createComment('a', authorId)
      
      expect(getCommentContent(comment)).toBe('a')
    })

    it('最大文字数（1000文字）でコメントを作成できる', () => {
      const longContent = 'a'.repeat(1000)
      const comment = createComment(longContent, authorId)
      
      expect(getCommentContent(comment)).toBe(longContent)
    })

    it('空文字でエラーが発生する', () => {
      expect(() => createComment('', authorId)).toThrow('コメントは1-1000文字である必要があります')
    })

    it('1001文字でエラーが発生する', () => {
      const tooLongContent = 'a'.repeat(1001)
      expect(() => createComment(tooLongContent, authorId)).toThrow('コメントは1-1000文字である必要があります')
    })
  })

  describe('getCommentAuthorIdAsString', () => {
    it('投稿者IDを文字列として取得できる', () => {
      const comment = createComment(validContent, authorId)
      
      expect(getCommentAuthorIdAsString(comment)).toBe('550e8400-e29b-41d4-a716-446655440000')
    })
  })

  describe('isCommentEqual', () => {
    it('同じIDのコメントは等しい', () => {
      const comment1 = createComment(validContent, authorId)
      const comment2 = { ...comment1 }
      
      expect(isCommentEqual(comment1, comment2)).toBe(true)
    })

    it('異なるIDのコメントは等しくない', () => {
      const comment1 = createComment(validContent, authorId)
      const comment2 = createComment(validContent, authorId)
      
      expect(isCommentEqual(comment1, comment2)).toBe(false)
    })
  })

  describe('isValidComment', () => {
    it('有効な文字数の場合はtrueを返す', () => {
      expect(isValidComment('a')).toBe(true)
      expect(isValidComment(validContent)).toBe(true)
      expect(isValidComment('a'.repeat(1000))).toBe(true)
    })

    it('無効な文字数の場合はfalseを返す', () => {
      expect(isValidComment('')).toBe(false)
      expect(isValidComment('a'.repeat(1001))).toBe(false)
    })
  })

  describe('プロパティアクセス', () => {
    it('作成されたコメントのすべてのプロパティにアクセスできる', () => {
      const comment = createComment(validContent, authorId)
      
      expect(typeof getCommentId(comment)).toBe('string')
      expect(getCommentContent(comment)).toBe(validContent)
      expect(getCommentAuthorId(comment)).toBe(authorId)
      expect(getCommentCreatedAt(comment)).toBeInstanceOf(Date)
    })
  })

  describe('コメント内容の境界値テスト', () => {
    it('日本語の長いコメントも正しく処理できる', () => {
      const japaneseContent = 'これは日本語のコメントです。'.repeat(20) // 約500文字
      const comment = createComment(japaneseContent, authorId)
      
      expect(getCommentContent(comment)).toBe(japaneseContent)
    })

    it('特殊文字を含むコメントも正しく処理できる', () => {
      const specialContent = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const comment = createComment(specialContent, authorId)
      
      expect(getCommentContent(comment)).toBe(specialContent)
    })
  })
})
