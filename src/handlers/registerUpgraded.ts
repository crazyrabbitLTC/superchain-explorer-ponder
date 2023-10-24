import { ponder } from "@/generated";
import { createCommonEntities } from "../utils";

export function registerUpgradedEvent() {
    ponder.on("Proxy:Upgraded", async ({ event, context }) => {
        const { Upgraded } = context.entities;
        const { newBlock, newTransaction, newLog } = await createCommonEntities(event, context);

        await Upgraded.create({
            id: `${event.log.id}-Upgraded`,
            data: {
                implementation: event.params.implementation,
                contract: event.log.address,
                block: newBlock.id,
                transaction: newTransaction.id,
                log: newLog.id,
            }
        });
    });
}
