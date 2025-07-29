import type { INoiceBoardDataStoreApi } from '../NoiceBoardDataStoreApi';
import type { Result } from '../../domain/types/Result';
import type { Post } from '../../domain/entities/Post';
import type { PostGroup } from '../../domain/entities/PostGroup';
import type { User } from '../../domain/entities/User';
import type { PostId } from '../../domain/value-objects/PostId';
import type { PostGroupPath } from '../../domain/value-objects/PostGroupPath';
import type { UserId } from '../../domain/value-objects/UserId';
import type { NoiceId } from '../../domain/entities/Noice';
import { generateNewUserId, getUserIdValue } from '../../domain/value-objects/UserId';
import { generateNewPostId, getPostIdValue } from '../../domain/value-objects/PostId';
import { createPostGroupPath, getPostGroupPathValue } from '../../domain/value-objects/PostGroupPath';
import { createUsername } from '../../domain/value-objects/Username';
import { createNoiceAmount, getNoiceAmountValue } from '../../domain/value-objects/NoiceAmount';
import { createPostTitle } from '../../domain/value-objects/PostTitle';
import { createPostContent } from '../../domain/value-objects/PostContent';
import { createNoiceLimit } from '../../domain/value-objects/NoiceLimit';
import { createCompletedReviewStatus } from '../../domain/value-objects/ReviewStatus';
import { createPostGroup as createPostGroupVO } from '../../domain/value-objects/PostGroup';

interface MockData {
  users: Map<string, User>;
  posts: Map<string, Post>;
  postGroups: Map<string, PostGroup>;
}

export class MockNoiceBoardDataStoreApi implements INoiceBoardDataStoreApi {
  private data: MockData;

