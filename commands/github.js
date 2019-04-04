const discord = require("discord.js")

module.exports.run = (bento, message, args) => {
    message.channel.send("Get your own BentoBot to whitelist easier on your FiveM server! Just at https://github.com/BentoMake/BentoBot");
}

module.exports.help = {
    name: "github"
};
