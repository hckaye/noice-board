import { describe, it, expect } from 'vitest'
import { UserId } from '../../../src/domain/value-objects/UserId'

describe('UserId', () => {
  describe('正常なケース', () => {
    it('UUIDでUserIdを作成できる', () => {
      const id = UserId.create('550e8400-e29b-41d4-a716-446655440000')
      expect(id.getValue()).toBe('550e8400-e29b-41d4-a716-446655440000')
    })

    it('新しいUserIdを生成できる', () => {
      const id = UserId.generate()
      expect(id.getValue()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })
  })

  describe('異常なケース', () => {
    it('空文字列でUserIdを作成しようとするとエラーが発生する', () => {
      expect(() => UserId.create('')).toThrow('UserIdは空であってはいけません')
    })

    it('無効なUUID形式でUserIdを作成しようとするとエラーが発生する', () => {
      expect(() => UserId.create('invalid-uuid')).toThrow('UserIdはUUID形式である必要があります')
    })

    it('nullでUserIdを作成しようとするとエラーが発生する', () => {
      expect(() => UserId.create(null as unknown as string)).toThrow('UserIdは空であってはいけません')
    })

    it('undefinedでUserIdを作成しようとするとエラーが発生する', () => {
      expect(() => UserId.create(undefined as unknown as string)).toThrow('UserIdは空であってはいけません')
    })
  })

  describe('等価性', () => {
    it('同じIDのUserIdは等しい', () => {
      const id1 = UserId.create('550e8400-e29b-41d4-a716-446655440000')
      const id2 = UserId.create('550e8400-e29b-41d4-a716-446655440000')
      expect(id1.equals(id2)).toBe(true)
    })

    it('異なるIDのUserIdは等しくない', () => {
      const id1 = UserId.create('550e8400-e29b-41d4-a716-446655440000')
      const id2 = UserId.create('550e8400-e29b-41d4-a716-446655440001')
      expect(id1.equals(id2)).toBe(false)
    })

    it('生成された2つのUserIdは異なる', () => {
      const id1 = UserId.generate()
      const id2 = UserId.generate()
      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('文字列変換', () => {
    it('文字列として取得できる', () => {
      const id = UserId.create('550e8400-e29b-41d4-a716-446655440000')
      expect(id.toString()).toBe('550e8400-e29b-41d4-a716-446655440000')
    })
  })
})
