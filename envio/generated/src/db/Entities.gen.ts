/* TypeScript file generated from Entities.res by genType. */

/* eslint-disable */
/* tslint:disable */

export type id = string;

export type whereOperations<entity,fieldType> = { readonly eq: (_1:fieldType) => Promise<entity[]>; readonly gt: (_1:fieldType) => Promise<entity[]> };

export type Event_BatchTransferExecuted_t = {
  readonly id: id; 
  readonly recipientCount: bigint; 
  readonly smartAccount: string; 
  readonly timestamp: bigint; 
  readonly tokenAddress: string; 
  readonly totalValue: bigint; 
  readonly transferType: string; 
  readonly userOpHash: string
};

export type Event_BatchTransferExecuted_indexedFieldOperations = {};

export type Event_TransferExecuted_t = {
  readonly id: id; 
  readonly smartAccount: string; 
  readonly timestamp: bigint; 
  readonly to: string; 
  readonly tokenAddress: string; 
  readonly transferType: string; 
  readonly userOpHash: string; 
  readonly value: bigint
};

export type Event_TransferExecuted_indexedFieldOperations = {};

export type Event_TransferFailed_t = {
  readonly id: id; 
  readonly reason: string; 
  readonly smartAccount: string; 
  readonly timestamp: bigint; 
  readonly to: string; 
  readonly tokenAddress: string; 
  readonly transferType: string; 
  readonly userOpHash: string; 
  readonly value: bigint
};

export type Event_TransferFailed_indexedFieldOperations = {};
