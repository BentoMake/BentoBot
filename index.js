const botconfig = require("./botconfig.json");
const token = require("./token.json")
const discord = require("discord.js");
const bento = new discord.Client({disableEveryone: true});
const fs = require("fs");
bento.commands = new discord.Collection();

var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit: 20,
  host: botconfig.hostSQL,
  user: botconfig.userSQL,
  password: botconfig.passwordSQL,
  port: botconfig.portSQL,
  database: botconfig.databaseSQL
});

bento.on("ready", async () => {
  console.log(`${bento.user.username} is now running!\n`)
  bento.user.setActivity("Whitelisting - !bentohelp");
});

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bento.commands.set(props.help.name, props);
  });
  
});



bento.on("messageReactionAdd", (reaction, user) => {
  let reactmsgArray = reaction.message.content.split(" ")
  var reactChar = /^[0-9a-zA-Z]+$/;
  var whitelistChat = reaction.message.channel.name
  var whitelisterUser = reaction.message.guild.member(user.id)

  if (whitelistChat === botconfig.hexIDText) {
    if (whitelisterUser.hasPermission("ADMINISTRATOR")){ 
      if (reaction.emoji.name === "✅") {
        if (reactmsgArray[0].length === 15){
          if (reactmsgArray[0].match(reactChar)){
            pool.getConnection(function(err, connection) {
              if(err) throw err;
              connection.query("SELECT * FROM user_whitelist WHERE (identifier) = (?)", "steam:" + [reactmsgArray[0]], function (err, result) { 
                if (err) throw err;
                var person = JSON.stringify(result);
                obj = JSON.parse(person);
                if (person.length > 5){
                  if (obj[0].whitelisted === 0){
                    pool.getConnection(function(err, connection) {
                      if(err) throw err;
                      connection.query("UPDATE user_whitelist SET whitelisted = '1' WHERE identifier = ?", "steam:" + [reactmsgArray[0]], function (err, result) {
                        console.log("Was whitelisted " + `<@${user.tag}>\n`)
                        user.send("**" + obj[0].identifier + "**" + " was whitelisted!")
                        connection.release()
                      });
                    });
                  } else {
                    if (obj[0].whitelisted === 1){
                      user.send("**" + obj[0].identifier + "**" + " is already whitelisted!")
                    };
                  };
                } else {
                  pool.getConnection(function(err, connection) {
                    if(err) throw err;
                    connection.query("INSERT INTO user_whitelist (identifier, whitelisted) VALUES (?, 1)", "steam:" + [reactmsgArray[0]], function (err, result) {
                      if(err) throw err;
                      console.log("Was whitelisted and added " + `<@${user.tag}>`);
                      user.send("**" + "steam:" + reactmsgArray[0] + "**" + " was whitelisted and added!");
                      connection.release();
                    });

                  });
                }
                connection.release();
              });
            });  
          } else {
            reaction.remove(user);
            user.send("Invalid character in the HEXID, make sure that they only contain (0-9, a-z, A-Z")
          };
        } else {
          reaction.remove(user);
          user.send("The HEXID is to long or to short"); //For safty incase someone edits their post.
        };
      } else {
        reaction.remove(user);
        user.send("You can only react with ✅ to whitelist!");
      };
    } else {
      reaction.remove(user);
      user.send("You dont have the right permissions to whitelist!");
    }
  };
  
});

