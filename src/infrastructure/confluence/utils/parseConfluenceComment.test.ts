// parseConfluenceComment.test.ts
// clinerules: 型安全・副作用なし・網羅的・明瞭なテスト
import { extractTagsFromCommentBody, getTagValue, CONFLUENCE_TAG_PATTERN, type ConfluenceCommentTag } from './parseConfluenceComment';
import { describe, it, expect } from 'vitest';
import { convertConfluenceCommentToPost } from '../ConfluencePostGroupRepository';
import type { ConfluenceComment, ConfluenceUser } from '../ConfluenceApiClientImpl';

// テスト用のUUID（v4形式）
const TEST_UUID = '123e4567-e89b-42d3-a456-426614174000';

describe('extractTagsFromCommentBody', () => {
  it('複数タグを正しく抽出できる', () => {
    const body = '[[TYPE:Noice]] [[POST_ID:abc-123]] コメント本文';
    const tags = extractTagsFromCommentBody(body);
    expect(tags).toEqual([
      { key: 'TYPE', value: 'Noice' },
      { key: 'POST_ID', value: 'abc-123' },
    ]);
  });

  it('タグがない場合は空配列', () => {
    expect(extractTagsFromCommentBody('コメントだけ')).toEqual([]);
  });

  it('タグの前後空白も許容', () => {
    const body = '[[  TYPE  :  Noice  ]]';
    const tags = extractTagsFromCommentBody(body);
    expect(tags).toEqual([{ key: 'TYPE', value: 'Noice' }]);
  });

  it('bodyがstringでない場合は空配列', () => {
    expect(extractTagsFromCommentBody(undefined)).toEqual([]);
  });

  it('タグ値にコロンやカンマが含まれてもOK', () => {
    const body = '[[KEY:foo:bar,baz]]';
    const tags = extractTagsFromCommentBody(body);
    expect(tags).toEqual([{ key: 'KEY', value: 'foo:bar,baz' }]);
  });
});

describe('getTagValue', () => {
  const tags: ConfluenceCommentTag[] = [
    { key: 'TYPE', value: 'Noice' },
    { key: 'POST_ID', value: 'abc-123' },
  ];

  it('指定キーの値を取得できる', () => {
    expect(getTagValue(tags, 'TYPE')).toBe('Noice');
    expect(getTagValue(tags, 'POST_ID')).toBe('abc-123');
  });

  it('キーは大文字小文字無視', () => {
    expect(getTagValue(tags, 'type')).toBe('Noice');
    expect(getTagValue(tags, 'post_id')).toBe('abc-123');
  });

  it('存在しないキーはundefined', () => {
    expect(getTagValue(tags, 'FOO')).toBeUndefined();
  });
});

describe('CONFLUENCE_TAG_PATTERN', () => {
  it('正規表現がグローバル・大文字小文字無視', () => {
    expect(CONFLUENCE_TAG_PATTERN.flags).toContain('g');
    expect(CONFLUENCE_TAG_PATTERN.flags).toContain('i');
  });
});

describe('convertConfluenceCommentToPost', () => {
  const mockUser: ConfluenceUser = {
    accountId: TEST_UUID,
    displayName: 'テストユーザー',
    profilePicture: { path: '/avatar.png' },
  };

  it('基本的なコメントをPostに変換できる', () => {
    const comment: ConfluenceComment = {
      id: 'c1',
      body: { storage: { value: 'テスト投稿内容です' } },
      creator: mockUser,
      createdDate: '2025-07-09T12:00:00Z',
    };
    const post = convertConfluenceCommentToPost(comment);
    expect(post.title).toBeDefined();
    expect(post.content).toBeDefined();
    expect(post.authorId).toBeDefined();
  });
});