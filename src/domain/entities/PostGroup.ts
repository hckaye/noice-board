/**
 * 投稿グループエンティティ
 *
 * - グループは複数のPostを持つ
 * - グループは子グループ（PostGroup）を持つ（階層構造）
 * - グループ名は値オブジェクトのPostGroupを利用
 * - 不変条件：グループ名は一意
 */

import type { Post } from "./Post";
import type { PostGroup as PostGroupVO } from "../value-objects/PostGroup";
import type { NoiceLimit } from "../value-objects/NoiceLimit";

/**
 * 投稿グループエンティティ型
 */
export interface PostGroup {
  readonly name: PostGroupVO;
  readonly posts: readonly Post[];
  readonly children: readonly PostGroup[];
  readonly noiceLimit: NoiceLimit;
}

/**
 * PostGroupエンティティを作成する
 */
export const createPostGroup = (
  name: PostGroupVO,
  noiceLimit: NoiceLimit,
  posts?: readonly Post[],
  children?: readonly PostGroup[],
): PostGroup => ({
  name,
  noiceLimit,
  posts: posts ?? [],
  children: children ?? [],
});

/**
 * Noice上限を取得
 */
export const getPostGroupNoiceLimit = (group: PostGroup): NoiceLimit => group.noiceLimit;

/**
 * 指定ユーザーがこのグループ内でつけたNoice数をカウントする
 */
import type { UserId } from "../value-objects/UserId";
import { getNoiceFromUserId } from "./Noice";
import { getPostNoices } from "./Post";
import { isUserIdEqual } from "../value-objects/UserId";

export const countNoiceByUserInGroup = (group: PostGroup, userId: UserId): number => {
  return group.posts.reduce((sum, post) => {
    const noices = getPostNoices(post);
    return sum + noices.filter(noice => isUserIdEqual(getNoiceFromUserId(noice), userId)).length;
  }, 0);
};

/**
 * グループ名を取得
 */
export const getPostGroupName = (group: PostGroup): PostGroupVO => group.name;

/**
 * グループの投稿一覧を取得
 */
export const getPostGroupPosts = (group: PostGroup): readonly Post[] => group.posts;

/**
 * 子グループ一覧を取得
 */
export const getPostGroupChildren = (group: PostGroup): readonly PostGroup[] => group.children;

/**
 * 投稿をグループに追加
 */
export const addPostToGroup = (group: PostGroup, post: Post): PostGroup => ({
  ...group,
  posts: [...group.posts, post],
});

/**
 * 子グループを追加
 */
export const addChildGroup = (group: PostGroup, child: PostGroup): PostGroup => {
  if (child.noiceLimit > group.noiceLimit) {
    throw new Error("子グループのNoice上限は親グループを超えることはできません");
  }
  return {
    ...group,
    children: [...group.children, child],
  };
};
