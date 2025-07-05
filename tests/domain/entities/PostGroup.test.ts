import { describe, it, expect } from "vitest";
import { createPostGroup, addPostToGroup, addChildGroup, getPostGroupPosts, getPostGroupChildren } from "../../../src/domain/entities/PostGroup";
import { createPostGroup as createPostGroupVO } from "../../../src/domain/value-objects/PostGroup";
import { createNewPost } from "../../../src/domain/entities/Post";
import { createPostTitleOrThrow } from "../../../src/domain/value-objects/PostTitle";
import { createPostContentOrThrow } from "../../../src/domain/value-objects/PostContent";
import { createUserIdOrThrow } from "../../../src/domain/value-objects/UserId";

describe("PostGroup", () => {
  const groupNameResult = createPostGroupVO("group1");
  if (!groupNameResult.success) throw new Error("invalid group name");
  const groupName = groupNameResult.data;

  const post1 = createNewPost(
    createPostTitleOrThrow("タイトル1"),
    createPostContentOrThrow("本文1"),
    createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440001")
  );
  const post2 = createNewPost(
    createPostTitleOrThrow("タイトル2"),
    createPostContentOrThrow("本文2"),
    createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002")
  );

  it("グループを作成できる", () => {
    const group = createPostGroup(groupName);
    expect(group.name).toBe(groupName);
    expect(group.posts).toEqual([]);
    expect(group.children).toEqual([]);
  });

  it("グループに投稿を追加できる", () => {
    let group = createPostGroup(groupName);
    group = addPostToGroup(group, post1);
    group = addPostToGroup(group, post2);
    expect(getPostGroupPosts(group)).toHaveLength(2);
    expect(getPostGroupPosts(group)[0]).toBe(post1);
    expect(getPostGroupPosts(group)[1]).toBe(post2);
  });

  it("グループに子グループを追加できる", () => {
    const childNameResult = createPostGroupVO("child");
    if (!childNameResult.success) throw new Error("invalid group name");
    const childName = childNameResult.data;
    const childGroup = createPostGroup(childName);

    let group = createPostGroup(groupName);
    group = addChildGroup(group, childGroup);

    expect(getPostGroupChildren(group)).toHaveLength(1);
    expect(getPostGroupChildren(group)[0].name).toBe(childName);
  });

  it("グループは階層構造を持てる", () => {
    const childNameResult = createPostGroupVO("child");
    if (!childNameResult.success) throw new Error("invalid group name");
    const childName = childNameResult.data;
    const childGroup = createPostGroup(childName);

    const parentNameResult = createPostGroupVO("parent");
    if (!parentNameResult.success) throw new Error("invalid group name");
    const parentName = parentNameResult.data;
    let parentGroup = createPostGroup(parentName);

    parentGroup = addChildGroup(parentGroup, childGroup);

    expect(getPostGroupChildren(parentGroup)).toHaveLength(1);
    expect(getPostGroupChildren(parentGroup)[0].name).toBe(childName);
  });
});
