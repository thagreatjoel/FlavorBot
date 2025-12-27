import { App } from "@slack/bolt";
import fetch from "node-fetch";
import "dotenv/config";

const app = new App({
  token: process.env.FLAVOR_TOKEN,
  signingSecret: process.env.FLAVOR_SECRET,  
  endpoints: "/slack/events"
});


import usersCommand from "./commands/users.js";




usersCommand(app);



app.command("/testflavors",async({ ack,respond }) => {
  await ack();
  await respond("All Flavors are tested OK for the town")
});

await app.start(3000);
console.log("Flavor Bot is ready to cook on port 3000");
