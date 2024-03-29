const config = require("./config.json");
const { createBots } = require("./minecraft");

if (config.minecraft.enable) {
  // Minecraft handling
  createBots(config.minecraft.servers)
}

if (config.discord) {
  // Discord handling
}

process.on("uncaughtException", (error) => {
  console.error("[Uncaught exception]", error)
})

process.on("unhandledRejection", (error) => {
  console.error("[Unhandled rejection]", error)
})