import { describe, it, expect } from "vitest";
import {
  createPost,
  createNewPost,
  updatePostTitle,
  updatePostContent,
  updatePost,
  addNoiceToPost,
  isPostAuthor,
  isPostEqual,
  getPostId,
  getPostTitle,
  getPostContent,
  getPostAuthorId,
  getPostTotalNoiceAmount,
  getPostCreatedAt,
  getPostUpdatedAt,
  getPostReviewStatus,
  updatePostReviewStatus,
  getPostReviewComments,
  addReviewCommentToPost,
  getPostReviewCommentCount,
  getPostComments,
  addCommentToPost,
  getPostCommentCount,
  getPostNoices,
  getPostNoiceCount,
} from "../../../src/domain/entities/Post";
import {
  createPostIdOrThrow,
  isPostIdEqual,
} from "../../../src/domain/value-objects/PostId";
import {
  createPostTitleOrThrow,
  isPostTitleEqual,
} from "../../../src/domain/value-objects/PostTitle";
import {
  createPostContentOrThrow,
  isPostContentEqual,
} from "../../../src/domain/value-objects/PostContent";
import {
  createUserIdOrThrow,
  isUserIdEqual,
} from "../../../src/domain/value-objects/UserId";
import {
  createNoiceAmountOrThrow,
} from "../../../src/domain/value-objects/NoiceAmount";
import {
  createPendingReviewStatus,
  createScheduledReviewStatus,
  createAsIsReviewStatus,
  isReviewStatusEqual,
  isPendingReview,
} from "../../../src/domain/value-objects/ReviewStatus";
import {
  createNewNoice,
  createNewNoiceWithComment,
  addNoiceToNoice,
} from "../../../src/domain/entities/Noice";

