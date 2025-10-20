/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */

export const handleBatchTransferExecuted = async ({
  event,
  context,
}: any) => {
  const entity = {
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
};

export const handleTransferExecuted = async ({
  event,
  context,
}: any) => {
  const entity = {
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
};

export const handleTransferFailed = async ({
  event,
  context,
}: any) => {
  const entity = {
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
};
