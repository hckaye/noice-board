import { describe, it, expect } from 'vitest'
import { PostId } from '../../../src/domain/value-objects/PostId'

describe('PostId', () => {
  describe('正常なケース', () => {
    it('UUIDでPostIdを作成できる', () => {
      const id = PostId.create('550e8400-e29b-41d4-a716-446655440000')
      expect(id.getValue()).toBe('550e8400-e29b-41d4-a716-446655440000')
    })

    it('新しいPostIdを生成できる', () => {
      const id = PostId.generate()
      expect(id.getValue()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })
  })

  describe('異常なケース', () => {
    it('空文字列でPostIdを作成しようとするとエラーが発生する', () => {
      expect(() => PostId.create('')).toThrow('PostIdは空であってはいけません')
    })

    it('無効なUUID形式でPostIdを作成しようとするとエラーが発生する', () => {
      expect(() => PostId.create('invalid-uuid')).toThrow('PostIdはUUID形式である必要があります')
    })

    it('nullでPostIdを作成しようとするとエラーが発生する', () => {
      expect(() => PostId.create(null as unknown as string)).toThrow('PostIdは空であってはいけません')
    })

    it('undefinedでPostIdを作成しようとするとエラーが発生する', () => {
      expect(() => PostId.create(undefined as unknown as string)).toThrow('PostIdは空であってはいけません')
    })
  })

  describe('等価性', () => {
    it('同じIDのPostIdは等しい', () => {
      const id1 = PostId.create('550e8400-e29b-41d4-a716-446655440000')
      const id2 = PostId.create('550e8400-e29b-41d4-a716-446655440000')
      expect(id1.equals(id2)).toBe(true)
    })

    it('異なるIDのPostIdは等しくない', () => {
      const id1 = PostId.create('550e8400-e29b-41d4-a716-446655440000')
      const id2 = PostId.create('550e8400-e29b-41d4-a716-446655440001')
      expect(id1.equals(id2)).toBe(false)
    })

    it('生成された2つのPostIdは異なる', () => {
      const id1 = PostId.generate()
      const id2 = PostId.generate()
      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('文字列変換', () => {
    it('文字列として取得できる', () => {
      const id = PostId.create('550e8400-e29b-41d4-a716-446655440000')
      expect(id.toString()).toBe('550e8400-e29b-41d4-a716-446655440000')
    })
  })
})
