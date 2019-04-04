# BentoBot
Whitelistbot for FiveM

KEEP IN MIND! This is made with the expectations that you have a user_whitelist table with the column identifier and whitelisted where the data type fo identifier is a VARCHAR and whitelisted is an INT. If you want to change this you will have to find the entries to the SQL in the code and change it. Might publish a walkthrough on it.

# Installation:
1. Download the bot and save it on the host computer. (recommending on the desktop for convinience)
2. Download and install node.js from https://nodejs.org/en/
3. Open a CMD and run the following commands:

3.1. cd bot/path  (bot path is the directory path to where you downloaded the bot. If you saved it on the desktop and named it whitelistbot the bot/path would be: desktop/whitelistbot. The full command would be "cd desktop/whitelistbot" I recommend to set it up like this in the beginning as you will be able to move it later.)

3.2. Run the command 
> npm i discord.js

3.3. Run the command 
> npm i mysql

3.4 Terminate the CMD

4. Go to https://discordapp.com/developers and create an application and then a bot user. Connect the bot to your server with admin perms. Copy the token from the developer app.
5. Go into the bot files and open `token.json` and paste the token to "token": "HERE", save and exit
6. Open `botconfig.json`, paste in the right credentials for your SQL host and change the chat names to match your servers chats. (`hexIDText` is the chat message where your whitelisthelpers will post a HEX ID (15 charaters example 11000010816f54b.) and this is where the ones with ADMINISTRATOR perms in discord will react with ✅ to whitelist the HEX ID. `whitelistCommandChat` is where the ones with ADMINISTRATOR perms can manually input commands to either whitelist or remove whitelist (example !whitelist steam:11000010816f54b 1))
7. Open your discord server and type `\@THERANK` where the rank is the rank you want to be able to post in `hexIDText` channel. The result will be something like this: `<@&543977917865263104>` remove `<@&>` so you get `543977917865263104`. 
8. `index.js` and go to `row 129`. there you will need to replace the number inside 
> message.member.roles.has(543977917865263104)

to the numbers that you got from step 7.

10. open `startbot.bat` and enjoy the bot.

I recommend typing !bentohelp to get information on how to operate the bot.

If it still does not work I might have missed a step or you have not successfully followed them. Pm me @Elias#4318 on discord for support
