/* TypeScript file generated from Handlers.res by genType. */

/* eslint-disable */
/* tslint:disable */

const HandlersJS = require('./Handlers.res.js');

import type {Event_BatchTransferExecuted_eventFilters as Types_Event_BatchTransferExecuted_eventFilters} from './Types.gen';

import type {Event_BatchTransferExecuted_event as Types_Event_BatchTransferExecuted_event} from './Types.gen';

import type {Event_TransferExecuted_eventFilters as Types_Event_TransferExecuted_eventFilters} from './Types.gen';

import type {Event_TransferExecuted_event as Types_Event_TransferExecuted_event} from './Types.gen';

import type {Event_TransferFailed_eventFilters as Types_Event_TransferFailed_eventFilters} from './Types.gen';

import type {Event_TransferFailed_event as Types_Event_TransferFailed_event} from './Types.gen';

import type {HandlerTypes_eventConfig as Types_HandlerTypes_eventConfig} from './Types.gen';

import type {chain as Types_chain} from './Types.gen';

import type {contractRegistrations as Types_contractRegistrations} from './Types.gen';

import type {fnWithEventConfig as Types_fnWithEventConfig} from './Types.gen';

import type {genericContractRegisterArgs as Internal_genericContractRegisterArgs} from 'envio/src/Internal.gen';

import type {genericContractRegister as Internal_genericContractRegister} from 'envio/src/Internal.gen';

import type {genericHandlerArgs as Internal_genericHandlerArgs} from 'envio/src/Internal.gen';

import type {genericHandler as Internal_genericHandler} from 'envio/src/Internal.gen';

import type {handlerContext as Types_handlerContext} from './Types.gen';

import type {onBlockArgs as Envio_onBlockArgs} from 'envio/src/Envio.gen';

import type {onBlockOptions as Envio_onBlockOptions} from 'envio/src/Envio.gen';

export const Event_BatchTransferExecuted_contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_Event_BatchTransferExecuted_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_Event_BatchTransferExecuted_eventFilters>> = HandlersJS.Event.BatchTransferExecuted.contractRegister as any;

export const Event_BatchTransferExecuted_handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_Event_BatchTransferExecuted_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_Event_BatchTransferExecuted_eventFilters>> = HandlersJS.Event.BatchTransferExecuted.handler as any;

export const Event_TransferExecuted_contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_Event_TransferExecuted_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_Event_TransferExecuted_eventFilters>> = HandlersJS.Event.TransferExecuted.contractRegister as any;

export const Event_TransferExecuted_handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_Event_TransferExecuted_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_Event_TransferExecuted_eventFilters>> = HandlersJS.Event.TransferExecuted.handler as any;

export const Event_TransferFailed_contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_Event_TransferFailed_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_Event_TransferFailed_eventFilters>> = HandlersJS.Event.TransferFailed.contractRegister as any;

export const Event_TransferFailed_handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_Event_TransferFailed_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_Event_TransferFailed_eventFilters>> = HandlersJS.Event.TransferFailed.handler as any;

/** Register a Block Handler. It'll be called for every block by default. */
export const onBlock: (_1:Envio_onBlockOptions<Types_chain>, _2:((_1:Envio_onBlockArgs<Types_handlerContext>) => Promise<void>)) => void = HandlersJS.onBlock as any;

export const Event: {
  TransferFailed: {
    handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_Event_TransferFailed_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_Event_TransferFailed_eventFilters>>; 
    contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_Event_TransferFailed_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_Event_TransferFailed_eventFilters>>
  }; 
  TransferExecuted: {
    handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_Event_TransferExecuted_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_Event_TransferExecuted_eventFilters>>; 
    contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_Event_TransferExecuted_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_Event_TransferExecuted_eventFilters>>
  }; 
  BatchTransferExecuted: {
    handler: Types_fnWithEventConfig<Internal_genericHandler<Internal_genericHandlerArgs<Types_Event_BatchTransferExecuted_event,Types_handlerContext,void>>,Types_HandlerTypes_eventConfig<Types_Event_BatchTransferExecuted_eventFilters>>; 
    contractRegister: Types_fnWithEventConfig<Internal_genericContractRegister<Internal_genericContractRegisterArgs<Types_Event_BatchTransferExecuted_event,Types_contractRegistrations>>,Types_HandlerTypes_eventConfig<Types_Event_BatchTransferExecuted_eventFilters>>
  }
} = HandlersJS.Event as any;
