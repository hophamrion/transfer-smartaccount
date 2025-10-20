/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  event,
  Event_BatchTransferExecuted,
  Event_TransferExecuted,
  Event_TransferFailed,
} from "generated";

event.BatchTransferExecuted.handler(async ({ event, context }) => {
  const entity: Event_BatchTransferExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    smartAccount: event.params.smartAccount,
    recipientCount: event.params.recipientCount,
    totalValue: event.params.totalValue,
    transferType: event.params.transferType,
    tokenAddress: event.params.tokenAddress,
    timestamp: event.params.timestamp,
    userOpHash: event.params.userOpHash,
  };

  context.Event_BatchTransferExecuted.set(entity);
});

event.TransferExecuted.handler(async ({ event, context }) => {
  const entity: Event_TransferExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    smartAccount: event.params.smartAccount,
    to: event.params.to,
    value: event.params.value,
    transferType: event.params.transferType,
    tokenAddress: event.params.tokenAddress,
    timestamp: event.params.timestamp,
    userOpHash: event.params.userOpHash,
  };

  context.Event_TransferExecuted.set(entity);
});

event.TransferFailed.handler(async ({ event, context }) => {
  const entity: Event_TransferFailed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    smartAccount: event.params.smartAccount,
    to: event.params.to,
    value: event.params.value,
    transferType: event.params.transferType,
    tokenAddress: event.params.tokenAddress,
    reason: event.params.reason,
    timestamp: event.params.timestamp,
    userOpHash: event.params.userOpHash,
  };

  context.Event_TransferFailed.set(entity);
});
