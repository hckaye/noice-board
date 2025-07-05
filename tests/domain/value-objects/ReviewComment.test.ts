import { describe, it, expect } from 'vitest'
import {
  createReviewComment,
  getReviewCommentId,
  getReviewCommentContent,
  getReviewCommentReviewerId,
  getReviewCommentCreatedAt,
  getReviewCommentReviewerIdAsString,
  isReviewCommentEqual,
  isValidReviewComment
} from '../../../src/domain/value-objects/ReviewComment'
import { createUserIdOrThrow } from '../../../src/domain/value-objects/UserId'

describe('ReviewComment', () => {
  const reviewerId = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440000')
  const validContent = 'これは有効なレビューコメントです。'

  describe('createReviewComment', () => {
    it('有効な内容でレビューコメントを作成できる', () => {
      const comment = createReviewComment(validContent, reviewerId)
      
      expect(getReviewCommentContent(comment)).toBe(validContent)
      expect(getReviewCommentReviewerId(comment)).toBe(reviewerId)
      expect(getReviewCommentId(comment)).toBeDefined()
      expect(getReviewCommentCreatedAt(comment)).toBeInstanceOf(Date)
    })

    it('最小文字数（1文字）でレビューコメントを作成できる', () => {
      const comment = createReviewComment('a', reviewerId)
      
      expect(getReviewCommentContent(comment)).toBe('a')
    })

    it('最大文字数（500文字）でレビューコメントを作成できる', () => {
      const longContent = 'a'.repeat(500)
      const comment = createReviewComment(longContent, reviewerId)
      
      expect(getReviewCommentContent(comment)).toBe(longContent)
    })

    it('空文字でエラーが発生する', () => {
      expect(() => createReviewComment('', reviewerId)).toThrow('レビューコメントは1-500文字である必要があります')
    })

    it('501文字でエラーが発生する', () => {
      const tooLongContent = 'a'.repeat(501)
      expect(() => createReviewComment(tooLongContent, reviewerId)).toThrow('レビューコメントは1-500文字である必要があります')
    })
  })

  describe('getReviewCommentReviewerIdAsString', () => {
    it('レビュアーIDを文字列として取得できる', () => {
      const comment = createReviewComment(validContent, reviewerId)
      
      expect(getReviewCommentReviewerIdAsString(comment)).toBe('550e8400-e29b-41d4-a716-446655440000')
    })
  })

  describe('isReviewCommentEqual', () => {
    it('同じIDのコメントは等しい', () => {
      const comment1 = createReviewComment(validContent, reviewerId)
      const comment2 = { ...comment1 }
      
      expect(isReviewCommentEqual(comment1, comment2)).toBe(true)
    })

    it('異なるIDのコメントは等しくない', () => {
      const comment1 = createReviewComment(validContent, reviewerId)
      const comment2 = createReviewComment(validContent, reviewerId)
      
      expect(isReviewCommentEqual(comment1, comment2)).toBe(false)
    })
  })

  describe('isValidReviewComment', () => {
    it('有効な文字数の場合はtrueを返す', () => {
      expect(isValidReviewComment('a')).toBe(true)
      expect(isValidReviewComment(validContent)).toBe(true)
      expect(isValidReviewComment('a'.repeat(500))).toBe(true)
    })

    it('無効な文字数の場合はfalseを返す', () => {
      expect(isValidReviewComment('')).toBe(false)
      expect(isValidReviewComment('a'.repeat(501))).toBe(false)
    })
  })

  describe('プロパティアクセス', () => {
    it('作成されたコメントのすべてのプロパティにアクセスできる', () => {
      const comment = createReviewComment(validContent, reviewerId)
      
      expect(typeof getReviewCommentId(comment)).toBe('string')
      expect(getReviewCommentContent(comment)).toBe(validContent)
      expect(getReviewCommentReviewerId(comment)).toBe(reviewerId)
      expect(getReviewCommentCreatedAt(comment)).toBeInstanceOf(Date)
    })
  })
})
