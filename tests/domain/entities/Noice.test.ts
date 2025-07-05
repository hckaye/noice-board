import { describe, it, expect } from 'vitest'
import {
  createNoice,
  createNewNoice,
  createNewNoiceWithComment,
  getNoiceId,
  getNoiceFromUserId,
  getNoicePostId,
  getNoiceAmountFromNoice,
  getNoiceComment,
  getNoiceCreatedAt,
  hasNoiceComment,
  isNoiceFromUser,
  isNoiceToPost,
  isNoiceEqual,
  getNoiceIdAsString,
  getNoiceFromUserIdAsString,
  getNoicePostIdAsString,
  getNoiceAmountAsNumber,
  createNoiceId,
  generateNewNoiceId,
  getNoiceIdValue,
  isNoiceIdEqual,
  getNoiceNoices,
  getNoiceNoiceCount,
  addNoiceToNoice,
  getNoiceTotalAmount,
  getNoiceNoicesByUser,
} from '../../../src/domain/entities/Noice'
import { createUserIdOrThrow } from '../../../src/domain/value-objects/UserId'
import { createPostIdOrThrow } from '../../../src/domain/value-objects/PostId'
import { createNoiceAmountOrThrow } from '../../../src/domain/value-objects/NoiceAmount'

describe('Noice', () => {
  const fromUserId = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440001')
  const postId = createPostIdOrThrow('550e8400-e29b-41d4-a716-446655440002')
  const amount = createNoiceAmountOrThrow(100)
  const noiceId = generateNewNoiceId()
  const now = new Date()

  describe('NoiceID', () => {
    it('有効な値でNoiceIDを作成できる', () => {
      const id = createNoiceId('550e8400-e29b-41d4-a716-446655440000')
      
      expect(getNoiceIdValue(id)).toBe('550e8400-e29b-41d4-a716-446655440000')
    })

    it('空文字でエラーが発生する', () => {
      expect(() => createNoiceId('')).toThrow('NoiceIDは空文字にできません')
      expect(() => createNoiceId('   ')).toThrow('NoiceIDは空文字にできません')
    })

    it('新しいNoiceIDを生成できる', () => {
      const id1 = generateNewNoiceId()
      const id2 = generateNewNoiceId()
      
      expect(getNoiceIdValue(id1)).toBeDefined()
      expect(getNoiceIdValue(id2)).toBeDefined()
      expect(isNoiceIdEqual(id1, id2)).toBe(false)
    })

    it('NoiceIDの等価性を判定できる', () => {
      const id1 = createNoiceId('test-id')
      const id2 = createNoiceId('test-id')
      const id3 = createNoiceId('different-id')
      
      expect(isNoiceIdEqual(id1, id2)).toBe(true)
      expect(isNoiceIdEqual(id1, id3)).toBe(false)
    })
  })

  describe('投稿へのいいね作成', () => {
    it('有効な値でNoiceを作成できる', () => {
      const noice = createNoice(noiceId, fromUserId, postId, amount, undefined, [], now)

      expect(getNoiceId(noice)).toBe(noiceId)
      expect(getNoiceFromUserId(noice)).toBe(fromUserId)
      expect(getNoicePostId(noice)).toBe(postId)
      expect(getNoiceAmountFromNoice(noice)).toBe(amount)
      expect(getNoiceComment(noice)).toBeUndefined()
      expect(getNoiceNoiceCount(noice)).toBe(0)
      expect(getNoiceCreatedAt(noice)).toBe(now)
    })

    it('コメント付きでNoiceを作成できる', () => {
      const comment = 'いいね！'
      const noice = createNoice(noiceId, fromUserId, postId, amount, comment, [], now)

      expect(getNoiceComment(noice)).toBe(comment)
      expect(hasNoiceComment(noice)).toBe(true)
    })

    it('新しいNoiceを生成できる（コメントなし）', () => {
      const noice = createNewNoice(fromUserId, postId, amount)

      expect(getNoiceFromUserId(noice)).toBe(fromUserId)
      expect(getNoicePostId(noice)).toBe(postId)
      expect(getNoiceAmountFromNoice(noice)).toBe(amount)
      expect(getNoiceComment(noice)).toBeUndefined()
      expect(hasNoiceComment(noice)).toBe(false)
      expect(getNoiceCreatedAt(noice)).toBeInstanceOf(Date)
    })

    it('新しいNoiceを生成できる（コメント付き）', () => {
      const comment = '素晴らしい投稿ですね！'
      const noice = createNewNoiceWithComment(fromUserId, postId, amount, comment)

      expect(getNoiceFromUserId(noice)).toBe(fromUserId)
      expect(getNoicePostId(noice)).toBe(postId)
      expect(getNoiceAmountFromNoice(noice)).toBe(amount)
      expect(getNoiceComment(noice)).toBe(comment)
      expect(hasNoiceComment(noice)).toBe(true)
      expect(getNoiceCreatedAt(noice)).toBeInstanceOf(Date)
    })
  })

  describe('コメント付きいいねのバリデーション', () => {
    it('空文字のコメントでエラーが発生する', () => {
      expect(() => createNewNoiceWithComment(fromUserId, postId, amount, ''))
        .toThrow('コメントが空の場合はcreateNewNoiceを使用してください')
      
      expect(() => createNewNoiceWithComment(fromUserId, postId, amount, '   '))
        .toThrow('コメントが空の場合はcreateNewNoiceを使用してください')
    })

    it('200文字を超えるコメントでエラーが発生する', () => {
      const longComment = 'あ'.repeat(201)
      
      expect(() => createNewNoiceWithComment(fromUserId, postId, amount, longComment))
        .toThrow('いいねのコメントは200文字以内である必要があります')
    })

    it('200文字ちょうどのコメントは有効', () => {
      const maxComment = 'あ'.repeat(200)
      const noice = createNewNoiceWithComment(fromUserId, postId, amount, maxComment)
      
      expect(getNoiceComment(noice)).toBe(maxComment)
    })

    it('前後の空白は自動的に削除される', () => {
      const comment = '  素晴らしい！  '
      const noice = createNewNoiceWithComment(fromUserId, postId, amount, comment)
      
      expect(getNoiceComment(noice)).toBe('素晴らしい！')
    })
  })

  describe('ユーザー・投稿判定', () => {
    it('指定されたユーザーがいいねを送ったかどうか判定できる', () => {
      const noice = createNewNoice(fromUserId, postId, amount)
      const otherUserId = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440003')

      expect(isNoiceFromUser(noice, fromUserId)).toBe(true)
      expect(isNoiceFromUser(noice, otherUserId)).toBe(false)
    })

    it('指定された投稿にいいねが付けられたかどうか判定できる', () => {
      const noice = createNewNoice(fromUserId, postId, amount)
      const otherPostId = createPostIdOrThrow('550e8400-e29b-41d4-a716-446655440004')

      expect(isNoiceToPost(noice, postId)).toBe(true)
      expect(isNoiceToPost(noice, otherPostId)).toBe(false)
    })
  })

  describe('等価性', () => {
    it('同じIDのNoiceは等しい', () => {
      const noice1 = createNoice(noiceId, fromUserId, postId, amount, undefined, [], now)
      const noice2 = createNoice(
        noiceId,
        createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440003'),
        createPostIdOrThrow('550e8400-e29b-41d4-a716-446655440004'),
        createNoiceAmountOrThrow(200),
        'different comment',
        [],
        new Date()
      )

      expect(isNoiceEqual(noice1, noice2)).toBe(true)
    })

    it('異なるIDのNoiceは等しくない', () => {
      const noice1 = createNewNoice(fromUserId, postId, amount)
      const noice2 = createNewNoice(fromUserId, postId, amount)

      expect(isNoiceEqual(noice1, noice2)).toBe(false)
    })
  })

  describe('文字列変換', () => {
    it('各種IDと値を文字列として取得できる', () => {
      const noice = createNoice(noiceId, fromUserId, postId, amount, 'コメント', [], now)

      expect(getNoiceIdAsString(noice)).toBe(getNoiceIdValue(noiceId))
      expect(getNoiceFromUserIdAsString(noice)).toBe('550e8400-e29b-41d4-a716-446655440001')
      expect(getNoicePostIdAsString(noice)).toBe('550e8400-e29b-41d4-a716-446655440002')
      expect(getNoiceAmountAsNumber(noice)).toBe(100)
    })
  })

  describe('コメント判定', () => {
    it('コメントありのいいねを正しく判定する', () => {
      const noiceWithComment = createNewNoiceWithComment(fromUserId, postId, amount, 'コメント')
      const noiceWithoutComment = createNewNoice(fromUserId, postId, amount)

      expect(hasNoiceComment(noiceWithComment)).toBe(true)
      expect(hasNoiceComment(noiceWithoutComment)).toBe(false)
    })

    it('空文字コメントは「コメントなし」として扱われる', () => {
      const noice = createNoice(noiceId, fromUserId, postId, amount, '', [], now)
      
      expect(hasNoiceComment(noice)).toBe(false)
    })
  })

  describe('投稿に対するいいね機能', () => {
    it('同じ投稿に複数のユーザーがいいねできる', () => {
      const user1 = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440010')
      const user2 = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440011')
      const targetPost = createPostIdOrThrow('550e8400-e29b-41d4-a716-446655440020')

      const noice1 = createNewNoice(user1, targetPost, createNoiceAmountOrThrow(50))
      const noice2 = createNewNoiceWithComment(user2, targetPost, createNoiceAmountOrThrow(100), '良い投稿！')

      expect(isNoiceToPost(noice1, targetPost)).toBe(true)
      expect(isNoiceToPost(noice2, targetPost)).toBe(true)
      expect(isNoiceFromUser(noice1, user1)).toBe(true)
      expect(isNoiceFromUser(noice2, user2)).toBe(true)
      expect(hasNoiceComment(noice1)).toBe(false)
      expect(hasNoiceComment(noice2)).toBe(true)
    })
  })

  describe('いいねへのいいね機能（再帰的）', () => {
    it('いいねにいいねを追加できる', () => {
      const originalNoice = createNewNoiceWithComment(fromUserId, postId, createNoiceAmountOrThrow(50), '良い投稿！')
      const secondUser = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440010')
      const subNoice = createNewNoice(secondUser, postId, createNoiceAmountOrThrow(30))

      const updatedNoice = addNoiceToNoice(originalNoice, subNoice)

      expect(getNoiceNoiceCount(updatedNoice)).toBe(1)
      expect(getNoiceNoices(updatedNoice)).toHaveLength(1)
      expect(getNoiceNoices(updatedNoice)[0]).toBe(subNoice)
    })

    it('再帰的にいいね総数を計算できる', () => {
      // 元のいいね（50ポイント）
      const originalNoice = createNewNoice(fromUserId, postId, createNoiceAmountOrThrow(50))
      
      // いいねへのいいね（30ポイント）
      const user2 = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440010')
      const subNoice1 = createNewNoice(user2, postId, createNoiceAmountOrThrow(30))
      
      // さらにいいねへのいいね（20ポイント）
      const user3 = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440011')
      const subNoice2 = createNewNoice(user3, postId, createNoiceAmountOrThrow(20))
      
      // サブいいねにさらにいいねを追加
      const subNoice1WithSubNoice = addNoiceToNoice(subNoice1, subNoice2)
      const finalNoice = addNoiceToNoice(originalNoice, subNoice1WithSubNoice)

      // 総いいね数: 50 + (30 + 20) = 100
      expect(getNoiceTotalAmount(finalNoice)).toBe(100)
      expect(getNoiceAmountAsNumber(finalNoice)).toBe(50) // 自分自身のいいね数
      expect(getNoiceNoiceCount(finalNoice)).toBe(1) // 直接のサブいいね数
    })

    it('複数の階層でいいねが追加できる', () => {
      const originalNoice = createNewNoice(fromUserId, postId, createNoiceAmountOrThrow(100))
      
      // 第1階層のいいね
      const user2 = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440010')
      const user3 = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440011')
      const subNoice1 = createNewNoice(user2, postId, createNoiceAmountOrThrow(50))
      const subNoice2 = createNewNoice(user3, postId, createNoiceAmountOrThrow(30))
      
      // 第2階層のいいね（subNoice1へのいいね）
      const user4 = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440012')
      const subSubNoice = createNewNoice(user4, postId, createNoiceAmountOrThrow(20))
      const subNoice1WithSubNoice = addNoiceToNoice(subNoice1, subSubNoice)
      
      // 最終的な構築
      const noiceWithSubNoices = addNoiceToNoice(originalNoice, subNoice1WithSubNoice)
      const finalNoice = addNoiceToNoice(noiceWithSubNoices, subNoice2)

      // 総いいね数: 100 + (50 + 20) + 30 = 200
      expect(getNoiceTotalAmount(finalNoice)).toBe(200)
      expect(getNoiceNoiceCount(finalNoice)).toBe(2) // 直接のサブいいね数
    })

    it('指定されたユーザーのサブいいねを取得できる', () => {
      const originalNoice = createNewNoice(fromUserId, postId, createNoiceAmountOrThrow(100))
      const user2 = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440010')
      const user3 = createUserIdOrThrow('550e8400-e29b-41d4-a716-446655440011')
      
      const subNoice1 = createNewNoice(user2, postId, createNoiceAmountOrThrow(50))
      const subNoice2 = createNewNoice(user2, postId, createNoiceAmountOrThrow(30)) // 同じユーザー
      const subNoice3 = createNewNoice(user3, postId, createNoiceAmountOrThrow(20))
      
      let updatedNoice = addNoiceToNoice(originalNoice, subNoice1)
      updatedNoice = addNoiceToNoice(updatedNoice, subNoice2)
      updatedNoice = addNoiceToNoice(updatedNoice, subNoice3)

      const user2Noices = getNoiceNoicesByUser(updatedNoice, user2)
      const user3Noices = getNoiceNoicesByUser(updatedNoice, user3)

      expect(user2Noices).toHaveLength(2)
      expect(user3Noices).toHaveLength(1)
      expect(user2Noices[0]).toBe(subNoice1)
      expect(user2Noices[1]).toBe(subNoice2)
      expect(user3Noices[0]).toBe(subNoice3)
    })

    it('空のいいねリストから開始する', () => {
      const noice = createNewNoice(fromUserId, postId, amount)
      
      expect(getNoiceNoiceCount(noice)).toBe(0)
      expect(getNoiceNoices(noice)).toHaveLength(0)
      expect(getNoiceTotalAmount(noice)).toBe(100) // 自分自身のいいね数のみ
    })
  })
})