bento.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  
  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);
  var validChar = /^[0-9a-zA-Z]+$/;

  let commandfile = bento.commands.get(command.slice(prefix.length));
  if (commandfile) commandfile.run(bento,message,args);

  if (message.channel.name === botconfig.hexIDText){
    if (message.member.roles.has("543977917865263104")){
      if (messageArray[0].length === 15){
        if (messageArray[0].match(validChar)){

        } else {
          message.member.send("INVALID HEX! Keep in mind to only use the characters: 0-9, a-z, A-Z");
          message.delete();
        }
      } else {
        message.member.send("INVALID HEX! Either to long or to short it should be 15 characters! Keep in mind to only use the characters: 0-9, a-z, A-Z");
        message.delete();
      }
    } else {
      if (message.member.hasPermission("ADMINISTRATOR")){
		if (messageArray[0].length === 15){
			if (messageArray[0].match(validChar)){
				
			} else {
				message.member.send("INVALID HEX! Keep in mind to only use the characters: 0-9, a-z, A-Z");
				message.delete();
			};
		} else {
			message.member.send("INVALID HEX! Either to long or to short it should be 15 characters! Keep in mind to only use the characters: 0-9, a-z, A-Z");
			message.delete();
		};
		  
	  } else {
		message.member.send("You don't have the right permissions to add HEXID to whitelist queue");
		message.delete();
	  };
    };
  };


  if (messageArray[0] === `${prefix}whitelist`){
    if (message.channel.name === botconfig.whitelistCommandChat){
      if (message.member.hasPermission("ADMINISTRATOR")){
        if (messageArray[1].slice(0, 6) === "steam:"){
          if (messageArray[1].length == 21){
            if((messageArray[1].slice(6, 21).match(validChar))){
              if(messageArray[2] === "1"){
                pool.getConnection(function(err, connection) {
                  if(err) throw err;
                  connection.query("SELECT * FROM user_whitelist WHERE (identifier) = (?)", [messageArray[1]], function (err, result) {
                    if(err) throw err;
                    var tOnWhite = JSON.stringify(result);
                    wOnData = JSON.parse(tOnWhite);
                    connection.release()
                    if (tOnWhite.length > 5){
                      if (wOnData[0].whitelisted === 0){
                        pool.getConnection(function(err, connection) {
                          if (err) throw err;
                          connection.query("UPDATE user_whitelist SET whitelisted = '1' WHERE identifier = ?", [messageArray[1]], function (err, result) {
                            if (err) throw err;
                            message.channel.send("**" + wOnData[0].identifier + "**" + " was whitelisted by " + `<@${message.author.id}>`);
                            console.log(wOnData);
                            console.log("Was whitelisted by" + `<@${message.member.user.tag}> \n`);
                            connection.release()
                          });
                        });
                      } else {
                        message.channel.send("**" + wOnData[0].identifier + "**" + " is already whitelisted");
                      };
                    } else { console.log("hej")
                    pool.getConnection(function(err, connection) {
                      if (err) throw err;
                      connection.query("INSERT INTO user_whitelist (identifier, whitelisted) VALUES (?, 1)", [messageArray[1]], function (err, result) {
                        if (err) throw err;
                        connection.release();
                        pool.getConnection(function(err, connection) {
                          if (err) throw err;
                          connection.query("SELECT * FROM user_whitelist WHERE (identifier) = (?)", [messageArray[1]], function (err, result) {
                            if (err) throw err;
                            var newW = JSON.stringify(result)
                            newWData = JSON.parse(newW)
                            message.channel.send("**" + newWData[0].identifier + "**" + " has been added and whitelisted by " + `<@${message.author.id}>`)
                            console.log(newWData)
                            console.log("Was added and whitelisted by " + `<@${message.member.user.tag}> \n`)
							connection.release()
                          });
                        });
                      });
                    });
                  }
                  });
                });
              } else {
                if (messageArray[2] === "0"){
                  pool.getConnection(function(err, connection) {
                    if(err) throw err;
                    connection.query("SELECT * FROM user_whitelist WHERE (identifier) = (?)", [messageArray[1]], function (err, result) {
                      if(err) throw err;
                      var tOffWhite = JSON.stringify(result);
                      wOffData = JSON.parse(tOffWhite);
                      if (tOffWhite.length > 5){
                        if (wOffData[0].whitelisted === 1){
                          console.log(wOffData);
                          console.log("Was removed from the whitelist by " + `<@${message.member.user.tag}> \n`);
                          message.channel.send("**" + wOffData[0].identifier + "**" + " as Removed from the whitelist by " + `<@${message.author.id}>`);
                          pool.getConnection(function(err, connection) {
                            connection.query("UPDATE user_whitelist SET whitelisted = '0' WHERE identifier = ?", [messageArray[1]], function (err, result) {
                              if (err) throw err;
                              connection.release();
                            });
                          });
                        } else {
                          message.channel.send("**" + messageArray[1] + "**" + " was never whitelisted to begin with!")
                        }
                      };
					connection.release()
                    });
                  });
                } else {
                  message.channel.send("Wrong setting, !whitelist steam:123456789012345 <0/1>, 0 = Whitelist off, 1 = Whitelist on!");
                };
              };
            };
          } else {
            message.channel.send("The HEXID is to long or short! It should be 15 characters long, with \"steam:\" it should be 21 charaters.");
          }
        } else {
          message.channel.send("Wrong format! Example: !whitelist steam:123456789012345 <0/1>");
        }
      };
    };
  };
  
});




  
bento.login(token.token);
