/**
 * レビューステータス値オブジェクト
 *
 * ビジネスルール:
 * - レビューステータスは「レビュー待ち」「対応予定」「そのまま」のいずれか
 * - 不正な値は受け付けない
 *
 * 実装方針: interface、typeと関数で実装
 */

/**
 * レビューステータスの値定義
 */
export const REVIEW_STATUS_VALUES = {
  PENDING: "レビュー待ち",
  SCHEDULED: "対応予定",
  AS_IS: "そのまま",
  COMPLETED: "対応済み",
} as const;

/**
 * レビューステータスの型定義
 */
export type ReviewStatusValue =
  (typeof REVIEW_STATUS_VALUES)[keyof typeof REVIEW_STATUS_VALUES];

/**
 * レビューステータス値オブジェクトの型定義
 */
export interface ReviewStatus {
  readonly value: ReviewStatusValue;
}

/**
 * レビューステータスが有効かどうか判定する
 */
export const isValidReviewStatus = (
  value: string,
): value is ReviewStatusValue => {
  return Object.values(REVIEW_STATUS_VALUES).includes(
    value as ReviewStatusValue,
  );
};

/**
 * レビューステータスを作成する
 */
export const createReviewStatus = (value: ReviewStatusValue): ReviewStatus => {
  if (!isValidReviewStatus(value)) {
    throw new Error(`無効なレビューステータスです: ${value}`);
  }

  return { value };
};

/**
 * レビュー待ちステータスを作成する
 */
export const createPendingReviewStatus = (): ReviewStatus => {
  return createReviewStatus(REVIEW_STATUS_VALUES.PENDING);
};

/**
 * 対応予定ステータスを作成する
 */
export const createScheduledReviewStatus = (): ReviewStatus => {
  return createReviewStatus(REVIEW_STATUS_VALUES.SCHEDULED);
};

/**
 * そのままステータスを作成する
 */
export const createAsIsReviewStatus = (): ReviewStatus => {
  return createReviewStatus(REVIEW_STATUS_VALUES.AS_IS);
};

/**
 * 対応済みステータスを作成する
 */
export const createCompletedReviewStatus = (): ReviewStatus => {
  return createReviewStatus(REVIEW_STATUS_VALUES.COMPLETED);
};

/**
 * レビューステータスの値を取得する
 */
export const getReviewStatusValue = (
  reviewStatus: ReviewStatus,
): ReviewStatusValue => {
  return reviewStatus.value;
};

/**
 * レビューステータスの等価性を判定する
 */
export const isReviewStatusEqual = (
  status1: ReviewStatus,
  status2: ReviewStatus,
): boolean => {
  return status1.value === status2.value;
};

/**
 * レビュー待ちかどうか判定する
 */
export const isPendingReview = (reviewStatus: ReviewStatus): boolean => {
  return reviewStatus.value === REVIEW_STATUS_VALUES.PENDING;
};

/**
 * 対応予定かどうか判定する
 */
export const isScheduledReview = (reviewStatus: ReviewStatus): boolean => {
  return reviewStatus.value === REVIEW_STATUS_VALUES.SCHEDULED;
};

/**
 * そのままかどうか判定する
 */
export const isAsIsReview = (reviewStatus: ReviewStatus): boolean => {
  return reviewStatus.value === REVIEW_STATUS_VALUES.AS_IS;
};

/**
 * 対応済みかどうか判定する
 */
export const isCompletedReview = (reviewStatus: ReviewStatus): boolean => {
  return reviewStatus.value === REVIEW_STATUS_VALUES.COMPLETED;
};
