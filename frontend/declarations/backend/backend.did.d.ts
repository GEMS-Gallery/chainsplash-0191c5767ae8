import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Amount = number;
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Amount } |
  { 'err' : string };
export type Result_2 = { 'ok' : WalletId } |
  { 'err' : string };
export type Time = bigint;
export interface Transaction {
  'id' : TransactionId,
  'to' : WalletId,
  'from' : WalletId,
  'timestamp' : Time,
  'amount' : Amount,
}
export type TransactionId = string;
export type WalletId = string;
export interface _SERVICE {
  'createWallet' : ActorMethod<[], Result_2>,
  'getBalance' : ActorMethod<[WalletId], Result_1>,
  'getTransactionHistory' : ActorMethod<[WalletId], Array<Transaction>>,
  'sendICP' : ActorMethod<[WalletId, Array<WalletId>, Array<Amount>], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
