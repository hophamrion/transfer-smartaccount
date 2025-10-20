/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Entrypoint,
  Entrypoint_AccountDeposited,
  Entrypoint_AccountWithdrawn,
  Entrypoint_Deposited,
  Entrypoint_UserOperationEvent,
  Entrypoint_UserOperationRevertReason,
  Entrypoint_Withdrawn,
} from "generated";

Entrypoint.AccountDeposited.handler(async ({ event, context }) => {
  const entity: Entrypoint_AccountDeposited = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
    totalDeposit: event.params.totalDeposit,
  };

  context.Entrypoint_AccountDeposited.set(entity);
});

Entrypoint.AccountWithdrawn.handler(async ({ event, context }) => {
  const entity: Entrypoint_AccountWithdrawn = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
    totalDeposit: event.params.totalDeposit,
  };

  context.Entrypoint_AccountWithdrawn.set(entity);
});

Entrypoint.Deposited.handler(async ({ event, context }) => {
  const entity: Entrypoint_Deposited = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    paymaster: event.params.paymaster,
    oldBalance: event.params.oldBalance,
    newBalance: event.params.newBalance,
  };

  context.Entrypoint_Deposited.set(entity);
});

Entrypoint.UserOperationEvent.handler(async ({ event, context }) => {
  const entity: Entrypoint_UserOperationEvent = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    userOpHash: event.params.userOpHash,
    sender: event.params.sender,
    paymaster: event.params.paymaster,
    nonce: event.params.nonce,
    success: event.params.success,
    actualGasCost: event.params.actualGasCost,
    actualGasUsed: event.params.actualGasUsed,
  };

  context.Entrypoint_UserOperationEvent.set(entity);
});

Entrypoint.UserOperationRevertReason.handler(async ({ event, context }) => {
  const entity: Entrypoint_UserOperationRevertReason = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    userOpHash: event.params.userOpHash,
    sender: event.params.sender,
    nonce: event.params.nonce,
    revertReason: event.params.revertReason,
  };

  context.Entrypoint_UserOperationRevertReason.set(entity);
});

Entrypoint.Withdrawn.handler(async ({ event, context }) => {
  const entity: Entrypoint_Withdrawn = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    paymaster: event.params.paymaster,
    withdrawAmount: event.params.withdrawAmount,
  };

  context.Entrypoint_Withdrawn.set(entity);
});