  constructor() {
    this.data = {
      users: new Map(),
      posts: new Map(),
      postGroups: new Map(),
    };
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Create mock users
    const user1Id = generateNewUserId();
    const user2Id = generateNewUserId();
    const user3Id = generateNewUserId();

    const usernameResult1 = createUsername('alice_dev');
    const usernameResult2 = createUsername('bob_designer');
    const usernameResult3 = createUsername('charlie_pm');
    const noiceAmountResult1 = createNoiceAmount(100);
    const noiceAmountResult2 = createNoiceAmount(150);
    const noiceAmountResult3 = createNoiceAmount(200);

    if (!usernameResult1.success || !usernameResult2.success || !usernameResult3.success ||
        !noiceAmountResult1.success || !noiceAmountResult2.success || !noiceAmountResult3.success) {
      throw new Error('Failed to create mock data');
    }

    const user1: User = {
      id: user1Id,
      username: usernameResult1.data,
      displayName: 'Alice Developer' as any,
      noiceAmount: noiceAmountResult1.data,
      createdAt: new Date('2024-01-01'),
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    };

    const user2: User = {
      id: user2Id,
      username: usernameResult2.data,
      displayName: 'Bob Designer' as any,
      noiceAmount: noiceAmountResult2.data,
      createdAt: new Date('2024-01-02'),
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    };

    const user3: User = {
      id: user3Id,
      username: usernameResult3.data,
      displayName: 'Charlie PM' as any,
      noiceAmount: noiceAmountResult3.data,
      createdAt: new Date('2024-01-03'),
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    };

    this.data.users.set(getUserIdValue(user1Id), user1);
    this.data.users.set(getUserIdValue(user2Id), user2);
    this.data.users.set(getUserIdValue(user3Id), user3);

    // Create mock post groups
    const techGroupPathResult = createPostGroupPath('/tech');
    const designGroupPathResult = createPostGroupPath('/design');
    const generalGroupPathResult = createPostGroupPath('/general');

    if (!techGroupPathResult.success || !designGroupPathResult.success || !generalGroupPathResult.success) {
      throw new Error('Failed to create mock post groups');
    }

    const noiceLimit1 = createNoiceLimit(50);
    const noiceLimit2 = createNoiceLimit(30);
    const noiceLimit3 = createNoiceLimit(20);

    const techGroupNameResult = createPostGroupVO('tech');
    const designGroupNameResult = createPostGroupVO('design');
    const generalGroupNameResult = createPostGroupVO('general');
    
    if (!techGroupNameResult.success || !designGroupNameResult.success || !generalGroupNameResult.success) {
      throw new Error('Failed to create group names');
    }

    const techGroup: PostGroup = {
      name: techGroupNameResult.data,
      posts: [],
      children: [],
      noiceLimit: noiceLimit1,
    };

    const designGroup: PostGroup = {
      name: designGroupNameResult.data,
      posts: [],
      children: [],
      noiceLimit: noiceLimit2,
    };

    const generalGroup: PostGroup = {
      name: generalGroupNameResult.data,
      posts: [],
      children: [],
      noiceLimit: noiceLimit3,
    };

    this.data.postGroups.set(getPostGroupPathValue(techGroupPathResult.data), techGroup);
    this.data.postGroups.set(getPostGroupPathValue(designGroupPathResult.data), designGroup);
    this.data.postGroups.set(getPostGroupPathValue(generalGroupPathResult.data), generalGroup);

    // Create mock posts
    const post1Id = generateNewPostId();
    const post2Id = generateNewPostId();
    const post3Id = generateNewPostId();

    const titleResult1 = createPostTitle('React 18の新機能まとめ');
    const titleResult2 = createPostTitle('UIデザインのベストプラクティス');
    const titleResult3 = createPostTitle('プロジェクト管理のコツ');

    const contentResult1 = createPostContent('React 18では、Concurrent Renderingが導入され、より良いユーザー体験を提供できるようになりました。');
    const contentResult2 = createPostContent('ユーザーファーストなUIデザインを実現するための10のポイントを紹介します。');
    const contentResult3 = createPostContent('アジャイル開発におけるプロジェクト管理の重要なポイントをまとめました。');

    if (!titleResult1.success || !titleResult2.success || !titleResult3.success ||
        !contentResult1.success || !contentResult2.success || !contentResult3.success) {
      throw new Error('Failed to create mock posts');
    }

    const noiceAmountForPost = createNoiceAmount(5);
    if (!noiceAmountForPost.success) {
      throw new Error('Failed to create noice amount');
    }

    const post1: Post = {
      id: post1Id,
      title: titleResult1.data,
      content: contentResult1.data,
      authorId: user1Id,
      groupPath: techGroupPathResult.data,
      hashtags: ['#React', '#JavaScript', '#Frontend'] as any,
      reviewStatus: createCompletedReviewStatus(),
      reviewComments: [],
      comments: [],
      noices: [{
        id: 'noice-1' as unknown as NoiceId,
        fromUserId: user2Id,
        postId: post1Id,
        amount: noiceAmountForPost.data,
        comment: 'とても参考になりました！',
        noices: [],
        createdAt: new Date('2024-01-10'),
      }],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
    };

    const post2: Post = {
      id: post2Id,
      title: titleResult2.data,
      content: contentResult2.data,
      authorId: user2Id,
      groupPath: designGroupPathResult.data,
      hashtags: ['#UI', '#UX', '#Design'] as any,
      reviewStatus: createCompletedReviewStatus(),
      reviewComments: [],
      comments: [],
      noices: [],
      createdAt: new Date('2024-01-06'),
      updatedAt: new Date('2024-01-06'),
    };

    const post3: Post = {
      id: post3Id,
      title: titleResult3.data,
      content: contentResult3.data,
      authorId: user3Id,
      groupPath: generalGroupPathResult.data,
      hashtags: ['#ProjectManagement', '#Agile'] as any,
      reviewStatus: createCompletedReviewStatus(),
      reviewComments: [],
      comments: [],
      noices: [],
      createdAt: new Date('2024-01-07'),
      updatedAt: new Date('2024-01-07'),
    };

    this.data.posts.set(getPostIdValue(post1Id), post1);
    this.data.posts.set(getPostIdValue(post2Id), post2);
    this.data.posts.set(getPostIdValue(post3Id), post3);
  }

  // PostGroup関連
  async getPostGroup(path: PostGroupPath): Promise<Result<PostGroup>> {
    const group = this.data.postGroups.get(getPostGroupPathValue(path));
    if (!group) {
      return { success: false, error: { code: 'NOT_FOUND', message: `PostGroup not found: ${getPostGroupPathValue(path)}` } };
    }
    return { success: true, value: group };
  }

