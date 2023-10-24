import { ponder } from "@/generated";
import { createCommonEntities } from "../utils";

export function registerOutputsDeletedEvent() {
    ponder.on("L2OutputOracle:OutputsDeleted", async ({ event, context }) => {
        const { OutputsDeleted } = context.entities;
        const { newBlock, newTransaction, newLog } = await createCommonEntities(event, context);

        await OutputsDeleted.create({
            id: `${event.log.id}-OutputsDeleted`,
            data: {
                prevNextOutputIndex: event.params.prevNextOutputIndex,
                contract: event.log.address,
                newNextOutputIndex: event.params.newNextOutputIndex,
                block: newBlock.id,
                transaction: newTransaction.id,
                log: newLog.id,
            }
        });
    });
}
