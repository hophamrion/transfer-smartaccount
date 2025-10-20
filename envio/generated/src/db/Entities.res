open Table
open Enums.EntityType
type id = string

type internalEntity = Internal.entity
module type Entity = {
  type t
  let name: string
  let schema: S.t<t>
  let rowsSchema: S.t<array<t>>
  let table: Table.table
  let entityHistory: EntityHistory.t<t>
}
external entityModToInternal: module(Entity with type t = 'a) => Internal.entityConfig = "%identity"
external entityModsToInternal: array<module(Entity)> => array<Internal.entityConfig> = "%identity"
external entitiesToInternal: array<'a> => array<Internal.entity> = "%identity"

@get
external getEntityId: internalEntity => string = "id"

exception UnexpectedIdNotDefinedOnEntity
let getEntityIdUnsafe = (entity: 'entity): id =>
  switch Utils.magic(entity)["id"] {
  | Some(id) => id
  | None =>
    UnexpectedIdNotDefinedOnEntity->ErrorHandling.mkLogAndRaise(
      ~msg="Property 'id' does not exist on expected entity object",
    )
  }

//shorthand for punning
let isPrimaryKey = true
let isNullable = true
let isArray = true
let isIndex = true

@genType
type whereOperations<'entity, 'fieldType> = {
  eq: 'fieldType => promise<array<'entity>>,
  gt: 'fieldType => promise<array<'entity>>
}

module Event_BatchTransferExecuted = {
  let name = (Event_BatchTransferExecuted :> string)
  @genType
  type t = {
    id: id,
    recipientCount: bigint,
    smartAccount: string,
    timestamp: bigint,
    tokenAddress: string,
    totalValue: bigint,
    transferType: string,
    userOpHash: string,
  }

  let schema = S.object((s): t => {
    id: s.field("id", S.string),
    recipientCount: s.field("recipientCount", BigInt.schema),
    smartAccount: s.field("smartAccount", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    tokenAddress: s.field("tokenAddress", S.string),
    totalValue: s.field("totalValue", BigInt.schema),
    transferType: s.field("transferType", S.string),
    userOpHash: s.field("userOpHash", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "recipientCount", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "smartAccount", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "tokenAddress", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "totalValue", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "transferType", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "userOpHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema)

  external castToInternal: t => Internal.entity = "%identity"
}

module Event_TransferExecuted = {
  let name = (Event_TransferExecuted :> string)
  @genType
  type t = {
    id: id,
    smartAccount: string,
    timestamp: bigint,
    to: string,
    tokenAddress: string,
    transferType: string,
    userOpHash: string,
    value: bigint,
  }

  let schema = S.object((s): t => {
    id: s.field("id", S.string),
    smartAccount: s.field("smartAccount", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    to: s.field("to", S.string),
    tokenAddress: s.field("tokenAddress", S.string),
    transferType: s.field("transferType", S.string),
    userOpHash: s.field("userOpHash", S.string),
    value: s.field("value", BigInt.schema),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "smartAccount", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "to", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "tokenAddress", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "transferType", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "userOpHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "value", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema)

  external castToInternal: t => Internal.entity = "%identity"
}

module Event_TransferFailed = {
  let name = (Event_TransferFailed :> string)
  @genType
  type t = {
    id: id,
    reason: string,
    smartAccount: string,
    timestamp: bigint,
    to: string,
    tokenAddress: string,
    transferType: string,
    userOpHash: string,
    value: bigint,
  }

  let schema = S.object((s): t => {
    id: s.field("id", S.string),
    reason: s.field("reason", S.string),
    smartAccount: s.field("smartAccount", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    to: s.field("to", S.string),
    tokenAddress: s.field("tokenAddress", S.string),
    transferType: s.field("transferType", S.string),
    userOpHash: s.field("userOpHash", S.string),
    value: s.field("value", BigInt.schema),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "reason", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "smartAccount", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "to", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "tokenAddress", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "transferType", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "userOpHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "value", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema)

  external castToInternal: t => Internal.entity = "%identity"
}

let userEntities = [
  module(Event_BatchTransferExecuted),
  module(Event_TransferExecuted),
  module(Event_TransferFailed),
]->entityModsToInternal

let allEntities =
  userEntities->Js.Array2.concat(
    [module(InternalTable.DynamicContractRegistry)]->entityModsToInternal,
  )

let byName =
  allEntities
  ->Js.Array2.map(entityConfig => {
    (entityConfig.name, entityConfig)
  })
  ->Js.Dict.fromArray
