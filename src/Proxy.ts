import { ponder } from "@/generated";

// ponder.on("Proxy:Initialized", async ({ event, context }) => {
//   console.log(event.params);
// });

// ponder.on("L2OutputOracle:OutputProposed", async ({ event, context }) => {
//   console.log(event.params);
// });



// import { ponder } from "@/generated";

// import { registerAdminChangedEvent } from "./handlers/registerAdminChanged";
// import { registerInitializedEvent } from "./handlers/registerInitialized";
import { registerOutputProposedEvent } from "./handlers/registerOutputProposed";
// import { registerOutputsDeletedEvent } from "./handlers/registerOutputDeleted";
// import { registerUpgradedEvent} from "./handlers/registerUpgraded";

// registerAdminChangedEvent();
// registerInitializedEvent();
registerOutputProposedEvent();
// registerOutputsDeletedEvent();
// registerUpgradedEvent();
