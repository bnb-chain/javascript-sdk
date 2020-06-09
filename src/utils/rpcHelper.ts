import Big, { BigSource } from "big.js"

import {
  AminoPrefix,
  NewOrderMsg,
  CancelOrderMsg,
  SendMsg,
  BaseMsg,
  BurnTokenMsg,
  IssueTokenMsg,
  FreezeTokenMsg,
  UnFreezeTokenMsg,
  TimeLockMsg,
  TimeUnlockMsg,
  MintTokenMsg,
  TimeReLockMsg,
} from "../types"

export const BASENUMBER = Math.pow(10, 8)

export const divide = (num: BigSource) => {
  return +new Big(num).div(BASENUMBER).toString()
}

export const convertObjectArrayNum = <T extends { [k: string]: BigSource }>(
  objArr: Array<T>,
  keys: Array<keyof T>
): void => {
  objArr.forEach((item) => {
    keys.forEach((key) => {
      item[key] = divide(item[key]) as any
    })
  })
}

//TODO add gov and swap
export const getMsgByAminoPrefix = (aminoPrefix: string) => {
  switch (aminoPrefix.toUpperCase()) {
    case AminoPrefix.NewOrderMsg:
      return NewOrderMsg
    case AminoPrefix.CancelOrderMsg:
      return CancelOrderMsg
    case AminoPrefix.MsgSend:
      return SendMsg
    case AminoPrefix.IssueMsg:
      return IssueTokenMsg
    case AminoPrefix.FreezeMsg:
      return FreezeTokenMsg
    case AminoPrefix.UnfreezeMsg:
      return UnFreezeTokenMsg
    case AminoPrefix.BurnMsg:
      return BurnTokenMsg
    case AminoPrefix.MintMsg:
      return MintTokenMsg
    case AminoPrefix.TimeLockMsg:
      return TimeLockMsg
    case AminoPrefix.TimeRelockMsg:
      return TimeReLockMsg
    case AminoPrefix.TimeUnlockMsg:
      return TimeUnlockMsg
    default:
      return BaseMsg
  }
}
