// This file is to dynamically generate TS types
// which we can't get using GenType
// Use @genType.import to link the types back to ReScript code

import type { Logger, EffectCaller } from "envio";
import type * as Entities from "./db/Entities.gen.ts";

export type HandlerContext = {
  /**
   * Access the logger instance with event as a context. The logs will be displayed in the console and Envio Hosted Service.
   */
  readonly log: Logger;
  /**
   * Call the provided Effect with the given input.
   * Effects are the best for external calls with automatic deduplication, error handling and caching.
   * Define a new Effect using createEffect outside of the handler.
   */
  readonly effect: EffectCaller;
  /**
   * True when the handlers run in preload mode - in parallel for the whole batch.
   * Handlers run twice per batch of events, and the first time is the "preload" run
   * During preload entities aren't set, logs are ignored and exceptions are silently swallowed.
   * Preload mode is the best time to populate data to in-memory cache.
   * After preload the handler will run for the second time in sequential order of events.
   */
  readonly isPreload: boolean;
  readonly Event_BatchTransferExecuted: {
    /**
     * Load the entity Event_BatchTransferExecuted from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Event_BatchTransferExecuted_t | undefined>,
    /**
     * Load the entity Event_BatchTransferExecuted from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Event_BatchTransferExecuted_t>,
    readonly getWhere: Entities.Event_BatchTransferExecuted_indexedFieldOperations,
    /**
     * Returns the entity Event_BatchTransferExecuted from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Event_BatchTransferExecuted_t) => Promise<Entities.Event_BatchTransferExecuted_t>,
    /**
     * Set the entity Event_BatchTransferExecuted in the storage.
     */
    readonly set: (entity: Entities.Event_BatchTransferExecuted_t) => void,
    /**
     * Delete the entity Event_BatchTransferExecuted from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Event_TransferExecuted: {
    /**
     * Load the entity Event_TransferExecuted from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Event_TransferExecuted_t | undefined>,
    /**
     * Load the entity Event_TransferExecuted from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Event_TransferExecuted_t>,
    readonly getWhere: Entities.Event_TransferExecuted_indexedFieldOperations,
    /**
     * Returns the entity Event_TransferExecuted from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Event_TransferExecuted_t) => Promise<Entities.Event_TransferExecuted_t>,
    /**
     * Set the entity Event_TransferExecuted in the storage.
     */
    readonly set: (entity: Entities.Event_TransferExecuted_t) => void,
    /**
     * Delete the entity Event_TransferExecuted from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly Event_TransferFailed: {
    /**
     * Load the entity Event_TransferFailed from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.Event_TransferFailed_t | undefined>,
    /**
     * Load the entity Event_TransferFailed from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.Event_TransferFailed_t>,
    readonly getWhere: Entities.Event_TransferFailed_indexedFieldOperations,
    /**
     * Returns the entity Event_TransferFailed from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.Event_TransferFailed_t) => Promise<Entities.Event_TransferFailed_t>,
    /**
     * Set the entity Event_TransferFailed in the storage.
     */
    readonly set: (entity: Entities.Event_TransferFailed_t) => void,
    /**
     * Delete the entity Event_TransferFailed from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
};

