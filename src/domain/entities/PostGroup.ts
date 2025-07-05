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

/**
 * 投稿グループエンティティ型
 */
export interface PostGroup {
  readonly name: PostGroupVO;
  readonly posts: readonly Post[];
  readonly children: readonly PostGroup[];
}

/**
 * PostGroupエンティティを作成する
 */
export const createPostGroup = (
  name: PostGroupVO,
  posts?: readonly Post[],
  children?: readonly PostGroup[],
): PostGroup => ({
  name,
  posts: posts ?? [],
  children: children ?? [],
});

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
export const addChildGroup = (group: PostGroup, child: PostGroup): PostGroup => ({
  ...group,
  children: [...group.children, child],
});
