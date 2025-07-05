import { describe, it, expect } from 'vitest'
import { Post } from '../../../src/domain/entities/Post'
import { PostId } from '../../../src/domain/value-objects/PostId'
import { PostTitle } from '../../../src/domain/value-objects/PostTitle'
import { PostContent } from '../../../src/domain/value-objects/PostContent'
import { UserId } from '../../../src/domain/value-objects/UserId'
import { NoiceAmount } from '../../../src/domain/value-objects/NoiceAmount'

describe('Post', () => {
  const postId = PostId.create('550e8400-e29b-41d4-a716-446655440000')
  const title = PostTitle.create('テスト投稿のタイトル')
  const content = PostContent.create('これはテスト投稿の本文です。')
  const authorId = UserId.create('550e8400-e29b-41d4-a716-446655440001')
  const totalNoice = NoiceAmount.create(500)
  const now = new Date()

  describe('投稿の作成', () => {
    it('有効な値でPostを作成できる', () => {
      const post = Post.create(postId, title, content, authorId, totalNoice, now, now)

      expect(post.getId().equals(postId)).toBe(true)
      expect(post.getTitle().equals(title)).toBe(true)
      expect(post.getContent().equals(content)).toBe(true)
      expect(post.getAuthorId().equals(authorId)).toBe(true)
      expect(post.getTotalNoiceAmount().equals(totalNoice)).toBe(true)
      expect(post.getCreatedAt()).toBe(now)
      expect(post.getUpdatedAt()).toBe(now)
    })

    it('新しいPostを生成できる', () => {
      const newPost = Post.createNew(title, content, authorId)

      expect(newPost.getTitle().equals(title)).toBe(true)
      expect(newPost.getContent().equals(content)).toBe(true)
      expect(newPost.getAuthorId().equals(authorId)).toBe(true)
      expect(newPost.getTotalNoiceAmount().getValue()).toBe(0)
      expect(newPost.getCreatedAt()).toBeInstanceOf(Date)
      expect(newPost.getUpdatedAt()).toBeInstanceOf(Date)
    })
  })

  describe('投稿の編集', () => {
    it('タイトルを更新できる', () => {
      const post = Post.create(postId, title, content, authorId, totalNoice, now, now)
      const newTitle = PostTitle.create('更新されたタイトル')

      post.updateTitle(newTitle)

      expect(post.getTitle().equals(newTitle)).toBe(true)
    })

    it('本文を更新できる', () => {
      const post = Post.create(postId, title, content, authorId, totalNoice, now, now)
      const newContent = PostContent.create('更新された本文です。')

      post.updateContent(newContent)

      expect(post.getContent().equals(newContent)).toBe(true)
    })

    it('タイトルと本文を同時に更新できる', () => {
      const post = Post.create(postId, title, content, authorId, totalNoice, now, now)
      const newTitle = PostTitle.create('新しいタイトル')
      const newContent = PostContent.create('新しい本文です。')

      post.updatePost(newTitle, newContent)

      expect(post.getTitle().equals(newTitle)).toBe(true)
      expect(post.getContent().equals(newContent)).toBe(true)
    })
  })

  describe('いいねの受け取り', () => {
    it('いいねを受け取ることができる', () => {
      const post = Post.create(postId, title, content, authorId, NoiceAmount.create(100), now, now)
      const receiveAmount = NoiceAmount.create(200)

      post.receiveNoice(receiveAmount)

      expect(post.getTotalNoiceAmount().getValue()).toBe(300)
    })

    it('0いいねの投稿にいいねを受け取ることができる', () => {
      const post = Post.createNew(title, content, authorId)
      const receiveAmount = NoiceAmount.create(150)

      post.receiveNoice(receiveAmount)

      expect(post.getTotalNoiceAmount().getValue()).toBe(150)
    })
  })

  describe('投稿者の判定', () => {
    it('指定されたユーザーが投稿者かどうか判定できる', () => {
      const post = Post.create(postId, title, content, authorId, totalNoice, now, now)
      const otherUserId = UserId.create('550e8400-e29b-41d4-a716-446655440002')

      expect(post.isAuthor(authorId)).toBe(true)
      expect(post.isAuthor(otherUserId)).toBe(false)
    })
  })

  describe('等価性', () => {
    it('同じIDのPostは等しい', () => {
      const post1 = Post.create(postId, title, content, authorId, totalNoice, now, now)
      const post2 = Post.create(
        postId,
        PostTitle.create('Different Title'),
        PostContent.create('Different content'),
        UserId.create('550e8400-e29b-41d4-a716-446655440002'),
        NoiceAmount.create(1000),
        new Date(),
        new Date()
      )

      expect(post1.equals(post2)).toBe(true)
    })

    it('異なるIDのPostは等しくない', () => {
      const differentPostId = PostId.create('550e8400-e29b-41d4-a716-446655440003')
      const post1 = Post.create(postId, title, content, authorId, totalNoice, now, now)
      const post2 = Post.create(differentPostId, title, content, authorId, totalNoice, now, now)

      expect(post1.equals(post2)).toBe(false)
    })
  })

  describe('不変条件', () => {
    it('累計いいね数は常に0以上である', () => {
      const post = Post.createNew(title, content, authorId)
      expect(post.getTotalNoiceAmount().getValue()).toBe(0)

      const receiveAmount = NoiceAmount.create(100)
      post.receiveNoice(receiveAmount)
      expect(post.getTotalNoiceAmount().getValue()).toBe(100)
    })

    it('作成日時は更新されない', () => {
      const post = Post.create(postId, title, content, authorId, totalNoice, now, now)
      const originalCreatedAt = post.getCreatedAt()

      post.updateTitle(PostTitle.create('新しいタイトル'))

      expect(post.getCreatedAt()).toBe(originalCreatedAt)
    })

    it('更新日時は編集時に更新される', () => {
      const post = Post.create(postId, title, content, authorId, totalNoice, now, now)
      const originalUpdatedAt = post.getUpdatedAt()

      // 少し時間を空ける
      setTimeout(() => {
        post.updateTitle(PostTitle.create('新しいタイトル'))
        expect(post.getUpdatedAt()).not.toBe(originalUpdatedAt)
      }, 1)
    })
  })
})
