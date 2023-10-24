import { ponder } from "@/generated";
import { createCommonEntities, findOrCreateAddress } from "../utils";

export function registerOutputProposedEvent() {
    ponder.on("L2OutputOracle:OutputProposed", async ({ event, context }) => {
        const { OutputProposed, Address } = context.entities;
        const { newBlock, newTransaction, newLog } = await createCommonEntities(event, context);
        console.log("Output Proposed: ", event.transaction.hash);
        // console.log(JSON.stringify(event.params, null, 2));  
        const account = await findOrCreateAddress(event.log.address, context);

        await Address.update({
            id: event.log.address,
            data: {
                isL2Contract: true,
                isContract: true,
            }
        })

        // check if the output exists
        const output = await OutputProposed.findUnique({ id: `${event.log.id}-OutputProposed` });
        if (output) {
            return;
        }

        await OutputProposed.create({
            id: `${event.log.id}-OutputProposed`,
            data: {
                contract: event.log.address,
                outputRoot: event.params.outputRoot,
                l2OutputIndex: event.params.l2OutputIndex,
                l2BlockNumber: event.params.l2BlockNumber,
                l1Timestamp: event.params.l1Timestamp,
                block: newBlock.id,
                transaction: newTransaction.id,
                log: newLog.id,
            }
        });
    });
}
