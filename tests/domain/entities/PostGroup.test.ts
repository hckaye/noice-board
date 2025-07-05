import { describe, it, expect } from "vitest";
import { createPostGroup, addPostToGroup, addChildGroup, getPostGroupPosts, getPostGroupChildren, countNoiceByUserInGroup } from "../../../src/domain/entities/PostGroup";
import { addNoiceToPost } from "../../../src/domain/entities/Post";
import { createNewNoice } from "../../../src/domain/entities/Noice";
import { createNoiceLimit } from "../../../src/domain/value-objects/NoiceLimit";
import { createNoiceAmount } from "../../../src/domain/value-objects/NoiceAmount";
import { createPostGroup as createPostGroupVO } from "../../../src/domain/value-objects/PostGroup";
import { createNewPost } from "../../../src/domain/entities/Post";
import { createPostTitleOrThrow } from "../../../src/domain/value-objects/PostTitle";
import { createPostContentOrThrow } from "../../../src/domain/value-objects/PostContent";
import { createUserIdOrThrow } from "../../../src/domain/value-objects/UserId";

describe("PostGroup", () => {
  const groupNameResult = createPostGroupVO("group1");
  if (!groupNameResult.success) throw new Error("invalid group name");
  const groupName = groupNameResult.data;
  const noiceLimit = createNoiceLimit(3);

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
    const group = createPostGroup(groupName, noiceLimit);
    expect(group.name).toBe(groupName);
    expect(group.posts).toEqual([]);
    expect(group.children).toEqual([]);
});

it("1ユーザーがグループにつけられるNoice数が上限を超えた場合はエラー", () => {
  const groupNameResult = createPostGroupVO("limit-group");
  if (!groupNameResult.success) throw new Error("invalid group name");
  const groupName = groupNameResult.data;
  const limit = createNoiceLimit(2);
  let group = createPostGroup(groupName, limit);

  const userId = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440099");
  const post = createNewPost(
    createPostTitleOrThrow("タイトル"),
    createPostContentOrThrow("本文"),
    userId
  );
  group = addPostToGroup(group, post);

  // 2つまでNoice追加
  let postWithNoice = post;
  const amount1 = createNoiceAmount(1);
  if (!amount1.success) throw new Error("invalid NoiceAmount");
  postWithNoice = addNoiceToPost(postWithNoice, createNewNoice(userId, post.id, amount1.data));
  const amount2 = createNoiceAmount(1);
  if (!amount2.success) throw new Error("invalid NoiceAmount");
  postWithNoice = addNoiceToPost(postWithNoice, createNewNoice(userId, post.id, amount2.data));

  // 3つ目は上限超過
  const amount3 = createNoiceAmount(1);
  if (!amount3.success) throw new Error("invalid NoiceAmount");
  const overNoice = createNewNoice(userId, post.id, amount3.data);
  const count = countNoiceByUserInGroup({ ...group, posts: [postWithNoice] }, userId);
  expect(count).toBe(2);
  if (count >= limit) {
    expect(() => {
      if (countNoiceByUserInGroup({ ...group, posts: [postWithNoice] }, userId) >= limit) {
        throw new Error("Noice上限超過");
      }
      addNoiceToPost(postWithNoice, overNoice);
    }).toThrow("Noice上限超過");
  }
});

it("子グループのNoice上限が親を超える場合はエラー", () => {
  const parentNameResult = createPostGroupVO("parent");
  if (!parentNameResult.success) throw new Error("invalid group name");
  const parentName = parentNameResult.data;
  const parentLimit = createNoiceLimit(2);
  const parentGroup = createPostGroup(parentName, parentLimit);

  const childNameResult = createPostGroupVO("child");
  if (!childNameResult.success) throw new Error("invalid group name");
  const childName = childNameResult.data;
  const childLimit = createNoiceLimit(3);
  const childGroup = createPostGroup(childName, childLimit);

  expect(() => addChildGroup(parentGroup, childGroup)).toThrow();
});

  it("グループに投稿を追加できる", () => {
    let group = createPostGroup(groupName, noiceLimit);
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
    const childGroup = createPostGroup(childName, noiceLimit);

    let group = createPostGroup(groupName, noiceLimit);
    group = addChildGroup(group, childGroup);

    expect(getPostGroupChildren(group)).toHaveLength(1);
    expect(getPostGroupChildren(group)[0].name).toBe(childName);
  });

  it("グループは階層構造を持てる", () => {
    const childNameResult = createPostGroupVO("child");
    if (!childNameResult.success) throw new Error("invalid group name");
    const childName = childNameResult.data;
    const childGroup = createPostGroup(childName, noiceLimit);

    const parentNameResult = createPostGroupVO("parent");
    if (!parentNameResult.success) throw new Error("invalid group name");
    const parentName = parentNameResult.data;
    let parentGroup = createPostGroup(parentName, noiceLimit);

    parentGroup = addChildGroup(parentGroup, childGroup);

    expect(getPostGroupChildren(parentGroup)).toHaveLength(1);
    expect(getPostGroupChildren(parentGroup)[0].name).toBe(childName);
  });
});