  async listPostGroups(): Promise<Result<PostGroup[]>> {
    const groups = Array.from(this.data.postGroups.values());
    return { success: true, value: groups };
  }

  // Post関連
  async getPost(postId: PostId): Promise<Result<Post>> {
    const post = this.data.posts.get(getPostIdValue(postId));
    if (!post) {
      return { success: false, error: { code: 'NOT_FOUND', message: `Post not found: ${getPostIdValue(postId)}` } };
    }
    return { success: true, value: post };
  }

  async listPosts(groupPath: PostGroupPath): Promise<Result<Post[]>> {
    const posts = Array.from(this.data.posts.values()).filter(
      post => getPostGroupPathValue(post.groupPath) === getPostGroupPathValue(groupPath)
    );
    return { success: true, value: posts };
  }

  async createPost(post: Post): Promise<Result<void>> {
    this.data.posts.set(getPostIdValue(post.id), post);
    return { success: true, value: undefined };
  }

  async updatePost(post: Post): Promise<Result<void>> {
    if (!this.data.posts.has(getPostIdValue(post.id))) {
      return { success: false, error: { code: 'NOT_FOUND', message: `Post not found: ${getPostIdValue(post.id)}` } };
    }
    this.data.posts.set(getPostIdValue(post.id), post);
    return { success: true, value: undefined };
  }

  async deletePost(postId: PostId): Promise<Result<void>> {
    if (!this.data.posts.has(getPostIdValue(postId))) {
      return { success: false, error: { code: 'NOT_FOUND', message: `Post not found: ${getPostIdValue(postId)}` } };
    }
    this.data.posts.delete(getPostIdValue(postId));
    return { success: true, value: undefined };
  }

  // Noice関連
  async addNoice(postId: PostId, userId: UserId): Promise<Result<void>> {
    const post = this.data.posts.get(getPostIdValue(postId));
    if (!post) {
      return { success: false, error: { code: 'NOT_FOUND', message: `Post not found: ${getPostIdValue(postId)}` } };
    }

    const noiceAmountResult = createNoiceAmount(1);
    if (!noiceAmountResult.success) {
      return { success: false, error: { code: 'INVALID_DATA', message: 'Failed to create noice amount' } };
    }

    const newNoice = {
      id: `noice-${Date.now()}` as unknown as NoiceId,
      fromUserId: userId,
      postId: postId,
      amount: noiceAmountResult.data,
      comment: '',
      noices: [],
      createdAt: new Date(),
    };

    const updatedPost = {
      ...post,
      noices: [...post.noices, newNoice],
    };

    this.data.posts.set(getPostIdValue(postId), updatedPost);
    return { success: true, value: undefined };
  }

  async removeNoice(postId: PostId, userId: UserId): Promise<Result<void>> {
    const post = this.data.posts.get(getPostIdValue(postId));
    if (!post) {
      return { success: false, error: { code: 'NOT_FOUND', message: `Post not found: ${getPostIdValue(postId)}` } };
    }

    const updatedPost = {
      ...post,
      noices: post.noices.filter(noice => getUserIdValue(noice.fromUserId) !== getUserIdValue(userId)),
    };

    this.data.posts.set(getPostIdValue(postId), updatedPost);
    return { success: true, value: undefined };
  }

  async getNoiceCount(postId: PostId): Promise<Result<number>> {
    const post = this.data.posts.get(getPostIdValue(postId));
    if (!post) {
      return { success: false, error: { code: 'NOT_FOUND', message: `Post not found: ${getPostIdValue(postId)}` } };
    }

    const totalNoiceAmount = post.noices.reduce((sum, noice) => sum + getNoiceAmountValue(noice.amount), 0);
    return { success: true, value: totalNoiceAmount };
  }

  // User関連
  async getUser(userId: UserId): Promise<Result<User>> {
    const user = this.data.users.get(getUserIdValue(userId));
    if (!user) {
      return { success: false, error: { code: 'NOT_FOUND', message: `User not found: ${getUserIdValue(userId)}` } };
    }
    return { success: true, value: user };
  }

  async listUsers(): Promise<Result<User[]>> {
    const users = Array.from(this.data.users.values());
    return { success: true, value: users };
  }
}