describe("Post", () => {
  const postId = createPostIdOrThrow("550e8400-e29b-41d4-a716-446655440000");
  const title = createPostTitleOrThrow("テスト投稿のタイトル");
  const content = createPostContentOrThrow("これはテスト投稿の本文です。");
  const authorId = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440001");
  const reviewStatus = createPendingReviewStatus();
  const reviewComments = [];
  const comments = [];
  const noices = [];
  const now = new Date();

  describe("投稿の作成", () => {
    it("有効な値でPostを作成できる", () => {
      const post = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );

      expect(isPostIdEqual(getPostId(post), postId)).toBe(true);
      expect(isPostTitleEqual(getPostTitle(post), title)).toBe(true);
      expect(isPostContentEqual(getPostContent(post), content)).toBe(true);
      expect(isUserIdEqual(getPostAuthorId(post), authorId)).toBe(true);
      expect(getPostTotalNoiceAmount(post)).toBe(0);
      expect(isReviewStatusEqual(getPostReviewStatus(post), reviewStatus)).toBe(
        true,
      );
      expect(getPostReviewComments(post)).toEqual(reviewComments);
      expect(getPostComments(post)).toEqual(comments);
      expect(getPostNoices(post)).toEqual(noices);
      expect(getPostCreatedAt(post)).toBe(now);
      expect(getPostUpdatedAt(post)).toBe(now);
    });

    it("新しいPostを生成できる", () => {
      const newPost = createNewPost(title, content, authorId);

      expect(isPostTitleEqual(getPostTitle(newPost), title)).toBe(true);
      expect(isPostContentEqual(getPostContent(newPost), content)).toBe(true);
      expect(isUserIdEqual(getPostAuthorId(newPost), authorId)).toBe(true);
      expect(getPostTotalNoiceAmount(newPost)).toBe(0);
      expect(isPendingReview(getPostReviewStatus(newPost))).toBe(true);
      expect(getPostReviewCommentCount(newPost)).toBe(0);
      expect(getPostCommentCount(newPost)).toBe(0);
      expect(getPostNoiceCount(newPost)).toBe(0);
      expect(getPostCreatedAt(newPost)).toBeInstanceOf(Date);
      expect(getPostUpdatedAt(newPost)).toBeInstanceOf(Date);
    });
  });

  describe("投稿の編集", () => {
    it("タイトルを更新できる", () => {
      const post = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );
      const newTitle = createPostTitleOrThrow("更新されたタイトル");

      const updatedPost = updatePostTitle(post, newTitle);

      expect(isPostTitleEqual(getPostTitle(updatedPost), newTitle)).toBe(true);
    });

    it("本文を更新できる", () => {
      const post = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );
      const newContent = createPostContentOrThrow("更新された本文です。");

      const updatedPost = updatePostContent(post, newContent);

      expect(isPostContentEqual(getPostContent(updatedPost), newContent)).toBe(
        true,
      );
    });

    it("タイトルと本文を同時に更新できる", () => {
      const post = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );
      const newTitle = createPostTitleOrThrow("新しいタイトル");
      const newContent = createPostContentOrThrow("新しい本文です。");

      const updatedPost = updatePost(post, newTitle, newContent);

      expect(isPostTitleEqual(getPostTitle(updatedPost), newTitle)).toBe(true);
      expect(isPostContentEqual(getPostContent(updatedPost), newContent)).toBe(
        true,
      );
    });
  });

  describe("いいねの管理", () => {
    it("いいねを追加できる", () => {
      const post = createNewPost(title, content, authorId);
      const noiceUser = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");
      const amount = createNoiceAmountOrThrow(100);
      const noice = createNewNoice(noiceUser, getPostId(post), amount);

      const updatedPost = addNoiceToPost(post, noice);

      expect(getPostNoiceCount(updatedPost)).toBe(1);
      expect(getPostTotalNoiceAmount(updatedPost)).toBe(100);
    });

    it("複数のいいねを追加できる", () => {
      const post = createNewPost(title, content, authorId);
      const user1 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");
      const user2 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440003");
      const amount1 = createNoiceAmountOrThrow(50);
      const amount2 = createNoiceAmountOrThrow(150);
      
      const noice1 = createNewNoice(user1, getPostId(post), amount1);
      const noice2 = createNewNoiceWithComment(user2, getPostId(post), amount2, "素晴らしい！");

      const postWithNoice1 = addNoiceToPost(post, noice1);
      const postWithNoice2 = addNoiceToPost(postWithNoice1, noice2);

      expect(getPostNoiceCount(postWithNoice2)).toBe(2);
      expect(getPostTotalNoiceAmount(postWithNoice2)).toBe(200);
    });

    it("0いいねから始まる", () => {
      const post = createNewPost(title, content, authorId);
      
      expect(getPostTotalNoiceAmount(post)).toBe(0);
      expect(getPostNoiceCount(post)).toBe(0);
    });

    it("いいねへのいいねも含めて総いいね数を計算する", () => {
      const post = createNewPost(title, content, authorId);
      const user1 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");
      const user2 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440003");
      const user3 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440004");
      
      // 投稿への直接いいね（100ポイント）
      const mainNoice = createNewNoice(user1, getPostId(post), createNoiceAmountOrThrow(100));
      
      // いいねへのいいね（50ポイント）
      const subNoice = createNewNoice(user2, getPostId(post), createNoiceAmountOrThrow(50));
      
      // さらにいいねへのいいね（30ポイント）
      const subSubNoice = createNewNoice(user3, getPostId(post), createNoiceAmountOrThrow(30));
      const subNoiceWithSubSubNoice = addNoiceToNoice(subNoice, subSubNoice);
      const finalMainNoice = addNoiceToNoice(mainNoice, subNoiceWithSubSubNoice);
      
      const updatedPost = addNoiceToPost(post, finalMainNoice);

      // 投稿の総いいね数は100 + (50 + 30) = 180
      expect(getPostTotalNoiceAmount(updatedPost)).toBe(180);
      expect(getPostNoiceCount(updatedPost)).toBe(1); // 直接の投稿いいね数
    });

    it("複数の投稿いいね、それぞれにサブいいねがある場合", () => {
      const post = createNewPost(title, content, authorId);
      const user1 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");
      const user2 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440003");
      const user3 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440004");
      const user4 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440005");
      
      // 1つ目の投稿いいね（100ポイント）とそのサブいいね（25ポイント）
      const noice1 = createNewNoice(user1, getPostId(post), createNoiceAmountOrThrow(100));
      const subNoice1 = createNewNoice(user3, getPostId(post), createNoiceAmountOrThrow(25));
      const noice1WithSub = addNoiceToNoice(noice1, subNoice1);
      
      // 2つ目の投稿いいね（75ポイント）とそのサブいいね（40ポイント）
      const noice2 = createNewNoice(user2, getPostId(post), createNoiceAmountOrThrow(75));
      const subNoice2 = createNewNoice(user4, getPostId(post), createNoiceAmountOrThrow(40));
      const noice2WithSub = addNoiceToNoice(noice2, subNoice2);
      
      let updatedPost = addNoiceToPost(post, noice1WithSub);
      updatedPost = addNoiceToPost(updatedPost, noice2WithSub);

      // 総いいね数: (100 + 25) + (75 + 40) = 240
      expect(getPostTotalNoiceAmount(updatedPost)).toBe(240);
      expect(getPostNoiceCount(updatedPost)).toBe(2); // 直接の投稿いいね数
    });
  });

  describe("レビューステータスの管理", () => {
    it("レビューステータスを更新できる", () => {
      const post = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );
      const newReviewStatus = createScheduledReviewStatus();

      const updatedPost = updatePostReviewStatus(post, newReviewStatus);

      expect(
        isReviewStatusEqual(getPostReviewStatus(updatedPost), newReviewStatus),
      ).toBe(true);
    });

    it("レビューステータス更新時に更新日時が変更される", () => {
      const post = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );
      const originalUpdatedAt = getPostUpdatedAt(post);
      const newReviewStatus = createAsIsReviewStatus();

      const updatedPost = updatePostReviewStatus(post, newReviewStatus);

      expect(getPostUpdatedAt(updatedPost)).not.toBe(originalUpdatedAt);
      expect(
        isReviewStatusEqual(getPostReviewStatus(updatedPost), newReviewStatus),
      ).toBe(true);
    });
  });

  describe("レビューコメントの管理", () => {
    it("レビューコメントを追加できる", () => {
      const post = createNewPost(title, content, authorId);
      const reviewerId = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");
      const commentContent = "これは良い投稿ですね。";

      const updatedPost = addReviewCommentToPost(post, commentContent, reviewerId);

      expect(getPostReviewCommentCount(updatedPost)).toBe(1);
      const reviewComments = getPostReviewComments(updatedPost);
      expect(reviewComments).toHaveLength(1);
      expect(reviewComments[0].content).toBe(commentContent);
    });

    it("複数のレビューコメントを追加できる", () => {
      const post = createNewPost(title, content, authorId);
      const reviewerId1 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");
      const reviewerId2 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440003");
      
      const postWithComment1 = addReviewCommentToPost(post, "コメント1", reviewerId1);
      const postWithComment2 = addReviewCommentToPost(postWithComment1, "コメント2", reviewerId2);

      expect(getPostReviewCommentCount(postWithComment2)).toBe(2);
    });

    it("レビューコメント追加時に更新日時が変更される", () => {
      const post = createNewPost(title, content, authorId);
      const originalUpdatedAt = getPostUpdatedAt(post);
      const reviewerId = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");

      const updatedPost = addReviewCommentToPost(post, "テストコメント", reviewerId);

      expect(getPostUpdatedAt(updatedPost)).not.toBe(originalUpdatedAt);
    });
  });

  describe("コメントの管理", () => {
    it("コメントを追加できる", () => {
      const post = createNewPost(title, content, authorId);
      const commenterId = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");
      const commentContent = "面白い投稿ですね！";

      const updatedPost = addCommentToPost(post, commentContent, commenterId);

      expect(getPostCommentCount(updatedPost)).toBe(1);
      const postComments = getPostComments(updatedPost);
      expect(postComments).toHaveLength(1);
      expect(postComments[0].content).toBe(commentContent);
    });

    it("複数のコメントを追加できる", () => {
      const post = createNewPost(title, content, authorId);
      const commenter1 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");
      const commenter2 = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440003");
      
      const postWithComment1 = addCommentToPost(post, "良い記事ですね", commenter1);
      const postWithComment2 = addCommentToPost(postWithComment1, "参考になりました", commenter2);

      expect(getPostCommentCount(postWithComment2)).toBe(2);
    });

    it("コメント追加時に更新日時が変更される", () => {
      const post = createNewPost(title, content, authorId);
      const originalUpdatedAt = getPostUpdatedAt(post);
      const commenterId = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");

      const updatedPost = addCommentToPost(post, "テストコメント", commenterId);

      expect(getPostUpdatedAt(updatedPost)).not.toBe(originalUpdatedAt);
    });

    it("長いコメントも追加できる", () => {
      const post = createNewPost(title, content, authorId);
      const commenterId = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");
      const longComment = "これは長いコメントです。".repeat(50); // 約1000文字

      const updatedPost = addCommentToPost(post, longComment, commenterId);

      expect(getPostCommentCount(updatedPost)).toBe(1);
      const postComments = getPostComments(updatedPost);
      expect(postComments[0].content).toBe(longComment);
    });
  });

  describe("投稿者の判定", () => {
    it("指定されたユーザーが投稿者かどうか判定できる", () => {
      const post = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );
      const otherUserId = createUserIdOrThrow(
        "550e8400-e29b-41d4-a716-446655440002",
      );

      expect(isPostAuthor(post, authorId)).toBe(true);
      expect(isPostAuthor(post, otherUserId)).toBe(false);
    });
  });

  describe("等価性", () => {
    it("同じIDのPostは等しい", () => {
      const post1 = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );
      const post2 = createPost(
        postId,
        createPostTitleOrThrow("Different Title"),
        createPostContentOrThrow("Different content"),
        createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002"),
        reviewStatus,
        reviewComments,
        comments,
        noices,
        new Date(),
        new Date(),
      );

      expect(isPostEqual(post1, post2)).toBe(true);
    });

    it("異なるIDのPostは等しくない", () => {
      const differentPostId = createPostIdOrThrow(
        "550e8400-e29b-41d4-a716-446655440003",
      );
      const post1 = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );
      const post2 = createPost(
        differentPostId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );

      expect(isPostEqual(post1, post2)).toBe(false);
    });
  });

  describe("不変条件", () => {
    it("累計いいね数は常に0以上である", () => {
      const post = createNewPost(title, content, authorId);
      expect(getPostTotalNoiceAmount(post)).toBe(0);

      const noiceUser = createUserIdOrThrow("550e8400-e29b-41d4-a716-446655440002");
      const amount = createNoiceAmountOrThrow(100);
      const noice = createNewNoice(noiceUser, getPostId(post), amount);
      const updatedPost = addNoiceToPost(post, noice);
      
      expect(getPostTotalNoiceAmount(updatedPost)).toBe(100);
    });

    it("作成日時は更新されない", () => {
      const post = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );
      const originalCreatedAt = getPostCreatedAt(post);

      const updatedPost = updatePostTitle(
        post,
        createPostTitleOrThrow("新しいタイトル"),
      );

      expect(getPostCreatedAt(updatedPost)).toBe(originalCreatedAt);
    });

    it("更新日時は編集時に更新される", () => {
      const post = createPost(
        postId,
        title,
        content,
        authorId,
        reviewStatus,
        reviewComments,
        comments,
        noices,
        now,
        now,
      );
      const originalUpdatedAt = getPostUpdatedAt(post);

      // 少し時間を空ける
      setTimeout(() => {
        const updatedPost = updatePostTitle(
          post,
          createPostTitleOrThrow("新しいタイトル"),
        );
        expect(getPostUpdatedAt(updatedPost)).not.toBe(originalUpdatedAt);
      }, 1);
    });
  });
});
