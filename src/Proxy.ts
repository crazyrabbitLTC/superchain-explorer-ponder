import { ponder } from "@/generated";

ponder.on("Proxy:Initialized", async ({ event, context }) => {
  console.log(event.params);
});

ponder.on("Proxy:OutputProposed", async ({ event, context }) => {
  console.log(event.params);
});
