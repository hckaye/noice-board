// NoiceLimit: 1ユーザーがグループにつけられるNoice数の上限を表す値オブジェクト

export type NoiceLimit = number & { readonly brand: unique symbol };

export const createNoiceLimit = (value: number): NoiceLimit => {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error("NoiceLimit must be a positive integer");
  }
  return value as NoiceLimit;
};
