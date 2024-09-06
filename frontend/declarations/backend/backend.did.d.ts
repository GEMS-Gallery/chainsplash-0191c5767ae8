import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AccountId = string;
export type Amount = bigint;
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Amount } |
  { 'err' : string };
export type Result_2 = { 'ok' : AccountId } |
  { 'err' : string };
export type Time = bigint;
export interface Transaction {
  'id' : TransactionId,
  'to' : AccountId,
  'from' : AccountId,
  'timestamp' : Time,
  'amount' : Amount,
}
export type TransactionId = string;
export interface _SERVICE {
  'createAccount' : ActorMethod<[], Result_2>,
  'getBalance' : ActorMethod<[AccountId], Result_1>,
  'getTransactionHistory' : ActorMethod<[AccountId], Array<Transaction>>,
  'importAccount' : ActorMethod<[AccountId], Result>,
  'sendICP' : ActorMethod<[AccountId, Array<AccountId>, Array<Amount>], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
