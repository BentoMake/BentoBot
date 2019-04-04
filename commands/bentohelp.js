const discord = require("discord.js")

module.exports.run = (bento, message, args) => {
    let pic = bento.user.displayAvatarURL;
    const bentoEmbed = {
      Color: "#000000",
      title: "BentoBot",
      description: "Personal FiveM Whitelister",
      thumbnail: {
        url: pic,
      },
      fields: [
        {
          name: "\u200b",
          value: "\u200b",
        },
        {
          name: "Commands",
          value: "All the commands that will trigger the bot",
        },
        {
          name: "!github",
          value: "Links the github post of the bot",
        },
        {
          name: "!whitelist <HEXID> <0>",
          value: "Removes the HEXID from the whitelist SQL",
        },
        {
          name: "!whitelist <HEXID> <1>",
          value: "Adds the HEXID to the whitelist SQL",
        },
        {
          name: "\u200b",
          value: "\u200b",
        },
        {
          name: "Other",
          value: "The other functions this bot supports",
        },
        {
          name: "HEX ID list",
          value: "Create a text channel where the whitelist recruiters can post HEX IDs. Admins with the Whitelist Bot perms can react to the HEX IDs with the :white_check_mark: to whitelist them to the SQL. Keep in mind that only MODS should be able to post the HEX IDs",
        },
        {
          name: "\u200b",
          value: "\u200b",
        },
      ],
        footer: {
          text: "Availabe for free at GITHUB!",
          icon_url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        },
      };
    
    
    

    message.channel.send({ embed: bentoEmbed });
}

module.exports.help = {
    name: "bentohelp"
};