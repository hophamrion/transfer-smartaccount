/* TypeScript file generated from Types.res by genType. */

/* eslint-disable */
/* tslint:disable */

import type {Event_BatchTransferExecuted_t as Entities_Event_BatchTransferExecuted_t} from '../src/db/Entities.gen';

import type {Event_TransferExecuted_t as Entities_Event_TransferExecuted_t} from '../src/db/Entities.gen';

import type {Event_TransferFailed_t as Entities_Event_TransferFailed_t} from '../src/db/Entities.gen';

import type {HandlerContext as $$handlerContext} from './Types.ts';

import type {HandlerWithOptions as $$fnWithEventConfig} from './bindings/OpaqueTypes.ts';

import type {SingleOrMultiple as $$SingleOrMultiple_t} from './bindings/OpaqueTypes';

import type {eventOptions as Internal_eventOptions} from 'envio/src/Internal.gen';

import type {genericContractRegisterArgs as Internal_genericContractRegisterArgs} from 'envio/src/Internal.gen';

import type {genericContractRegister as Internal_genericContractRegister} from 'envio/src/Internal.gen';

import type {genericEvent as Internal_genericEvent} from 'envio/src/Internal.gen';

import type {genericHandlerArgs as Internal_genericHandlerArgs} from 'envio/src/Internal.gen';

import type {genericHandler as Internal_genericHandler} from 'envio/src/Internal.gen';

import type {logger as Envio_logger} from 'envio/src/Envio.gen';

import type {t as Address_t} from 'envio/src/Address.gen';

export type id = string;
export type Id = id;

export type contractRegistrations = { readonly log: Envio_logger; readonly addEvent: (_1:Address_t) => void };

export type entityHandlerContext<entity,indexedFieldOperations> = {
  readonly get: (_1:id) => Promise<(undefined | entity)>; 
  readonly getOrThrow: (_1:id, message:(undefined | string)) => Promise<entity>; 
  readonly getWhere: indexedFieldOperations; 
  readonly getOrCreate: (_1:entity) => Promise<entity>; 
  readonly set: (_1:entity) => void; 
  readonly deleteUnsafe: (_1:id) => void
};

export type handlerContext = $$handlerContext;

export type event_BatchTransferExecuted = Entities_Event_BatchTransferExecuted_t;
export type Event_BatchTransferExecuted = event_BatchTransferExecuted;

export type event_TransferExecuted = Entities_Event_TransferExecuted_t;
export type Event_TransferExecuted = event_TransferExecuted;

export type event_TransferFailed = Entities_Event_TransferFailed_t;
export type Event_TransferFailed = event_TransferFailed;

export type eventIdentifier = {
  readonly chainId: number; 
  readonly blockTimestamp: number; 
  readonly blockNumber: number; 
  readonly logIndex: number
};

export type entityUpdateAction<entityType> = "Delete" | { TAG: "Set"; _0: entityType };

export type entityUpdate<entityType> = {
  readonly eventIdentifier: eventIdentifier; 
  readonly entityId: id; 
  readonly entityUpdateAction: entityUpdateAction<entityType>
};

export type entityValueAtStartOfBatch<entityType> = 
    "NotSet"
  | { TAG: "AlreadySet"; _0: entityType };

export type updatedValue<entityType> = {
  readonly latest: entityUpdate<entityType>; 
  readonly history: entityUpdate<entityType>[]; 
  readonly containsRollbackDiffChange: boolean
};

export type inMemoryStoreRowEntity<entityType> = 
    { TAG: "Updated"; _0: updatedValue<entityType> }
  | { TAG: "InitialReadFromDb"; _0: entityValueAtStartOfBatch<entityType> };

export type Transaction_t = {};

export type Block_t = {
  readonly number: number; 
  readonly timestamp: number; 
  readonly hash: string
};

export type AggregatedBlock_t = {
  readonly hash: string; 
  readonly number: number; 
  readonly timestamp: number
};

export type AggregatedTransaction_t = {};

export type eventLog<params> = Internal_genericEvent<params,Block_t,Transaction_t>;
export type EventLog<params> = eventLog<params>;

export type SingleOrMultiple_t<a> = $$SingleOrMultiple_t<a>;

export type HandlerTypes_args<eventArgs,context> = { readonly event: eventLog<eventArgs>; readonly context: context };

export type HandlerTypes_contractRegisterArgs<eventArgs> = Internal_genericContractRegisterArgs<eventLog<eventArgs>,contractRegistrations>;

export type HandlerTypes_contractRegister<eventArgs> = Internal_genericContractRegister<HandlerTypes_contractRegisterArgs<eventArgs>>;

export type HandlerTypes_eventConfig<eventFilters> = Internal_eventOptions<eventFilters>;

export type fnWithEventConfig<fn,eventConfig> = $$fnWithEventConfig<fn,eventConfig>;

export type contractRegisterWithOptions<eventArgs,eventFilters> = fnWithEventConfig<HandlerTypes_contractRegister<eventArgs>,HandlerTypes_eventConfig<eventFilters>>;

export type Event_chainId = 10143;

