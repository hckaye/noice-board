// NoiceBoardの外部データストア連携APIインターフェース
// ドメインモデルを型安全に扱い、インフラ層で実装される

import type { Post } from '../domain/entities/Post';
import type { PostGroup } from '../domain/entities/PostGroup';
import type { User } from '../domain/entities/User';
import type { PostId } from '../domain/value-objects/PostId';
import type { PostGroupPath } from '../domain/value-objects/PostGroupPath';
import type { UserId } from '../domain/value-objects/UserId';

export interface INoiceBoardDataStoreApi {
  // PostGroup関連
  getPostGroup(path: PostGroupPath): Promise<PostGroup | null>;
  listPostGroups(): Promise<PostGroup[]>;

  // Post関連
  getPost(postId: PostId): Promise<Post | null>;
  listPosts(groupPath: PostGroupPath): Promise<Post[]>;
  createPost(post: Post): Promise<void>;
  updatePost(post: Post): Promise<void>;
  deletePost(postId: PostId): Promise<void>;

  // Noice関連
  addNoice(postId: PostId, userId: UserId): Promise<void>;
  removeNoice(postId: PostId, userId: UserId): Promise<void>;
  getNoiceCount(postId: PostId): Promise<number>;

  // User関連
  getUser(userId: UserId): Promise<User | null>;
  listUsers(): Promise<User[]>;
}
