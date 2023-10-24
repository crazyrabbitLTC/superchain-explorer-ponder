import { ponder } from "@/generated";
import { createCommonEntities } from "../utils";

export function registerAdminChangedEvent() {
    ponder.on("Proxy:AdminChanged", async ({ event, context }) => {
        const { AdminChanged } = context.entities;
        const { newBlock, newTransaction, newLog } = await createCommonEntities(event, context);

        await AdminChanged.create({
            id: `${event.log.id}-AdminChanged`,
            data: {
                contract: event.log.address,
                previousAdmin: event.params.previousAdmin,
                newAdmin: event.params.newAdmin,
                block: newBlock.id,
                transaction: newTransaction.id,
                log: newLog.id,
            }
        });
    });
}
