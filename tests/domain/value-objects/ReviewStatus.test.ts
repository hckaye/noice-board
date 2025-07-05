import { describe, it, expect } from "vitest";
import {
  createReviewStatus,
  createPendingReviewStatus,
  createScheduledReviewStatus,
  createAsIsReviewStatus,
  getReviewStatusValue,
  isReviewStatusEqual,
  isPendingReview,
  isScheduledReview,
  isAsIsReview,
  isValidReviewStatus,
  REVIEW_STATUS_VALUES,
} from "../../../src/domain/value-objects/ReviewStatus";

describe("ReviewStatus", () => {
  describe("createReviewStatus", () => {
    it("有効なレビューステータスでレビューステータスを作成できる", () => {
      const reviewStatus = createReviewStatus(REVIEW_STATUS_VALUES.PENDING);

      expect(getReviewStatusValue(reviewStatus)).toBe(
        REVIEW_STATUS_VALUES.PENDING,
      );
    });

    it("無効なレビューステータスでエラーが発生する", () => {
      expect(() => createReviewStatus("無効なステータス" as never)).toThrow(
        "無効なレビューステータスです: 無効なステータス",
      );
    });
  });

  describe("createPendingReviewStatus", () => {
    it("レビュー待ちステータスを作成できる", () => {
      const reviewStatus = createPendingReviewStatus();

      expect(getReviewStatusValue(reviewStatus)).toBe(
        REVIEW_STATUS_VALUES.PENDING,
      );
      expect(isPendingReview(reviewStatus)).toBe(true);
      expect(isScheduledReview(reviewStatus)).toBe(false);
      expect(isAsIsReview(reviewStatus)).toBe(false);
    });
  });

  describe("createScheduledReviewStatus", () => {
    it("対応予定ステータスを作成できる", () => {
      const reviewStatus = createScheduledReviewStatus();

      expect(getReviewStatusValue(reviewStatus)).toBe(
        REVIEW_STATUS_VALUES.SCHEDULED,
      );
      expect(isPendingReview(reviewStatus)).toBe(false);
      expect(isScheduledReview(reviewStatus)).toBe(true);
      expect(isAsIsReview(reviewStatus)).toBe(false);
    });
  });

  describe("createAsIsReviewStatus", () => {
    it("そのままステータスを作成できる", () => {
      const reviewStatus = createAsIsReviewStatus();

      expect(getReviewStatusValue(reviewStatus)).toBe(
        REVIEW_STATUS_VALUES.AS_IS,
      );
      expect(isPendingReview(reviewStatus)).toBe(false);
      expect(isScheduledReview(reviewStatus)).toBe(false);
      expect(isAsIsReview(reviewStatus)).toBe(true);
    });
  });

  describe("isReviewStatusEqual", () => {
    it("同じレビューステータスの場合はtrueを返す", () => {
      const status1 = createPendingReviewStatus();
      const status2 = createPendingReviewStatus();

      expect(isReviewStatusEqual(status1, status2)).toBe(true);
    });

    it("異なるレビューステータスの場合はfalseを返す", () => {
      const status1 = createPendingReviewStatus();
      const status2 = createScheduledReviewStatus();

      expect(isReviewStatusEqual(status1, status2)).toBe(false);
    });
  });

  describe("isValidReviewStatus", () => {
    it("有効なレビューステータスの場合はtrueを返す", () => {
      expect(isValidReviewStatus(REVIEW_STATUS_VALUES.PENDING)).toBe(true);
      expect(isValidReviewStatus(REVIEW_STATUS_VALUES.SCHEDULED)).toBe(true);
      expect(isValidReviewStatus(REVIEW_STATUS_VALUES.AS_IS)).toBe(true);
    });

    it("無効なレビューステータスの場合はfalseを返す", () => {
      expect(isValidReviewStatus("無効なステータス")).toBe(false);
      expect(isValidReviewStatus("")).toBe(false);
    });
  });

  describe("ステータス判定関数", () => {
    it("レビュー待ちステータスを正しく判定する", () => {
      const pendingStatus = createPendingReviewStatus();
      const scheduledStatus = createScheduledReviewStatus();
      const asIsStatus = createAsIsReviewStatus();

      expect(isPendingReview(pendingStatus)).toBe(true);
      expect(isPendingReview(scheduledStatus)).toBe(false);
      expect(isPendingReview(asIsStatus)).toBe(false);
    });

    it("対応予定ステータスを正しく判定する", () => {
      const pendingStatus = createPendingReviewStatus();
      const scheduledStatus = createScheduledReviewStatus();
      const asIsStatus = createAsIsReviewStatus();

      expect(isScheduledReview(pendingStatus)).toBe(false);
      expect(isScheduledReview(scheduledStatus)).toBe(true);
      expect(isScheduledReview(asIsStatus)).toBe(false);
    });

    it("そのままステータスを正しく判定する", () => {
      const pendingStatus = createPendingReviewStatus();
      const scheduledStatus = createScheduledReviewStatus();
      const asIsStatus = createAsIsReviewStatus();

      expect(isAsIsReview(pendingStatus)).toBe(false);
      expect(isAsIsReview(scheduledStatus)).toBe(false);
      expect(isAsIsReview(asIsStatus)).toBe(true);
    });
  });
});