export type Event_BatchTransferExecuted_eventArgs = {
  readonly smartAccount: Address_t; 
  readonly recipientCount: bigint; 
  readonly totalValue: bigint; 
  readonly transferType: string; 
  readonly tokenAddress: Address_t; 
  readonly timestamp: bigint; 
  readonly userOpHash: string
};

export type Event_BatchTransferExecuted_block = Block_t;

export type Event_BatchTransferExecuted_transaction = Transaction_t;

export type Event_BatchTransferExecuted_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: Event_BatchTransferExecuted_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: Event_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: Event_BatchTransferExecuted_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: Event_BatchTransferExecuted_block
};

export type Event_BatchTransferExecuted_handlerArgs = Internal_genericHandlerArgs<Event_BatchTransferExecuted_event,handlerContext,void>;

export type Event_BatchTransferExecuted_handler = Internal_genericHandler<Event_BatchTransferExecuted_handlerArgs>;

export type Event_BatchTransferExecuted_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<Event_BatchTransferExecuted_event,contractRegistrations>>;

export type Event_BatchTransferExecuted_eventFilter = { readonly smartAccount?: SingleOrMultiple_t<Address_t>; readonly userOpHash?: SingleOrMultiple_t<string> };

export type Event_BatchTransferExecuted_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: Event_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type Event_BatchTransferExecuted_eventFiltersDefinition = 
    Event_BatchTransferExecuted_eventFilter
  | Event_BatchTransferExecuted_eventFilter[];

export type Event_BatchTransferExecuted_eventFilters = 
    Event_BatchTransferExecuted_eventFilter
  | Event_BatchTransferExecuted_eventFilter[]
  | ((_1:Event_BatchTransferExecuted_eventFiltersArgs) => Event_BatchTransferExecuted_eventFiltersDefinition);

export type Event_TransferExecuted_eventArgs = {
  readonly smartAccount: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint; 
  readonly transferType: string; 
  readonly tokenAddress: Address_t; 
  readonly timestamp: bigint; 
  readonly userOpHash: string
};

export type Event_TransferExecuted_block = Block_t;

export type Event_TransferExecuted_transaction = Transaction_t;

export type Event_TransferExecuted_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: Event_TransferExecuted_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: Event_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: Event_TransferExecuted_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: Event_TransferExecuted_block
};

export type Event_TransferExecuted_handlerArgs = Internal_genericHandlerArgs<Event_TransferExecuted_event,handlerContext,void>;

export type Event_TransferExecuted_handler = Internal_genericHandler<Event_TransferExecuted_handlerArgs>;

export type Event_TransferExecuted_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<Event_TransferExecuted_event,contractRegistrations>>;

export type Event_TransferExecuted_eventFilter = {
  readonly smartAccount?: SingleOrMultiple_t<Address_t>; 
  readonly to?: SingleOrMultiple_t<Address_t>; 
  readonly userOpHash?: SingleOrMultiple_t<string>
};

export type Event_TransferExecuted_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: Event_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type Event_TransferExecuted_eventFiltersDefinition = 
    Event_TransferExecuted_eventFilter
  | Event_TransferExecuted_eventFilter[];

export type Event_TransferExecuted_eventFilters = 
    Event_TransferExecuted_eventFilter
  | Event_TransferExecuted_eventFilter[]
  | ((_1:Event_TransferExecuted_eventFiltersArgs) => Event_TransferExecuted_eventFiltersDefinition);

export type Event_TransferFailed_eventArgs = {
  readonly smartAccount: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint; 
  readonly transferType: string; 
  readonly tokenAddress: Address_t; 
  readonly reason: string; 
  readonly timestamp: bigint; 
  readonly userOpHash: string
};

export type Event_TransferFailed_block = Block_t;

export type Event_TransferFailed_transaction = Transaction_t;

export type Event_TransferFailed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: Event_TransferFailed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: Event_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: Event_TransferFailed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: Event_TransferFailed_block
};

export type Event_TransferFailed_handlerArgs = Internal_genericHandlerArgs<Event_TransferFailed_event,handlerContext,void>;

export type Event_TransferFailed_handler = Internal_genericHandler<Event_TransferFailed_handlerArgs>;

export type Event_TransferFailed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<Event_TransferFailed_event,contractRegistrations>>;

export type Event_TransferFailed_eventFilter = {
  readonly smartAccount?: SingleOrMultiple_t<Address_t>; 
  readonly to?: SingleOrMultiple_t<Address_t>; 
  readonly userOpHash?: SingleOrMultiple_t<string>
};

export type Event_TransferFailed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: Event_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type Event_TransferFailed_eventFiltersDefinition = 
    Event_TransferFailed_eventFilter
  | Event_TransferFailed_eventFilter[];

export type Event_TransferFailed_eventFilters = 
    Event_TransferFailed_eventFilter
  | Event_TransferFailed_eventFilter[]
  | ((_1:Event_TransferFailed_eventFiltersArgs) => Event_TransferFailed_eventFiltersDefinition);

export type chainId = number;

export type chain = 10143;
