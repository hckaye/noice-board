// JiraPostGroupRepository.ts
// Jiraバックエンドを用いたPostGroupリポジトリ（インフラ層）
// clineruleに従い型安全・関数型・DDD・CQRS分離を意識

import type { PostGroup } from '../../domain/entities/PostGroup';
import type { Post } from '../../domain/entities/Post';
import type { PostGroupPath } from '../../domain/value-objects/PostGroupPath';

// Jira APIクライアントの型定義
export interface JiraApiClient {
  fetchEpicWithChildren(epicKey: string): Promise<JiraIssue>;
  fetchIssueComments(issueKey: string): Promise<JiraComment[]>;
  fetchUser(userAccountId: string): Promise<JiraUser>;
  fetchIssue(issueKey: string): Promise<JiraIssue>;
  searchIssues(jql: string): Promise<JiraIssue[]>;
}

// Jira Issue型
export type JiraIssue = {
  key: string;
  fields: {
    summary: string;
    description?: string;
    issuetype: { name: string };
    parent?: { key: string };
    children?: JiraIssue[]; // Epicの場合のみ
    // 他必要なフィールド
  };
  // 他必要なフィールド
};

// Jira Comment型
export type JiraComment = {
  id: string;
  body: string;
  author: JiraUser;
  created: string;
  // 他必要なフィールド
};

// Jira User型
export type JiraUser = {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  avatarUrls?: Record<string, string>;
  // 他必要なフィールド
};

// PostGroupRepositoryインターフェース
export interface PostGroupRepository {
  findByPath(path: PostGroupPath): Promise<PostGroup | null>;
  // 他のCQRSメソッド（コマンド/クエリ）を必要に応じて追加
}

/**
 * Jira Issue descriptionから[[ NoiceLimit: n ]]を抽出しNoiceLimit型に変換
 */
import { createNoiceLimit } from "../../domain/value-objects/NoiceLimit";
import { createPostGroup as createPostGroupVO } from "../../domain/value-objects/PostGroup";

/**
 * Jira Issue descriptionから[[ NoiceLimit: n ]]を抽出しNoiceLimit型に変換
 */
export const extractNoiceLimitFromDescription = (description?: string): import("../../domain/value-objects/NoiceLimit").NoiceLimit => {
  if (!description) return createNoiceLimit(4); // デフォルト4
  const match = description.match(/\[\[\s*NoiceLimit:\s*(\d+)\s*\]\]/);
  if (match) {
    return createNoiceLimit(Number(match[1]));
  }
  return createNoiceLimit(4); // デフォルト4
};

/**
 * Jira Issue summaryからPostGroupVOを生成（バリデーション失敗時は例外）
 */
export const createPostGroupVOFromSummary = (summary: string): import("../../domain/value-objects/PostGroup").PostGroup => {
  const result = createPostGroupVO(summary);
  if (!result.success) {
    throw new Error(`Invalid PostGroup name from Jira summary: ${result.error?.message ?? ""}`);
  }
  return result.data;
};

/**
 * Jira IssueツリーをPostGroupツリーへ変換（posts/childrenは空配列で初期化）
 */
export const convertJiraIssueToPostGroup = (
  issue: JiraIssue,
  children: PostGroup[] = [],
): PostGroup => {
  return {
    name: createPostGroupVOFromSummary(issue.fields.summary),
    noiceLimit: extractNoiceLimitFromDescription(issue.fields.description),
    posts: [],
    children,
  };
};

/**
 * Jira Comment→Post変換（必須項目のみ、他は空やデフォルトで初期化）
 */
import {
  createPost,
} from "../../domain/entities/Post";
import { createPostTitle } from "../../domain/value-objects/PostTitle";
import { createPostContent } from "../../domain/value-objects/PostContent";
import { createUserId } from "../../domain/value-objects/UserId";
import { generateNewPostId } from "../../domain/value-objects/PostId";
import { createDefaultPostGroupPath } from "../../domain/value-objects/PostGroupPath";
import { createEmptyHashtagList, addHashtagToList } from "../../domain/value-objects/Hashtag";
import { createPendingReviewStatus, createReviewStatus, isValidReviewStatus } from "../../domain/value-objects/ReviewStatus";
import { createReviewComment } from "../../domain/value-objects/ReviewComment";

