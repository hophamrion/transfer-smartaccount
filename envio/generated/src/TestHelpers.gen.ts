/* TypeScript file generated from TestHelpers.res by genType. */

/* eslint-disable */
/* tslint:disable */

const TestHelpersJS = require('./TestHelpers.res.js');

import type {Event_BatchTransferExecuted_event as Types_Event_BatchTransferExecuted_event} from './Types.gen';

import type {Event_TransferExecuted_event as Types_Event_TransferExecuted_event} from './Types.gen';

import type {Event_TransferFailed_event as Types_Event_TransferFailed_event} from './Types.gen';

import type {t as Address_t} from 'envio/src/Address.gen';

import type {t as TestHelpers_MockDb_t} from './TestHelpers_MockDb.gen';

/** The arguements that get passed to a "processEvent" helper function */
export type EventFunctions_eventProcessorArgs<event> = {
  readonly event: event; 
  readonly mockDb: TestHelpers_MockDb_t; 
  readonly chainId?: number
};

export type EventFunctions_eventProcessor<event> = (_1:EventFunctions_eventProcessorArgs<event>) => Promise<TestHelpers_MockDb_t>;

export type EventFunctions_MockBlock_t = {
  readonly hash?: string; 
  readonly number?: number; 
  readonly timestamp?: number
};

export type EventFunctions_MockTransaction_t = {};

export type EventFunctions_mockEventData = {
  readonly chainId?: number; 
  readonly srcAddress?: Address_t; 
  readonly logIndex?: number; 
  readonly block?: EventFunctions_MockBlock_t; 
  readonly transaction?: EventFunctions_MockTransaction_t
};

export type Event_BatchTransferExecuted_createMockArgs = {
  readonly smartAccount?: Address_t; 
  readonly recipientCount?: bigint; 
  readonly totalValue?: bigint; 
  readonly transferType?: string; 
  readonly tokenAddress?: Address_t; 
  readonly timestamp?: bigint; 
  readonly userOpHash?: string; 
  readonly mockEventData?: EventFunctions_mockEventData
};

export type Event_TransferExecuted_createMockArgs = {
  readonly smartAccount?: Address_t; 
  readonly to?: Address_t; 
  readonly value?: bigint; 
  readonly transferType?: string; 
  readonly tokenAddress?: Address_t; 
  readonly timestamp?: bigint; 
  readonly userOpHash?: string; 
  readonly mockEventData?: EventFunctions_mockEventData
};

export type Event_TransferFailed_createMockArgs = {
  readonly smartAccount?: Address_t; 
  readonly to?: Address_t; 
  readonly value?: bigint; 
  readonly transferType?: string; 
  readonly tokenAddress?: Address_t; 
  readonly reason?: string; 
  readonly timestamp?: bigint; 
  readonly userOpHash?: string; 
  readonly mockEventData?: EventFunctions_mockEventData
};

export const MockDb_createMockDb: () => TestHelpers_MockDb_t = TestHelpersJS.MockDb.createMockDb as any;

export const Addresses_mockAddresses: Address_t[] = TestHelpersJS.Addresses.mockAddresses as any;

export const Addresses_defaultAddress: Address_t = TestHelpersJS.Addresses.defaultAddress as any;

export const Event_BatchTransferExecuted_processEvent: EventFunctions_eventProcessor<Types_Event_BatchTransferExecuted_event> = TestHelpersJS.Event.BatchTransferExecuted.processEvent as any;

export const Event_BatchTransferExecuted_createMockEvent: (args:Event_BatchTransferExecuted_createMockArgs) => Types_Event_BatchTransferExecuted_event = TestHelpersJS.Event.BatchTransferExecuted.createMockEvent as any;

export const Event_TransferExecuted_processEvent: EventFunctions_eventProcessor<Types_Event_TransferExecuted_event> = TestHelpersJS.Event.TransferExecuted.processEvent as any;

export const Event_TransferExecuted_createMockEvent: (args:Event_TransferExecuted_createMockArgs) => Types_Event_TransferExecuted_event = TestHelpersJS.Event.TransferExecuted.createMockEvent as any;

export const Event_TransferFailed_processEvent: EventFunctions_eventProcessor<Types_Event_TransferFailed_event> = TestHelpersJS.Event.TransferFailed.processEvent as any;

export const Event_TransferFailed_createMockEvent: (args:Event_TransferFailed_createMockArgs) => Types_Event_TransferFailed_event = TestHelpersJS.Event.TransferFailed.createMockEvent as any;

export const Addresses: { mockAddresses: Address_t[]; defaultAddress: Address_t } = TestHelpersJS.Addresses as any;

export const MockDb: { createMockDb: () => TestHelpers_MockDb_t } = TestHelpersJS.MockDb as any;

export const Event: {
  TransferFailed: {
    processEvent: EventFunctions_eventProcessor<Types_Event_TransferFailed_event>; 
    createMockEvent: (args:Event_TransferFailed_createMockArgs) => Types_Event_TransferFailed_event
  }; 
  TransferExecuted: {
    processEvent: EventFunctions_eventProcessor<Types_Event_TransferExecuted_event>; 
    createMockEvent: (args:Event_TransferExecuted_createMockArgs) => Types_Event_TransferExecuted_event
  }; 
  BatchTransferExecuted: {
    processEvent: EventFunctions_eventProcessor<Types_Event_BatchTransferExecuted_event>; 
    createMockEvent: (args:Event_BatchTransferExecuted_createMockArgs) => Types_Event_BatchTransferExecuted_event
  }
} = TestHelpersJS.Event as any;
