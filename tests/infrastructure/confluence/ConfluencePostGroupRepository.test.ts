import { describe, it, expect } from "vitest";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfluencePostGroupRepository } from "../../../src/infrastructure/confluence/ConfluencePostGroupRepository";
import { createPostGroupPath } from "../../../src/domain/value-objects/PostGroupPath";
import { getPostGroupValue } from "../../../src/domain/value-objects/PostGroup";

// モックAPIクライアント
class MockConfluenceApiClient {
  async fetchPage(_: string): Promise<{ id: string; title: string; body: { storage: { value: string } }; _links: { webui: string } }> {
    return {
      id: "123",
      title: "テストページ",
      body: { storage: { value: "ページ本文 [[ NoiceLimit: 5 ]]" } },
      _links: { webui: `/wiki/pages/123` },
    };
  }
  async fetchPageComments(_: string): Promise<Array<{ id: string; body: { storage: { value: string } }; creator: { accountId: string; displayName: string }; createdDate: string }>> {
    return [
      {
        id: "c1",
        body: { storage: { value: "コメント本文1 [[ HashTag: タグ1,タグ2 ]]" } },
        creator: { accountId: "user-1", displayName: "ユーザー1" },
        createdDate: "2024-01-01T00:00:00Z",
      },
      {
        id: "c2",
        body: { storage: { value: "[[ Review:APPROVED ]] レビューコメント" } },
        creator: { accountId: "user-2", displayName: "レビュワー" },
        createdDate: "2024-01-02T00:00:00Z",
      },
    ];
  }
}

describe("ConfluencePostGroupRepository", () => {
  it("findByPathでページIDからPostGroupを取得できる", async () => {
    const repo = new ConfluencePostGroupRepository(new MockConfluenceApiClient() as any);
    const pathResult = createPostGroupPath("123");
    if (!pathResult.success) throw new Error("invalid path");
    const path = pathResult.data;
    const group = await repo.findByPath(path);

    expect(group).not.toBeNull();
    expect(getPostGroupValue(group!.name)).toBe("テストページ");
    expect(group!.noiceLimit).toBe(5);
    expect(group!.posts).toHaveLength(2);
    expect(group!.posts[0].hashtags.values).toEqual(["タグ1", "タグ2"]);
    expect(group!.posts[1].reviewStatus.value).toBe("APPROVED");
  });
});
