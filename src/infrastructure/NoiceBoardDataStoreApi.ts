// NoiceBoardの外部データストア連携APIインターフェース
// ドメインモデルを型安全に扱い、インフラ層で実装される

import type { Post } from '../domain/entities/Post';
import type { PostGroup } from '../domain/entities/PostGroup';
import type { User } from '../domain/entities/User';
import type { PostId } from '../domain/value-objects/PostId';
import type { PostGroupPath } from '../domain/value-objects/PostGroupPath';
import type { UserId } from '../domain/value-objects/UserId';

import type { Result } from "../domain/types/Result";

export interface INoiceBoardDataStoreApi {
  // PostGroup関連
  getPostGroup(path: PostGroupPath): Promise<Result<PostGroup>>;
  listPostGroups(): Promise<Result<PostGroup[]>>;

  // Post関連
  getPost(postId: PostId): Promise<Result<Post>>;
  listPosts(groupPath: PostGroupPath): Promise<Result<Post[]>>;
  createPost(post: Post): Promise<Result<void>>;
  updatePost(post: Post): Promise<Result<void>>;
  deletePost(postId: PostId): Promise<Result<void>>;

  // Noice関連
  addNoice(postId: PostId, userId: UserId): Promise<Result<void>>;
  removeNoice(postId: PostId, userId: UserId): Promise<Result<void>>;
  getNoiceCount(postId: PostId): Promise<Result<number>>;

  // User関連
  getUser(userId: UserId): Promise<Result<User>>;
  listUsers(): Promise<Result<User[]>>;
}
