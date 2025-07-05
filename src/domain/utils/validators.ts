/**
 * バリデーション関数とヘルパー関数
 * 型安全性を確保するために、型ガードや型アサーションを適切に使用
 */

import type {
  UserId,
  PostId,
  Username,
  PostTitle,
  PostContent,
  NoiceAmount,
  RupeeAmount,
  UserDisplayName,
  Result,
  TypeGuard,
  Validator,
  ValidationError,
} from "../types";

/**
 * バリデーションエラーを作成する
 */
export const createValidationError = (
  message: string,
  field?: string,
): ValidationError => ({
  message,
  field,
});

/**
 * 成功結果を作成する
 */
export const createSuccess = <T>(data: T): Result<T> => ({
  success: true,
  data,
});

/**
 * 失敗結果を作成する
 */
export const createFailure = <T>(error: ValidationError): Result<T> => ({
  success: false,
  error,
});

/**
 * UUID v4形式の正規表現
 */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * 英数字の正規表現
 */
const ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9]+$/;

/**
 * 文字列が空でないかチェックする型ガード
 */
export const isNonEmptyString: TypeGuard<string> = (
  value: unknown,
): value is string => {
  return typeof value === "string" && value.trim() !== "";
};

/**
 * 数値が0以上かチェックする型ガード
 */
export const isNonNegativeNumber: TypeGuard<number> = (
  value: unknown,
): value is number => {
  return (
    typeof value === "number" &&
    !isNaN(value) &&
    value >= 0 &&
    Number.isInteger(value)
  );
};

/**
 * UUID形式かチェックする型ガード
 */
export const isValidUUID: TypeGuard<string> = (
  value: unknown,
): value is string => {
  return typeof value === "string" && UUID_PATTERN.test(value);
};

/**
 * 英数字のみかチェックする型ガード
 */
export const isAlphanumeric: TypeGuard<string> = (
  value: unknown,
): value is string => {
  return typeof value === "string" && ALPHANUMERIC_PATTERN.test(value);
};

/**
 * UserIdのバリデーター
 */
export const validateUserId: Validator<UserId> = (
  value: unknown,
): Result<UserId> => {
  if (!isNonEmptyString(value)) {
    return createFailure(
      createValidationError("UserIdは空であってはいけません"),
    );
  }

  if (!isValidUUID(value)) {
    return createFailure(
      createValidationError("UserIdはUUID形式である必要があります"),
    );
  }
  return createSuccess(value as UserId);
};

/**
 * PostIdのバリデーター
 */
export const validatePostId: Validator<PostId> = (
  value: unknown,
): Result<PostId> => {
  if (!isNonEmptyString(value)) {
    return createFailure(
      createValidationError("PostIdは空であってはいけません"),
    );
  }

  if (!isValidUUID(value)) {
    return createFailure(
      createValidationError("PostIdはUUID形式である必要があります"),
    );
  }
  return createSuccess(value as PostId);
};

/**
 * Usernameのバリデーター
 */
export const validateUsername: Validator<Username> = (
  value: unknown,
): Result<Username> => {
  if (!isNonEmptyString(value)) {
    return createFailure(
      createValidationError("ユーザー名は空であってはいけません"),
    );
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length < 3) {
    return createFailure(
      createValidationError("ユーザー名は3文字以上である必要があります"),
    );
  }

  if (trimmedValue.length > 20) {
    return createFailure(
      createValidationError("ユーザー名は20文字以下である必要があります"),
    );
  }

  if (!isAlphanumeric(trimmedValue)) {
    return createFailure(
      createValidationError("ユーザー名は英数字のみ使用可能です"),
    );
  }

  return createSuccess(trimmedValue as Username);
};

/**
 * PostTitleのバリデーター
 */
export const validatePostTitle: Validator<PostTitle> = (
  value: unknown,
): Result<PostTitle> => {
  if (!isNonEmptyString(value)) {
    return createFailure(
      createValidationError("タイトルは空であってはいけません"),
    );
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length > 100) {
    return createFailure(
      createValidationError("タイトルは100文字以下である必要があります"),
    );
  }

  return createSuccess(trimmedValue as PostTitle);
};

/**
 * PostContentのバリデーター
 */
export const validatePostContent: Validator<PostContent> = (
  value: unknown,
): Result<PostContent> => {
  if (!isNonEmptyString(value)) {
    return createFailure(createValidationError("本文は空であってはいけません"));
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length > 1000) {
    return createFailure(
      createValidationError("本文は1000文字以下である必要があります"),
    );
  }

  return createSuccess(trimmedValue as PostContent);
};

/**
 * NoiceAmountのバリデーター
 */
export const validateNoiceAmount: Validator<NoiceAmount> = (
  value: unknown,
): Result<NoiceAmount> => {
  if (typeof value !== "number") {
    return createFailure(
      createValidationError("いいね数は数値である必要があります"),
    );
  }

  if (isNaN(value)) {
    return createFailure(
      createValidationError("いいね数は有効な数値である必要があります"),
    );
  }

  if (!Number.isInteger(value)) {
    return createFailure(
      createValidationError("いいね数は整数である必要があります"),
    );
  }

  if (value < 0) {
    return createFailure(
      createValidationError("いいね数は0以上である必要があります"),
    );
  }

  if (value > 999999) {
    return createFailure(
      createValidationError("いいね数は999999以下である必要があります"),
    );
  }

  return createSuccess(value as NoiceAmount);
};

/**
 * RupeeAmountのバリデーター
 */
export const validateRupeeAmount: Validator<RupeeAmount> = (
  value: unknown,
): Result<RupeeAmount> => {
  if (!isNonNegativeNumber(value)) {
    return createFailure(
      createValidationError("ルピー数は0以上の整数である必要があります"),
    );
  }

  return createSuccess(value as RupeeAmount);
};

/**
 * UserDisplayNameのバリデーター
 */
export const validateUserDisplayName: Validator<UserDisplayName> = (
  value: unknown,
): Result<UserDisplayName> => {
  if (!isNonEmptyString(value)) {
    return createFailure(
      createValidationError("表示名は空であってはいけません"),
    );
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length > 100) {
    return createFailure(
      createValidationError("表示名は100文字以下である必要があります"),
    );
  }

  return createSuccess(trimmedValue as UserDisplayName);
};

/**
 * UUIDを生成する
 */
export const generateUUID = (): string => crypto.randomUUID();

/**
 * UserIdを生成する
 */
export const generateUserId = (): UserId => generateUUID() as UserId;

/**
 * PostIdを生成する
 */
export const generatePostId = (): PostId => generateUUID() as PostId;
