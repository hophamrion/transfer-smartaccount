//*************
//***ENTITIES**
//*************
@genType.as("Id")
type id = string

@genType
type contractRegistrations = {
  log: Envio.logger,
  // TODO: only add contracts we've registered for the event in the config
  addEvent: (Address.t) => unit,
}

@genType
type entityHandlerContext<'entity, 'indexedFieldOperations> = {
  get: id => promise<option<'entity>>,
  getOrThrow: (id, ~message: string=?) => promise<'entity>,
  getWhere: 'indexedFieldOperations,
  getOrCreate: ('entity) => promise<'entity>,
  set: 'entity => unit,
  deleteUnsafe: id => unit,
}

@genType.import(("./Types.ts", "HandlerContext"))
type handlerContext = {
  log: Envio.logger,
  effect: 'input 'output. (Envio.effect<'input, 'output>, 'input) => promise<'output>,
  isPreload: bool,
  @as("Event_BatchTransferExecuted") event_BatchTransferExecuted: entityHandlerContext<Entities.Event_BatchTransferExecuted.t, Entities.Event_BatchTransferExecuted.indexedFieldOperations>,
  @as("Event_TransferExecuted") event_TransferExecuted: entityHandlerContext<Entities.Event_TransferExecuted.t, Entities.Event_TransferExecuted.indexedFieldOperations>,
  @as("Event_TransferFailed") event_TransferFailed: entityHandlerContext<Entities.Event_TransferFailed.t, Entities.Event_TransferFailed.indexedFieldOperations>,
}

//Re-exporting types for backwards compatability
@genType.as("Event_BatchTransferExecuted")
type event_BatchTransferExecuted = Entities.Event_BatchTransferExecuted.t
@genType.as("Event_TransferExecuted")
type event_TransferExecuted = Entities.Event_TransferExecuted.t
@genType.as("Event_TransferFailed")
type event_TransferFailed = Entities.Event_TransferFailed.t

type eventIdentifier = {
  chainId: int,
  blockTimestamp: int,
  blockNumber: int,
  logIndex: int,
}

type entityUpdateAction<'entityType> =
  | Set('entityType)
  | Delete

type entityUpdate<'entityType> = {
  eventIdentifier: eventIdentifier,
  entityId: id,
  entityUpdateAction: entityUpdateAction<'entityType>,
}

let mkEntityUpdate = (~eventIdentifier, ~entityId, entityUpdateAction) => {
  entityId,
  eventIdentifier,
  entityUpdateAction,
}

type entityValueAtStartOfBatch<'entityType> =
  | NotSet // The entity isn't in the DB yet
  | AlreadySet('entityType)

type updatedValue<'entityType> = {
  latest: entityUpdate<'entityType>,
  history: array<entityUpdate<'entityType>>,
  // In the event of a rollback, some entity updates may have been
  // been affected by a rollback diff. If there was no rollback diff
  // this will always be false.
  // If there was a rollback diff, this will be false in the case of a
  // new entity update (where entity affected is not present in the diff) b
  // but true if the update is related to an entity that is
  // currently present in the diff
  containsRollbackDiffChange: bool,
}

@genType
type inMemoryStoreRowEntity<'entityType> =
  | Updated(updatedValue<'entityType>)
  | InitialReadFromDb(entityValueAtStartOfBatch<'entityType>) // This means there is no change from the db.

//*************
//**CONTRACTS**
//*************

module Transaction = {
  @genType
  type t = {}

  let schema = S.object((_): t => {})
}

module Block = {
  @genType
  type t = {number: int, timestamp: int, hash: string}

  let schema = S.object((s): t => {number: s.field("number", S.int), timestamp: s.field("timestamp", S.int), hash: s.field("hash", S.string)})

  @get
  external getNumber: Internal.eventBlock => int = "number"

  @get
  external getTimestamp: Internal.eventBlock => int = "timestamp"
 
  @get
  external getId: Internal.eventBlock => string = "hash"

  let cleanUpRawEventFieldsInPlace: Js.Json.t => () = %raw(`fields => {
    delete fields.hash
    delete fields.number
    delete fields.timestamp
  }`)
}

module AggregatedBlock = {
  @genType
  type t = {hash: string, number: int, timestamp: int}
}
module AggregatedTransaction = {
  @genType
  type t = {}
}

@genType.as("EventLog")
type eventLog<'params> = Internal.genericEvent<'params, Block.t, Transaction.t>

module SingleOrMultiple: {
  @genType.import(("./bindings/OpaqueTypes", "SingleOrMultiple"))
  type t<'a>
  let normalizeOrThrow: (t<'a>, ~nestedArrayDepth: int=?) => array<'a>
  let single: 'a => t<'a>
  let multiple: array<'a> => t<'a>
} = {
  type t<'a> = Js.Json.t

  external single: 'a => t<'a> = "%identity"
  external multiple: array<'a> => t<'a> = "%identity"
  external castMultiple: t<'a> => array<'a> = "%identity"
  external castSingle: t<'a> => 'a = "%identity"

  exception AmbiguousEmptyNestedArray

  let rec isMultiple = (t: t<'a>, ~nestedArrayDepth): bool =>
    switch t->Js.Json.decodeArray {
    | None => false
    | Some(_arr) if nestedArrayDepth == 0 => true
    | Some([]) if nestedArrayDepth > 0 =>
      AmbiguousEmptyNestedArray->ErrorHandling.mkLogAndRaise(
        ~msg="The given empty array could be interperated as a flat array (value) or nested array. Since it's ambiguous,
        please pass in a nested empty array if the intention is to provide an empty array as a value",
      )
    | Some(arr) => arr->Js.Array2.unsafe_get(0)->isMultiple(~nestedArrayDepth=nestedArrayDepth - 1)
    }

  let normalizeOrThrow = (t: t<'a>, ~nestedArrayDepth=0): array<'a> => {
    if t->isMultiple(~nestedArrayDepth) {
      t->castMultiple
    } else {
      [t->castSingle]
    }
  }
}

module HandlerTypes = {
  @genType
  type args<'eventArgs, 'context> = {
    event: eventLog<'eventArgs>,
    context: 'context,
  }

  @genType
  type contractRegisterArgs<'eventArgs> = Internal.genericContractRegisterArgs<eventLog<'eventArgs>, contractRegistrations>
  @genType
  type contractRegister<'eventArgs> = Internal.genericContractRegister<contractRegisterArgs<'eventArgs>>


  @genType
  type eventConfig<'eventFilters> = Internal.eventOptions<'eventFilters>
}

module type Event = {
  type event

  let handlerRegister: EventRegister.t

  type eventFilters
}

@genType.import(("./bindings/OpaqueTypes.ts", "HandlerWithOptions"))
type fnWithEventConfig<'fn, 'eventConfig> = ('fn, ~eventConfig: 'eventConfig=?) => unit

type handlerWithOptions<'eventArgs, 'eventFilters> = fnWithEventConfig<
  Internal.genericHandler<'eventArgs>,
  HandlerTypes.eventConfig<'eventFilters>,
>

@genType
type contractRegisterWithOptions<'eventArgs, 'eventFilters> = fnWithEventConfig<
  HandlerTypes.contractRegister<'eventArgs>,
  HandlerTypes.eventConfig<'eventFilters>,
>

module MakeRegister = (Event: Event) => {
  let contractRegister: fnWithEventConfig<
    Internal.genericContractRegister<
      Internal.genericContractRegisterArgs<Event.event, contractRegistrations>,
    >,
    HandlerTypes.eventConfig<Event.eventFilters>,
  > = (contractRegister, ~eventConfig=?) =>
    Event.handlerRegister->EventRegister.setContractRegister(
      contractRegister,
      ~eventOptions=eventConfig,
    )

  let handler: fnWithEventConfig<
    Internal.genericHandler<Internal.genericHandlerArgs<Event.event, handlerContext, unit>>,
    HandlerTypes.eventConfig<Event.eventFilters>,
  > = (handler, ~eventConfig=?) => {
    Event.handlerRegister->EventRegister.setHandler(
      handler->(
        Utils.magic: Internal.genericHandler<
          Internal.genericHandlerArgs<Event.event, handlerContext, unit>,
        > => Internal.genericHandler<
          Internal.genericHandlerArgs<Event.event, Internal.handlerContext, 'a>,
        >
      ),
      ~eventOptions=eventConfig,
    )
  }
}

module Event = {
let abi = Ethers.makeAbi((%raw(`[{"type":"event","name":"BatchTransferExecuted","inputs":[{"name":"smartAccount","type":"address","indexed":true},{"name":"recipientCount","type":"uint256","indexed":false},{"name":"totalValue","type":"uint256","indexed":false},{"name":"transferType","type":"string","indexed":false},{"name":"tokenAddress","type":"address","indexed":false},{"name":"timestamp","type":"uint256","indexed":false},{"name":"userOpHash","type":"bytes32","indexed":true}],"anonymous":false},{"type":"event","name":"TransferExecuted","inputs":[{"name":"smartAccount","type":"address","indexed":true},{"name":"to","type":"address","indexed":true},{"name":"value","type":"uint256","indexed":false},{"name":"transferType","type":"string","indexed":false},{"name":"tokenAddress","type":"address","indexed":false},{"name":"timestamp","type":"uint256","indexed":false},{"name":"userOpHash","type":"bytes32","indexed":true}],"anonymous":false},{"type":"event","name":"TransferFailed","inputs":[{"name":"smartAccount","type":"address","indexed":true},{"name":"to","type":"address","indexed":true},{"name":"value","type":"uint256","indexed":false},{"name":"transferType","type":"string","indexed":false},{"name":"tokenAddress","type":"address","indexed":false},{"name":"reason","type":"string","indexed":false},{"name":"timestamp","type":"uint256","indexed":false},{"name":"userOpHash","type":"bytes32","indexed":true}],"anonymous":false}]`): Js.Json.t))
let eventSignatures = ["BatchTransferExecuted(address indexed smartAccount, uint256 recipientCount, uint256 totalValue, string transferType, address tokenAddress, uint256 timestamp, bytes32 indexed userOpHash)", "TransferExecuted(address indexed smartAccount, address indexed to, uint256 value, string transferType, address tokenAddress, uint256 timestamp, bytes32 indexed userOpHash)", "TransferFailed(address indexed smartAccount, address indexed to, uint256 value, string transferType, address tokenAddress, string reason, uint256 timestamp, bytes32 indexed userOpHash)"]
@genType type chainId = [#10143]
let contractName = "Event"

module BatchTransferExecuted = {

let id = "0x02641ca6c10b97f8ecceb0343be795bf98941b6486d3a23d8a2ae866b31c5edb_3"
let sighash = "0x02641ca6c10b97f8ecceb0343be795bf98941b6486d3a23d8a2ae866b31c5edb"
let name = "BatchTransferExecuted"
let contractName = contractName

@genType
type eventArgs = {smartAccount: Address.t, recipientCount: bigint, totalValue: bigint, transferType: string, tokenAddress: Address.t, timestamp: bigint, userOpHash: string}
@genType
type block = Block.t
@genType
type transaction = Transaction.t

@genType
type event = {
  /** The parameters or arguments associated with this event. */
  params: eventArgs,
  /** The unique identifier of the blockchain network where this event occurred. */
  chainId: chainId,
  /** The address of the contract that emitted this event. */
  srcAddress: Address.t,
  /** The index of this event's log within the block. */
  logIndex: int,
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  transaction: transaction,
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  block: block,
}

@genType
type handlerArgs = Internal.genericHandlerArgs<event, handlerContext, unit>
@genType
type handler = Internal.genericHandler<handlerArgs>
@genType
type contractRegister = Internal.genericContractRegister<Internal.genericContractRegisterArgs<event, contractRegistrations>>

let paramsRawEventSchema = S.object((s): eventArgs => {smartAccount: s.field("smartAccount", Address.schema), recipientCount: s.field("recipientCount", BigInt.schema), totalValue: s.field("totalValue", BigInt.schema), transferType: s.field("transferType", S.string), tokenAddress: s.field("tokenAddress", Address.schema), timestamp: s.field("timestamp", BigInt.schema), userOpHash: s.field("userOpHash", S.string)})
let blockSchema = Block.schema
let transactionSchema = Transaction.schema

let handlerRegister: EventRegister.t = EventRegister.make(
  ~contractName,
  ~eventName=name,
)

@genType
type eventFilter = {@as("smartAccount") smartAccount?: SingleOrMultiple.t<Address.t>, @as("userOpHash") userOpHash?: SingleOrMultiple.t<string>}

@genType type eventFiltersArgs = {/** The unique identifier of the blockchain network where this event occurred. */ chainId: chainId, /** Addresses of the contracts indexing the event. */ addresses: array<Address.t>}

@genType @unboxed type eventFiltersDefinition = Single(eventFilter) | Multiple(array<eventFilter>)

@genType @unboxed type eventFilters = | ...eventFiltersDefinition | Dynamic(eventFiltersArgs => eventFiltersDefinition)

let register = (): Internal.evmEventConfig => {
  let {getEventFiltersOrThrow, filterByAddresses} = LogSelection.parseEventFiltersOrThrow(~eventFilters=handlerRegister->EventRegister.getEventFilters, ~sighash, ~params=["smartAccount","userOpHash",], ~topic1=(_eventFilter) => _eventFilter->Utils.Dict.dangerouslyGetNonOption("smartAccount")->Belt.Option.mapWithDefault([], topicFilters => topicFilters->Obj.magic->SingleOrMultiple.normalizeOrThrow->Belt.Array.map(TopicFilter.fromAddress)), ~topic2=(_eventFilter) => _eventFilter->Utils.Dict.dangerouslyGetNonOption("userOpHash")->Belt.Option.mapWithDefault([], topicFilters => topicFilters->Obj.magic->SingleOrMultiple.normalizeOrThrow->Belt.Array.map(TopicFilter.castToHexUnsafe)))
  {
    getEventFiltersOrThrow,
    filterByAddresses,
    dependsOnAddresses: !(handlerRegister->EventRegister.isWildcard) || filterByAddresses,
    blockSchema: blockSchema->(Utils.magic: S.t<block> => S.t<Internal.eventBlock>),
    transactionSchema: transactionSchema->(Utils.magic: S.t<transaction> => S.t<Internal.eventTransaction>),
    convertHyperSyncEventArgs: (decodedEvent: HyperSyncClient.Decoder.decodedEvent) => {smartAccount: decodedEvent.indexed->Js.Array2.unsafe_get(0)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, userOpHash: decodedEvent.indexed->Js.Array2.unsafe_get(1)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, recipientCount: decodedEvent.body->Js.Array2.unsafe_get(0)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, totalValue: decodedEvent.body->Js.Array2.unsafe_get(1)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, transferType: decodedEvent.body->Js.Array2.unsafe_get(2)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, tokenAddress: decodedEvent.body->Js.Array2.unsafe_get(3)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, timestamp: decodedEvent.body->Js.Array2.unsafe_get(4)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, }->(Utils.magic: eventArgs => Internal.eventParams),
    id,
  name,
  contractName,
  isWildcard: (handlerRegister->EventRegister.isWildcard),
  handler: handlerRegister->EventRegister.getHandler,
  contractRegister: handlerRegister->EventRegister.getContractRegister,
  paramsRawEventSchema: paramsRawEventSchema->(Utils.magic: S.t<eventArgs> => S.t<Internal.eventParams>),
  }
}
}

module TransferExecuted = {

let id = "0x2e7a05b16aeced4d3b30bd83856d9190c3143c4009858c8100076ee48ba17c3e_4"
let sighash = "0x2e7a05b16aeced4d3b30bd83856d9190c3143c4009858c8100076ee48ba17c3e"
let name = "TransferExecuted"
let contractName = contractName

@genType
type eventArgs = {smartAccount: Address.t, to: Address.t, value: bigint, transferType: string, tokenAddress: Address.t, timestamp: bigint, userOpHash: string}
@genType
type block = Block.t
@genType
type transaction = Transaction.t

@genType
type event = {
  /** The parameters or arguments associated with this event. */
  params: eventArgs,
  /** The unique identifier of the blockchain network where this event occurred. */
  chainId: chainId,
  /** The address of the contract that emitted this event. */
  srcAddress: Address.t,
  /** The index of this event's log within the block. */
  logIndex: int,
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  transaction: transaction,
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  block: block,
}

@genType
type handlerArgs = Internal.genericHandlerArgs<event, handlerContext, unit>
@genType
type handler = Internal.genericHandler<handlerArgs>
@genType
type contractRegister = Internal.genericContractRegister<Internal.genericContractRegisterArgs<event, contractRegistrations>>

let paramsRawEventSchema = S.object((s): eventArgs => {smartAccount: s.field("smartAccount", Address.schema), to: s.field("to", Address.schema), value: s.field("value", BigInt.schema), transferType: s.field("transferType", S.string), tokenAddress: s.field("tokenAddress", Address.schema), timestamp: s.field("timestamp", BigInt.schema), userOpHash: s.field("userOpHash", S.string)})
let blockSchema = Block.schema
let transactionSchema = Transaction.schema

let handlerRegister: EventRegister.t = EventRegister.make(
  ~contractName,
  ~eventName=name,
)

@genType
type eventFilter = {@as("smartAccount") smartAccount?: SingleOrMultiple.t<Address.t>, @as("to") to?: SingleOrMultiple.t<Address.t>, @as("userOpHash") userOpHash?: SingleOrMultiple.t<string>}

@genType type eventFiltersArgs = {/** The unique identifier of the blockchain network where this event occurred. */ chainId: chainId, /** Addresses of the contracts indexing the event. */ addresses: array<Address.t>}

@genType @unboxed type eventFiltersDefinition = Single(eventFilter) | Multiple(array<eventFilter>)

@genType @unboxed type eventFilters = | ...eventFiltersDefinition | Dynamic(eventFiltersArgs => eventFiltersDefinition)

let register = (): Internal.evmEventConfig => {
  let {getEventFiltersOrThrow, filterByAddresses} = LogSelection.parseEventFiltersOrThrow(~eventFilters=handlerRegister->EventRegister.getEventFilters, ~sighash, ~params=["smartAccount","to","userOpHash",], ~topic1=(_eventFilter) => _eventFilter->Utils.Dict.dangerouslyGetNonOption("smartAccount")->Belt.Option.mapWithDefault([], topicFilters => topicFilters->Obj.magic->SingleOrMultiple.normalizeOrThrow->Belt.Array.map(TopicFilter.fromAddress)), ~topic2=(_eventFilter) => _eventFilter->Utils.Dict.dangerouslyGetNonOption("to")->Belt.Option.mapWithDefault([], topicFilters => topicFilters->Obj.magic->SingleOrMultiple.normalizeOrThrow->Belt.Array.map(TopicFilter.fromAddress)), ~topic3=(_eventFilter) => _eventFilter->Utils.Dict.dangerouslyGetNonOption("userOpHash")->Belt.Option.mapWithDefault([], topicFilters => topicFilters->Obj.magic->SingleOrMultiple.normalizeOrThrow->Belt.Array.map(TopicFilter.castToHexUnsafe)))
  {
    getEventFiltersOrThrow,
    filterByAddresses,
    dependsOnAddresses: !(handlerRegister->EventRegister.isWildcard) || filterByAddresses,
    blockSchema: blockSchema->(Utils.magic: S.t<block> => S.t<Internal.eventBlock>),
    transactionSchema: transactionSchema->(Utils.magic: S.t<transaction> => S.t<Internal.eventTransaction>),
    convertHyperSyncEventArgs: (decodedEvent: HyperSyncClient.Decoder.decodedEvent) => {smartAccount: decodedEvent.indexed->Js.Array2.unsafe_get(0)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, to: decodedEvent.indexed->Js.Array2.unsafe_get(1)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, userOpHash: decodedEvent.indexed->Js.Array2.unsafe_get(2)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, value: decodedEvent.body->Js.Array2.unsafe_get(0)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, transferType: decodedEvent.body->Js.Array2.unsafe_get(1)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, tokenAddress: decodedEvent.body->Js.Array2.unsafe_get(2)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, timestamp: decodedEvent.body->Js.Array2.unsafe_get(3)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, }->(Utils.magic: eventArgs => Internal.eventParams),
    id,
  name,
  contractName,
  isWildcard: (handlerRegister->EventRegister.isWildcard),
  handler: handlerRegister->EventRegister.getHandler,
  contractRegister: handlerRegister->EventRegister.getContractRegister,
  paramsRawEventSchema: paramsRawEventSchema->(Utils.magic: S.t<eventArgs> => S.t<Internal.eventParams>),
  }
}
}

module TransferFailed = {

let id = "0xf153900dc42900da7746e3c647b2d9fcbe8e6ecc3f861e5f5baa11abf19aed6e_4"
let sighash = "0xf153900dc42900da7746e3c647b2d9fcbe8e6ecc3f861e5f5baa11abf19aed6e"
let name = "TransferFailed"
let contractName = contractName

@genType
type eventArgs = {smartAccount: Address.t, to: Address.t, value: bigint, transferType: string, tokenAddress: Address.t, reason: string, timestamp: bigint, userOpHash: string}
@genType
type block = Block.t
@genType
type transaction = Transaction.t

@genType
type event = {
  /** The parameters or arguments associated with this event. */
  params: eventArgs,
  /** The unique identifier of the blockchain network where this event occurred. */
  chainId: chainId,
  /** The address of the contract that emitted this event. */
  srcAddress: Address.t,
  /** The index of this event's log within the block. */
  logIndex: int,
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  transaction: transaction,
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  block: block,
}

@genType
type handlerArgs = Internal.genericHandlerArgs<event, handlerContext, unit>
@genType
type handler = Internal.genericHandler<handlerArgs>
@genType
type contractRegister = Internal.genericContractRegister<Internal.genericContractRegisterArgs<event, contractRegistrations>>

let paramsRawEventSchema = S.object((s): eventArgs => {smartAccount: s.field("smartAccount", Address.schema), to: s.field("to", Address.schema), value: s.field("value", BigInt.schema), transferType: s.field("transferType", S.string), tokenAddress: s.field("tokenAddress", Address.schema), reason: s.field("reason", S.string), timestamp: s.field("timestamp", BigInt.schema), userOpHash: s.field("userOpHash", S.string)})
let blockSchema = Block.schema
let transactionSchema = Transaction.schema

let handlerRegister: EventRegister.t = EventRegister.make(
  ~contractName,
  ~eventName=name,
)

@genType
type eventFilter = {@as("smartAccount") smartAccount?: SingleOrMultiple.t<Address.t>, @as("to") to?: SingleOrMultiple.t<Address.t>, @as("userOpHash") userOpHash?: SingleOrMultiple.t<string>}

@genType type eventFiltersArgs = {/** The unique identifier of the blockchain network where this event occurred. */ chainId: chainId, /** Addresses of the contracts indexing the event. */ addresses: array<Address.t>}

@genType @unboxed type eventFiltersDefinition = Single(eventFilter) | Multiple(array<eventFilter>)

@genType @unboxed type eventFilters = | ...eventFiltersDefinition | Dynamic(eventFiltersArgs => eventFiltersDefinition)

let register = (): Internal.evmEventConfig => {
  let {getEventFiltersOrThrow, filterByAddresses} = LogSelection.parseEventFiltersOrThrow(~eventFilters=handlerRegister->EventRegister.getEventFilters, ~sighash, ~params=["smartAccount","to","userOpHash",], ~topic1=(_eventFilter) => _eventFilter->Utils.Dict.dangerouslyGetNonOption("smartAccount")->Belt.Option.mapWithDefault([], topicFilters => topicFilters->Obj.magic->SingleOrMultiple.normalizeOrThrow->Belt.Array.map(TopicFilter.fromAddress)), ~topic2=(_eventFilter) => _eventFilter->Utils.Dict.dangerouslyGetNonOption("to")->Belt.Option.mapWithDefault([], topicFilters => topicFilters->Obj.magic->SingleOrMultiple.normalizeOrThrow->Belt.Array.map(TopicFilter.fromAddress)), ~topic3=(_eventFilter) => _eventFilter->Utils.Dict.dangerouslyGetNonOption("userOpHash")->Belt.Option.mapWithDefault([], topicFilters => topicFilters->Obj.magic->SingleOrMultiple.normalizeOrThrow->Belt.Array.map(TopicFilter.castToHexUnsafe)))
  {
    getEventFiltersOrThrow,
    filterByAddresses,
    dependsOnAddresses: !(handlerRegister->EventRegister.isWildcard) || filterByAddresses,
    blockSchema: blockSchema->(Utils.magic: S.t<block> => S.t<Internal.eventBlock>),
    transactionSchema: transactionSchema->(Utils.magic: S.t<transaction> => S.t<Internal.eventTransaction>),
    convertHyperSyncEventArgs: (decodedEvent: HyperSyncClient.Decoder.decodedEvent) => {smartAccount: decodedEvent.indexed->Js.Array2.unsafe_get(0)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, to: decodedEvent.indexed->Js.Array2.unsafe_get(1)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, userOpHash: decodedEvent.indexed->Js.Array2.unsafe_get(2)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, value: decodedEvent.body->Js.Array2.unsafe_get(0)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, transferType: decodedEvent.body->Js.Array2.unsafe_get(1)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, tokenAddress: decodedEvent.body->Js.Array2.unsafe_get(2)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, reason: decodedEvent.body->Js.Array2.unsafe_get(3)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, timestamp: decodedEvent.body->Js.Array2.unsafe_get(4)->HyperSyncClient.Decoder.toUnderlying->Utils.magic, }->(Utils.magic: eventArgs => Internal.eventParams),
    id,
  name,
  contractName,
  isWildcard: (handlerRegister->EventRegister.isWildcard),
  handler: handlerRegister->EventRegister.getHandler,
  contractRegister: handlerRegister->EventRegister.getContractRegister,
  paramsRawEventSchema: paramsRawEventSchema->(Utils.magic: S.t<eventArgs> => S.t<Internal.eventParams>),
  }
}
}
}

@genType
type chainId = int

@genType
type chain = [#10143]