export const convertJiraCommentToPost = (
  comment: JiraComment,
  groupPath = createDefaultPostGroupPath(),
  replies: JiraComment[] = [],
): Post => {
  // タイトルはJiraコメントの先頭20文字＋...（仮実装）
  const titleResult = createPostTitle(comment.body.slice(0, 20));
  if (!titleResult.success) throw new Error("Invalid PostTitle from Jira comment");
  const contentResult = createPostContent(comment.body);
  if (!contentResult.success) throw new Error("Invalid PostContent from Jira comment");
  const authorId = createUserId(comment.author.accountId);
  if (!authorId.success) throw new Error("Invalid UserId from Jira comment author");

  // [[ HashTag: サンプル1, サンプル2 ]] 形式からハッシュタグ抽出
  let hashtags = createEmptyHashtagList();
  const hashtagMatch = comment.body.match(/\[\[\s*HashTag:\s*([^\]]+)\]\]/i);
  if (hashtagMatch) {
    const tags = hashtagMatch[1].split(",").map(s => s.trim()).filter(Boolean);
    for (const tag of tags) {
      hashtags = addHashtagToList(hashtags, tag);
    }
  }

  // Reviewコメント抽出
  let reviewStatus = createPendingReviewStatus();
  let reviewComments: ReturnType<typeof createReviewComment>[] = [];
  const reviewReplies = replies.filter(r => /^\s*\[\[\s*Review:([^\]]+)\]\]/i.test(r.body));
  if (reviewReplies.length > 0) {
    // 最新のレビューコメントのステータスを採用
    const latest = reviewReplies[reviewReplies.length - 1];
    const match = latest.body.match(/^\s*\[\[\s*Review:\s*([^\]]+)\]\]/i);
    const statusStr = match ? match[1].trim() : "";
    if (isValidReviewStatus(statusStr)) {
      reviewStatus = createReviewStatus(statusStr);
    }
    // 全てのレビューコメントをReviewCommentとして格納
    reviewComments = reviewReplies.map(r => {
      const m = r.body.match(/^\s*\[\[\s*Review:\s*([^\]]+)\]\]\s*([\s\S]*)$/i);
      const content = m ? m[2].trim() : "";
      const userIdResult = createUserId(r.author.accountId);
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
    new Date(comment.created),
    new Date(comment.created),
  );
};

// Jira実装
export class JiraPostGroupRepository implements PostGroupRepository {
  private readonly apiClient: JiraApiClient;

  constructor(apiClient: JiraApiClient) {
    this.apiClient = apiClient;
  }

  // PostGroupPathからJira Epic/Task/Subtaskを辿ってPostGroupを取得
  async findByPath(path: PostGroupPath): Promise<PostGroup | null> {
    // path.valueをEpicのIssue Keyとみなす
    const epicKey = (path as unknown as { value: string }).value ?? "";
    if (!epicKey) return null;

    // Epicとその子（Task/Subtask）を再帰的に取得
    const buildGroup = async (epic: JiraIssue): Promise<PostGroup> => {
      // Epic配下のTaskを取得
      const epicWithChildren = await this.apiClient.fetchEpicWithChildren(epic.key);
      const taskIssues: JiraIssue[] = epicWithChildren.fields.children ?? [];

      // Task IssueをPostに変換
      const posts = await Promise.all(
        taskIssues.map(async (task) => {
          // Task IssueのlabelsからPostGroup階層とハッシュタグを抽出
          const fields = task.fields as JiraIssue["fields"] & {
            labels?: string[];
            status?: { name: string };
            reporter?: { accountId: string; displayName: string };
            created?: string;
          };
          const labels: string[] = fields.labels ?? [];
          const hashtagLabels = labels.filter(l => l.startsWith("_#"));

          // コメント取得
          const comments = await this.apiClient.fetchIssueComments(task.key);

          // Review/Noice/NoiceComment変換（ここでは単純に全コメントをPostのコメントとして格納、詳細ロジックは後続で拡張）
          // Noice, NoiceComment, ReviewCommentの変換は要件に応じて拡張
          // HashtagList型へ変換
          let hashtags = createEmptyHashtagList();
          for (const tag of hashtagLabels.map(l => l.replace(/^_#/, ""))) {
            hashtags = addHashtagToList(hashtags, tag);
          }
          // Post生成
          const basePost = convertJiraCommentToPost(
            comments[0] ?? {
              id: "",
              body: fields.summary,
              author: fields.reporter ?? { accountId: "", displayName: "" },
              created: fields.created ?? new Date().toISOString(),
            },
            undefined,
            comments.slice(1)
          );
          // hashtagsのみ上書き
          return {
            ...basePost,
            hashtags,
          };
        })
      );

      // Epic配下のTask以外の階層（サブグループ）はラベルで表現するためchildrenは空配列
      return {
        name: createPostGroupVOFromSummary(epic.fields.summary),
        noiceLimit: extractNoiceLimitFromDescription(epic.fields.description),
        posts,
        children: [],
      };
    };

    // Epic取得
    const epic = await this.apiClient.fetchIssue(epicKey);
    return buildGroup(epic);
  }

  // 必要に応じて他のメソッドを追加
}
