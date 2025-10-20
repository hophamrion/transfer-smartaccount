  @genType
module Event = {
  module BatchTransferExecuted = Types.MakeRegister(Types.Event.BatchTransferExecuted)
  module TransferExecuted = Types.MakeRegister(Types.Event.TransferExecuted)
  module TransferFailed = Types.MakeRegister(Types.Event.TransferFailed)
}

@genType /** Register a Block Handler. It'll be called for every block by default. */
let onBlock: (
  Envio.onBlockOptions<Types.chain>,
  Envio.onBlockArgs<Types.handlerContext> => promise<unit>,
) => unit = (
  EventRegister.onBlock: (unknown, Internal.onBlockArgs => promise<unit>) => unit
)->Utils.magic
