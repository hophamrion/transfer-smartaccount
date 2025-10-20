/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Smart,
  Smart_BatchTransferExecuted,
  Smart_TransferExecuted,
} from "generated";

Smart.BatchTransferExecuted.handler(async ({ event, context }) => {
  const entity: Smart_BatchTransferExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    smartAccount: event.params.smartAccount,
    recipientCount: event.params.recipientCount,
    totalValue: event.params.totalValue,
    transferType: event.params.transferType,
    tokenAddress: event.params.tokenAddress,
    timestamp: event.params.timestamp,
    userOpHash: event.params.userOpHash,
  };

  context.Smart_BatchTransferExecuted.set(entity);
});

Smart.TransferExecuted.handler(async ({ event, context }) => {
  const entity: Smart_TransferExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    smartAccount: event.params.smartAccount,
    to: event.params.to,
    value: event.params.value,
    transferType: event.params.transferType,
    tokenAddress: event.params.tokenAddress,
    timestamp: event.params.timestamp,
    userOpHash: event.params.userOpHash,
  };

  context.Smart_TransferExecuted.set(entity);
});
