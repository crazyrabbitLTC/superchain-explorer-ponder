import { ponder } from "@/generated";

import { registerAdminChangedEvent } from "./handlers/registerAdminChanged";
import { registerInitializedEvent } from "./handlers/registerInitialized";
import { registerOutputProposedEvent } from "./handlers/registerOutputProposed";
import { registerOutputsDeletedEvent } from "./handlers/registerOutputDeleted";
import { registerUpgradedEvent} from "./handlers/registerUpgraded";

registerAdminChangedEvent();
registerInitializedEvent();
registerOutputProposedEvent();
registerOutputsDeletedEvent();
registerUpgradedEvent();
