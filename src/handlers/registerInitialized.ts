import { ponder } from "@/generated";
import { createCommonEntities } from "../utils";

export function registerInitializedEvent() {
  ponder.on("L2OutputOracle:Initialized", async ({ event, context }) => {
    const { Initialized } = context.entities;
    const { newBlock, newTransaction, newLog } = await createCommonEntities(event, context);

    await Initialized.create({
      id: `${event.log.id}-Initialized`,
      data: {
        version: event.params.version,
        contract: event.log.address,
        block: newBlock.id,
        transaction: newTransaction.id,
        log: newLog.id,
      },
    });
  });
}

