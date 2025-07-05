/**
 * ドメイン共通型定義
 * 型の再利用を促進するために、共通の型定義をモジュール化
 */

/**
 * ブランド型を作成するためのヘルパー型
 */
export type Brand<T, U> = T & { readonly __brand: U };

/**
 * UUID形式の文字列型
 */
export type UUIDString = Brand<string, "UUID">;

/**
 * 数値型（0以上）
 */
export type NonNegativeNumber = Brand<number, "NonNegativeNumber">;

/**
 * 数値型（正の数）
 */
export type PositiveNumber = Brand<number, "PositiveNumber">;

/**
 * 空でない文字列型
 */
export type NonEmptyString = Brand<string, "NonEmptyString">;

/**
 * 英数字のみの文字列型
 */
export type AlphanumericString = Brand<string, "Alphanumeric">;

/**
 * ユーザーID型
 */
export type UserId = Brand<string, "UserId">;

/**
 * ポストID型
 */
export type PostId = Brand<string, "PostId">;

/**
 * ユーザー名型（3-20文字の英数字）
 */
export type Username = Brand<string, "Username">;

/**
 * ポストタイトル型（1-100文字）
 */
export type PostTitle = Brand<string, "PostTitle">;

/**
 * ポストコンテンツ型（1-1000文字）
 */
export type PostContent = Brand<string, "PostContent">;

/**
 * いいね数型（0以上の整数）
 */
export type NoiceAmount = Brand<number, "NoiceAmount">;

/**
 * ルピー数型（0以上の整数）
 */
export type RupeeAmount = Brand<number, "RupeeAmount">;

/**
 * ユーザー表示名型（1-100文字）
 */
export type UserDisplayName = Brand<string, "UserDisplayName">;

/**
 * エラー結果型
 */
export type ValidationError = {
  readonly message: string;
  readonly field?: string;
};

/**
 * 結果型（成功または失敗）
 */
export type Result<T, E = ValidationError> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/**
 * 型ガード関数の型
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * バリデーション関数の型
 */
export type Validator<T> = (value: unknown) => Result<T>;
