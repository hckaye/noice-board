import { describe, it, expect } from 'vitest'
import { User } from '../../../src/domain/entities/User'
import { UserId } from '../../../src/domain/value-objects/UserId'
import { Username } from '../../../src/domain/value-objects/Username'
import { NoiceAmount } from '../../../src/domain/value-objects/NoiceAmount'

describe('User', () => {
  const userId = UserId.create('550e8400-e29b-41d4-a716-446655440000')
  const username = Username.create('testuser')
  const displayName = 'テストユーザー'
  const noiceAmount = NoiceAmount.create(1000)
  const now = new Date()

  describe('ユーザーの作成', () => {
    it('有効な値でUserを作成できる', () => {
      const user = User.create(userId, username, displayName, noiceAmount, now)

      expect(user.getId().equals(userId)).toBe(true)
      expect(user.getUsername().equals(username)).toBe(true)
      expect(user.getDisplayName()).toBe(displayName)
      expect(user.getNoiceAmount().equals(noiceAmount)).toBe(true)
      expect(user.getCreatedAt()).toBe(now)
    })

    it('新しいUserを生成できる', () => {
      const newUser = User.createNew(username, displayName, noiceAmount)

      expect(newUser.getUsername().equals(username)).toBe(true)
      expect(newUser.getDisplayName()).toBe(displayName)
      expect(newUser.getNoiceAmount().equals(noiceAmount)).toBe(true)
      expect(newUser.getCreatedAt()).toBeInstanceOf(Date)
    })
  })

  describe('いいねの操作', () => {
    it('いいねを追加できる', () => {
      const user = User.create(userId, username, displayName, noiceAmount, now)
      const addAmount = NoiceAmount.create(500)

      user.addNoice(addAmount)

      expect(user.getNoiceAmount().getValue()).toBe(1500)
    })

    it('いいねを減少できる', () => {
      const user = User.create(userId, username, displayName, noiceAmount, now)
      const subtractAmount = NoiceAmount.create(300)

      user.subtractNoice(subtractAmount)

      expect(user.getNoiceAmount().getValue()).toBe(700)
    })

    it('所持いいね数を超える減少はエラーになる', () => {
      const user = User.create(userId, username, displayName, noiceAmount, now)
      const subtractAmount = NoiceAmount.create(1500)

      expect(() => user.subtractNoice(subtractAmount)).toThrow('所持いいね数が不足しています')
    })

    it('いいねが足りているかチェックできる', () => {
      const user = User.create(userId, username, displayName, noiceAmount, now)
      const checkAmount1 = NoiceAmount.create(500)
      const checkAmount2 = NoiceAmount.create(1500)

      expect(user.hasEnoughNoice(checkAmount1)).toBe(true)
      expect(user.hasEnoughNoice(checkAmount2)).toBe(false)
    })
  })

  describe('表示名の更新', () => {
    it('表示名を更新できる', () => {
      const user = User.create(userId, username, displayName, noiceAmount, now)
      const newDisplayName = '新しい表示名'

      user.updateDisplayName(newDisplayName)

      expect(user.getDisplayName()).toBe(newDisplayName)
    })

    it('空の表示名に更新しようとするとエラーになる', () => {
      const user = User.create(userId, username, displayName, noiceAmount, now)

      expect(() => user.updateDisplayName('')).toThrow('表示名は空であってはいけません')
    })

    it('100文字を超える表示名に更新しようとするとエラーになる', () => {
      const user = User.create(userId, username, displayName, noiceAmount, now)
      const longDisplayName = 'あ'.repeat(101)

      expect(() => user.updateDisplayName(longDisplayName)).toThrow('表示名は100文字以下である必要があります')
    })
  })

  describe('等価性', () => {
    it('同じIDのUserは等しい', () => {
      const user1 = User.create(userId, username, displayName, noiceAmount, now)
      const user2 = User.create(userId, Username.create('different'), 'Different', NoiceAmount.create(2000), new Date())

      expect(user1.equals(user2)).toBe(true)
    })

    it('異なるIDのUserは等しくない', () => {
      const differentUserId = UserId.create('550e8400-e29b-41d4-a716-446655440001')
      const user1 = User.create(userId, username, displayName, noiceAmount, now)
      const user2 = User.create(differentUserId, username, displayName, noiceAmount, now)

      expect(user1.equals(user2)).toBe(false)
    })
  })

  describe('不変条件', () => {
    it('いいね数は常に0以上である', () => {
      const user = User.create(userId, username, displayName, NoiceAmount.create(100), now)
      const subtractAmount = NoiceAmount.create(150)

      expect(() => user.subtractNoice(subtractAmount)).toThrow('所持いいね数が不足しています')
      expect(user.getNoiceAmount().getValue()).toBe(100) // 変更されていない
    })
  })
})
