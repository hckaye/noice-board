import { describe, it, expect } from 'vitest'
import { NoiceAmount } from '../../../src/domain/value-objects/NoiceAmount'

describe('NoiceAmount', () => {
  describe('正常なケース', () => {
    it('正の整数でNoiceAmountを作成できる', () => {
      const amount = NoiceAmount.create(100)
      expect(amount.getValue()).toBe(100)
    })

    it('0でNoiceAmountを作成できる', () => {
      const amount = NoiceAmount.create(0)
      expect(amount.getValue()).toBe(0)
    })

    it('最大値でNoiceAmountを作成できる', () => {
      const amount = NoiceAmount.create(999999)
      expect(amount.getValue()).toBe(999999)
    })
  })

  describe('異常なケース', () => {
    it('負の数でNoiceAmountを作成しようとするとエラーが発生する', () => {
      expect(() => NoiceAmount.create(-1)).toThrow('いいね数は0以上である必要があります')
    })

    it('最大値を超える数でNoiceAmountを作成しようとするとエラーが発生する', () => {
      expect(() => NoiceAmount.create(1000000)).toThrow('いいね数は999999以下である必要があります')
    })

    it('小数点を含む数でNoiceAmountを作成しようとするとエラーが発生する', () => {
      expect(() => NoiceAmount.create(100.5)).toThrow('いいね数は整数である必要があります')
    })
  })

  describe('等価性', () => {
    it('同じ値のNoiceAmountは等しい', () => {
      const amount1 = NoiceAmount.create(100)
      const amount2 = NoiceAmount.create(100)
      expect(amount1.equals(amount2)).toBe(true)
    })

    it('異なる値のNoiceAmountは等しくない', () => {
      const amount1 = NoiceAmount.create(100)
      const amount2 = NoiceAmount.create(200)
      expect(amount1.equals(amount2)).toBe(false)
    })
  })

  describe('演算', () => {
    it('NoiceAmountを加算できる', () => {
      const amount1 = NoiceAmount.create(100)
      const amount2 = NoiceAmount.create(50)
      const result = amount1.add(amount2)
      expect(result.getValue()).toBe(150)
    })

    it('NoiceAmountを減算できる', () => {
      const amount1 = NoiceAmount.create(100)
      const amount2 = NoiceAmount.create(50)
      const result = amount1.subtract(amount2)
      expect(result.getValue()).toBe(50)
    })

    it('減算結果が負になる場合はエラーが発生する', () => {
      const amount1 = NoiceAmount.create(50)
      const amount2 = NoiceAmount.create(100)
      expect(() => amount1.subtract(amount2)).toThrow('減算結果が負の値になります')
    })

    it('加算結果が最大値を超える場合はエラーが発生する', () => {
      const amount1 = NoiceAmount.create(999999)
      const amount2 = NoiceAmount.create(1)
      expect(() => amount1.add(amount2)).toThrow('加算結果が最大値を超えます')
    })

    it('より大きいかどうかを判定できる', () => {
      const amount1 = NoiceAmount.create(100)
      const amount2 = NoiceAmount.create(50)
      expect(amount1.isGreaterThan(amount2)).toBe(true)
      expect(amount2.isGreaterThan(amount1)).toBe(false)
    })

    it('以上かどうかを判定できる', () => {
      const amount1 = NoiceAmount.create(100)
      const amount2 = NoiceAmount.create(100)
      const amount3 = NoiceAmount.create(50)
      expect(amount1.isGreaterThanOrEqual(amount2)).toBe(true)
      expect(amount1.isGreaterThanOrEqual(amount3)).toBe(true)
      expect(amount3.isGreaterThanOrEqual(amount1)).toBe(false)
    })
  })
})
