// ConfluenceApiClientImpl.ts
// Confluence REST APIを叩く実装クラス

import type { User } from "../../domain/entities/User";
import { createUserId } from "../../domain/value-objects/UserId";
import { createUsername, createUserDisplayName } from "../../domain/value-objects/Username";
import { createNoiceAmount } from "../../domain/value-objects/NoiceAmount";

// Confluence API用型定義（仮）
export type ConfluencePage = {
  id: string;
  title: string;
  body: { storage: { value: string } };
  _links: { webui: string };
  // 他必要に応じて追加
};

export type ConfluenceComment = {
  id: string;
  body: { storage: { value: string } };
  creator: ConfluenceUser;
  createdDate: string;
  // 他必要に応じて追加
};

export type ConfluenceUser = {
  accountId: string;
  displayName: string;
  profilePicture?: { path: string };
};

export type ConfluenceApiClientConfig = {
  baseUrl: string; // 例: https://your-domain.atlassian.net/wiki
  token: string;   // Basic認証 or Bearerトークン
};

/**
 * ConfluenceUser→NoiceBoard Userエンティティ変換
 */
export const convertConfluenceUserToUser = (confluenceUser: ConfluenceUser): User => {
  const userIdResult = createUserId(confluenceUser.accountId);
  if (!userIdResult.success) throw new Error("Invalid UserId from ConfluenceUser");
  const usernameResult = createUsername(confluenceUser.displayName);
  if (!usernameResult.success) throw new Error("Invalid Username from ConfluenceUser");
  const noiceAmountResult = createNoiceAmount(Number.POSITIVE_INFINITY);
  if (!noiceAmountResult.success) throw new Error("Invalid NoiceAmount for User");
  const displayNameResult = createUserDisplayName(confluenceUser.displayName);
  if (!displayNameResult.success) throw new Error("Invalid UserDisplayName from ConfluenceUser");
  return {
    id: userIdResult.data,
    username: usernameResult.data,
    displayName: displayNameResult.data,
    createdAt: new Date(0),
    noiceAmount: noiceAmountResult.data,
    avatarUrl: confluenceUser.profilePicture?.path ?? "",
  };
};

export class ConfluenceApiClientImpl {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(config: ConfluenceApiClientConfig) {
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
      throw new Error(`Confluence API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }

  async fetchPage(pageId: string): Promise<ConfluencePage> {
    return this.fetchApi<ConfluencePage>(`/wiki/rest/api/content/${pageId}?expand=body.storage`);
  }

  async fetchPageComments(pageId: string): Promise<ConfluenceComment[]> {
    const data = await this.fetchApi<{ results: ConfluenceComment[] }>(
      `/wiki/rest/api/content/${pageId}/child/comment?expand=body.storage,creator`
    );
    return data.results;
  }

  async fetchUser(accountId: string): Promise<ConfluenceUser> {
    return this.fetchApi<ConfluenceUser>(`/wiki/rest/api/user?accountId=${encodeURIComponent(accountId)}`);
  }
}
