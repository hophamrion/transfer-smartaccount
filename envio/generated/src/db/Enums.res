module ContractType = {
  @genType
  type t = 
    | @as("Event") Event

  let name = "CONTRACT_TYPE"
  let variants = [
    Event,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

module EntityType = {
  @genType
  type t = 
    | @as("Event_BatchTransferExecuted") Event_BatchTransferExecuted
    | @as("Event_TransferExecuted") Event_TransferExecuted
    | @as("Event_TransferFailed") Event_TransferFailed
    | @as("dynamic_contract_registry") DynamicContractRegistry

  let name = "ENTITY_TYPE"
  let variants = [
    Event_BatchTransferExecuted,
    Event_TransferExecuted,
    Event_TransferFailed,
    DynamicContractRegistry,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

let allEnums = ([
  ContractType.config->Internal.fromGenericEnumConfig,
  EntityType.config->Internal.fromGenericEnumConfig,
])
