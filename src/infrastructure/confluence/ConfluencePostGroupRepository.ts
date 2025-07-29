// ConfluencePostGroupRepository.ts
// Confluenceバックエンドを用いたPostGroupリポジトリ（インフラ層）
// clineruleに従い型安全・関数型・DDD・CQRS分離を意識

import type { PostGroup } from '../../domain/entities/PostGroup';
import type { Post } from '../../domain/entities/Post';
import type { PostGroupPath } from '../../domain/value-objects/PostGroupPath';
import type { ConfluenceApiClientImpl, ConfluencePage, ConfluenceComment, ConfluenceUser } from './ConfluenceApiClientImpl';

// PostGroupRepositoryインターフェース
export interface PostGroupRepository {
  findByPath(path: PostGroupPath): Promise<PostGroup | null>;
  // 他のCQRSメソッド（コマンド/クエリ）を必要に応じて追加
}

// Confluenceページ→PostGroup変換
import { createPostGroup as createPostGroupVO } from "../../domain/value-objects/PostGroup";
import { createNoiceLimit } from "../../domain/value-objects/NoiceLimit";

export const extractNoiceLimitFromPageBody = (body?: string): import("../../domain/value-objects/NoiceLimit").NoiceLimit => {
  if (!body) return createNoiceLimit(4); // デフォルト4
  const match = body.match(/\[\[\s*NoiceLimit:\s*(\d+)\s*\]\]/);
  if (match) {
    return createNoiceLimit(Number(match[1]));
  }
  return createNoiceLimit(4); // デフォルト4
};

export const createPostGroupVOFromTitle = (title: string): import("../../domain/value-objects/PostGroup").PostGroup => {
  const result = createPostGroupVO(title);
  if (!result.success) {
    throw new Error(`Invalid PostGroup name from Confluence title: ${result.error?.message ?? ""}`);
  }
  return result.data;
};

// Confluenceコメント→Post変換
import { createPost } from "../../domain/entities/Post";
import { createPostTitle } from "../../domain/value-objects/PostTitle";
import { createPostContent } from "../../domain/value-objects/PostContent";
import { createUserId } from "../../domain/value-objects/UserId";
import { generateNewPostId } from "../../domain/value-objects/PostId";
import { createDefaultPostGroupPath } from "../../domain/value-objects/PostGroupPath";
import { createEmptyHashtagList, addHashtagToList } from "../../domain/value-objects/Hashtag";
import { createPendingReviewStatus, createReviewStatus, isValidReviewStatus } from "../../domain/value-objects/ReviewStatus";
import { createReviewComment } from "../../domain/value-objects/ReviewComment";

export const convertConfluenceCommentToPost = (
  comment: ConfluenceComment,
  groupPath = createDefaultPostGroupPath(),
  replies: ConfluenceComment[] = [],
): Post => {
  // タイトルはコメント本文の先頭20文字＋...（仮実装）
  const titleResult = createPostTitle(comment.body.storage.value.slice(0, 20));
  if (!titleResult.success) throw new Error("Invalid PostTitle from Confluence comment");
  const contentResult = createPostContent(comment.body.storage.value);
  if (!contentResult.success) throw new Error("Invalid PostContent from Confluence comment");
  const authorId = createUserId(comment.creator.accountId);
  if (!authorId.success) throw new Error("Invalid UserId from Confluence comment creator");

  // [[ HashTag: サンプル1, サンプル2 ]] 形式からハッシュタグ抽出
  let hashtags = createEmptyHashtagList();
  const hashtagMatch = comment.body.storage.value.match(/\[\[\s*HashTag:\s*([^\]]+)\]\]/i);
  if (hashtagMatch) {
    const tags = hashtagMatch[1].split(",").map(s => s.trim()).filter(Boolean);
    for (const tag of tags) {
      hashtags = addHashtagToList(hashtags, tag);
    }
  }

  // Reviewコメント抽出
  let reviewStatus = createPendingReviewStatus();
  let reviewComments: ReturnType<typeof createReviewComment>[] = [];
  const reviewReplies = replies.filter(r => /^\s*\[\[\s*Review:([^\]]+)\]\]/i.test(r.body.storage.value));
  if (reviewReplies.length > 0) {
    // 最新のレビューコメントのステータスを採用
    const latest = reviewReplies[reviewReplies.length - 1];
    const match = latest.body.storage.value.match(/^\s*\[\[\s*Review:\s*([^\]]+)\]\]/i);
    const statusStr = match ? match[1].trim() : "";
    if (isValidReviewStatus(statusStr)) {
      reviewStatus = createReviewStatus(statusStr);
    }
    // 全てのレビューコメントをReviewCommentとして格納
    reviewComments = reviewReplies.map(r => {
      const m = r.body.storage.value.match(/^\s*\[\[\s*Review:\s*([^\]]+)\]\]\s*([\s\S]*)$/i);
      const content = m ? m[2].trim() : "";
      const userIdResult = createUserId(r.creator.accountId);
      if (!userIdResult.success) throw new Error("Invalid UserId in review comment");
      return createReviewComment(content, userIdResult.data);
    });
  }

  return createPost(
    generateNewPostId(),
    titleResult.data,
    contentResult.data,
    authorId.data,
    groupPath,
    hashtags,
    reviewStatus,
    reviewComments,
    [],
    [],
    new Date(comment.createdDate),
    new Date(comment.createdDate),
  );
};

// Confluence実装
export class ConfluencePostGroupRepository implements PostGroupRepository {
  private readonly apiClient: ConfluenceApiClientImpl;

  constructor(apiClient: ConfluenceApiClientImpl) {
    this.apiClient = apiClient;
  }

  // PostGroupPathからConfluenceページを取得しPostGroupを返す
  async findByPath(path: PostGroupPath): Promise<PostGroup | null> {
    // path.valueをConfluenceページIDとみなす
    const pageId = (path as unknown as { value: string }).value ?? "";
    if (!pageId) return null;

    // ページ取得
    const page = await this.apiClient.fetchPage(pageId);

    // コメント取得
    const comments = await this.apiClient.fetchPageComments(pageId);

    // Post変換
    const posts = comments.map(comment => convertConfluenceCommentToPost(comment, path));

    return {
      name: createPostGroupVOFromTitle(page.title),
      noiceLimit: extractNoiceLimitFromPageBody(page.body.storage.value),
      posts,
      children: [],
    };
  }

  // 必要に応じて他のメソッドを追加
}
