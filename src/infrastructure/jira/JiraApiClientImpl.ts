// JiraApiClientImpl.ts
// Jira REST APIを叩く実装クラス

import type {
  JiraApiClient,
  JiraIssue,
  JiraComment,
  JiraUser,
} from "./JiraPostGroupRepository";

type JiraApiClientConfig = {
  baseUrl: string; // 例: https://your-domain.atlassian.net
  token: string;   // Basic認証 or Bearerトークン
};

import type { User } from "../../domain/entities/User";
import { createUserId } from "../../domain/value-objects/UserId";
import { createUsername, createUserDisplayName } from "../../domain/value-objects/Username";
import { createNoiceAmount } from "../../domain/value-objects/NoiceAmount";

/**
 * JiraUser→NoiceBoard Userエンティティ変換
 */
export const convertJiraUserToUser = (jiraUser: JiraUser): User => {
  const userIdResult = createUserId(jiraUser.accountId);
  if (!userIdResult.success) throw new Error("Invalid UserId from JiraUser");
  const usernameResult = createUsername(jiraUser.displayName);
  if (!usernameResult.success) throw new Error("Invalid Username from JiraUser");
  const noiceAmountResult = createNoiceAmount(Number.POSITIVE_INFINITY);
  if (!noiceAmountResult.success) throw new Error("Invalid NoiceAmount for User");
  const displayNameResult = createUserDisplayName(jiraUser.displayName);
  if (!displayNameResult.success) throw new Error("Invalid UserDisplayName from JiraUser");
  return {
    id: userIdResult.data,
    username: usernameResult.data,
    displayName: displayNameResult.data,
    createdAt: new Date(0),
    noiceAmount: noiceAmountResult.data,
    avatarUrl: jiraUser.avatarUrls?.["48x48"] ?? "",
  };
};

export class JiraApiClientImpl implements JiraApiClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(config: JiraApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.token = config.token;
  }

  private async fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Authorization": `Basic ${this.token}`,
        "Accept": "application/json",
        ...options.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`Jira API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }

  async fetchIssue(issueKey: string): Promise<JiraIssue> {
    return this.fetchApi<JiraIssue>(`/rest/api/3/issue/${issueKey}`);
  }

  async fetchIssueComments(issueKey: string): Promise<JiraComment[]> {
    const data = await this.fetchApi<{ comments: JiraComment[] }>(`/rest/api/3/issue/${issueKey}/comment`);
    return data.comments;
  }

  async fetchUser(userAccountId: string): Promise<JiraUser> {
    return this.fetchApi<JiraUser>(`/rest/api/3/user?accountId=${encodeURIComponent(userAccountId)}`);
  }

  async searchIssues(jql: string): Promise<JiraIssue[]> {
    const data = await this.fetchApi<{ issues: JiraIssue[] }>(`/rest/api/3/search?jql=${encodeURIComponent(jql)}`);
    return data.issues;
  }

  // Epic配下のTask/Subtaskを再帰的に取得
  async fetchEpicWithChildren(epicKey: string): Promise<JiraIssue> {
    const epic = await this.fetchIssue(epicKey);
    // Epic配下のTask
    const tasks = await this.searchIssues(`"Epic Link"=${epicKey}`);
    // 各TaskのSubtask
    for (const task of tasks) {
      const subtasks = await this.searchIssues(`parent=${task.key}`);
      (task.fields as unknown as { children?: JiraIssue[] }).children = subtasks;
    }
    (epic.fields as unknown as { children?: JiraIssue[] }).children = tasks;
    return epic;
  }
}
