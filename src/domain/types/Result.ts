// Result型: 成功・失敗・エラー情報を型安全に表現

export type Result<T, E = ResultError> =
  | { success: true; value: T }
  | { success: false; error: E };

export type ResultError = {
  code: string;
  message: string;
};
