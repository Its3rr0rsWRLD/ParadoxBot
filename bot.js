require('dotenv').config();
const { exit } = require("process");
const bottoken = process.env.TOKEN;

(async () => {
    let process = require('process');
    process.on('uncaughtException', function(err) {
        console.log(`Error!`);
        console.log(err);
    });
    const events = require('events');
    const {
        exec
    } = require("child_process")
    let Discord = require("discord.js")
    let Database = require("easy-json-database")
    let {
        MessageEmbed,
        MessageButton,
        MessageActionRow,
        Intents,
        Permissions,
        MessageSelectMenu
    } = require("discord.js")
    let logs = require("discord-logs")
    let fs = require('fs');
    const devMode = typeof __E_IS_DEV !== "undefined" && __E_IS_DEV;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const s4d = {
        Discord,
        database: new Database(`./database.json`),
        fire: null,
        joiningMember: null,
        reply: null,
        tokenInvalid: false,
        tokenError: null,
        player: null,
        manager: null,
        Inviter: null,
        message: null,
        notifer: null,
        checkMesagesExists(){
            if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
            if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
        }
    };

s4d.client = new s4d.Discord.Client({
    intents: [Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)],
    partials: ["REACTION"]
});

await s4d.client.login(`${bottoken}`).catch((e) => { s4d.tokenInvalid = true; s4d.tokenError = e; });

if (s4d.tokenInvalid) {
    console.error("Your a idiot, you can't use this bot without a valid token :|");
    process.exit(1);
}

if (s4d.tokenError) {
    console.error("An error occured while trying to login to the Discord API:", s4d.tokenError);
    process.exit(1);
}

s4d.client.on("ready", () => {
    console.log(`Logged in as ${s4d.client.user.tag}!`);
    s4d.client.user.setActivity(`${s4d.client.guilds.cache.get("1012956598911647774").members.cache.size} users in ` + ((s4d.client.guilds.cache.size) + 1) + " servers", { type: "WATCHING" });
    // Send an embed to the channel id "1012956599440113671"
    var embed = new s4d.Discord.MessageEmbed()
    embed.setTitle("Bot Status")
    // Set the color to pink and add an image of the bot's avatar
    embed.setColor("#b3315b")
    embed.setThumbnail(s4d.client.user.displayAvatarURL())
    var stime = new Date(s4d.client.readyTimestamp);
    embed.setDescription('Status: Online\nPing: ' + s4d.client.ws.ping + 'ms\nUptime: ' + Math.floor(process.uptime() / 60) + ' minutes\nStart Time: ' + stime + ' CST\nMemory Usage: ' + Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB');
    stime = stime.toLocaleTimeString();
    s4d.client.channels.cache.get("1012956599440113671").messages.fetch({ limit: 100 }).then(async(messages) => {
        messages.forEach(async(message) => {
            message.delete();
        });
    });
    s4d.client.channels.cache.get("1012956599440113671").send({
        embeds: [embed]
    }).then(async(msg) => {
        while (true) {
            var id = msg.id;
            embed.description = 'Status: Online\nPing: ' + s4d.client.ws.ping + 'ms\nUptime: ' + Math.floor(process.uptime() / 60) + ' minutes\nStart Time: ' + stime + ' CST\nMemory Usage: ' + Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB';
            // Edit the embed with the id (msg.id) every second
            msg.edit({
                embeds: [embed]
            }).catch(console.error);
            await delay(10000);
        }
    });
});

// #region Welcome Message
s4d.client.on("guildMemberAdd", async(member) => {
    s4d.client.user.setActivity(`${s4d.client.guilds.cache.get("1012956598911647774").members.cache.size} users in ` + ((s4d.client.guilds.cache.size) + 1) + " servers", { type: "WATCHING" });
    s4d.joiningMember = member;
    embed = new s4d.Discord.MessageEmbed()
    embed.setTitle("Welcome to the server!")
    embed.setColor("#b3315b")
    embed.setDescription(`Welcome to the server, ${member.user}!`)
    s4d.client.channels.cache.get("1012956599440113673").send({
        embeds: [embed]
    });
});
// #endregion

// #region Leave Message
s4d.client.on("guildMemberRemove", async(member) => {
    s4d.client.user.setActivity(`${s4d.client.guilds.cache.get("1012956598911647774").members.cache.size} users in ` + ((s4d.client.guilds.cache.size) + 1) + " servers", { type: "WATCHING" });
    embed = new s4d.Discord.MessageEmbed()
    embed.setTitle("Goodbye!")
    embed.setColor("#b3315b")
    embed.setDescription(`${member.user} has left the server.`)
    s4d.client.channels.cache.get("1012956599440113673").send({
        embeds: [embed]
    });
});
// #endregion

// #region Stop Bot
s4d.client.on("message", async(message) => {
    var servid = message.guild.id;
    stime = new Date(s4d.client.readyTimestamp);
    stime = stime.toLocaleTimeString();
    const prefix = JSON.parse(fs.readFileSync(`${devMode ? S4D_NATIVE_GET_PATH : "."}/Config/${servid}/prefix.json`));
    if (message.content === prefix + "kill") {
        if (message.author.id === "760246873684050011") {
            var embed = new s4d.Discord.MessageEmbed()
            embed.setTitle("Bot Status")
            embed.setColor("#b3315b")
            embed.setDescription("Status: Offline\nStop Time: " + stime + " CST");
            s4d.client.channels.cache.get("1012956599440113671").messages.fetch({ limit: 100 }).then(async(messages) => {
                messages.forEach(async(message) => {
                    message.delete();
                });
            }).catch(console.error);
            s4d.client.channels.cache.get("1012956599440113671").send({
                embeds: [embed]
            });
            await delay(3000);
            exit(0);
        }
    }
});
// #endregion

// #region Joining/Making Neccecary Files
s4d.client.on("guildCreate", async(guild) => {
    fs.mkdirSync(`${devMode ? S4D_NATIVE_GET_PATH : "."}Config/${guild.id}/`);
    fs.writeFileSync(`${devMode ? S4D_NATIVE_GET_PATH : "."}Config/${guild.id}/prefix.json`, "!");
    fs.writeFileSync(`${devMode ? S4D_NATIVE_GET_PATH : "."}Config/${guild.id}/rank.txt`, "");
    fs.writeFileSync(`${devMode ? S4D_NATIVE_GET_PATH : "."}Config/${guild.id}/rankchan.txt`, "");
});
// #endregion
    
// #region Change Prefix
s4d.client.on("message", async(message) => {
    servid = message.guild.id;
    const prefix = JSON.parse(fs.readFileSync(`${devMode ? S4D_NATIVE_GET_PATH : "."}/Config/${servid}/prefix.json`));
    if (message.content.startsWith(prefix + "prefix")) {
        if (message.member.permissions.has("ADMINISTRATOR")) {
            let prefix = message.content.split(" ")[1];
            if (!prefix) {
                message.channel.send("You need to specify a prefix!");
            } else {
                if (!fs.existsSync(`${devMode ? S4D_NATIVE_GET_PATH : "."}/Config/${servid}/prefix.json`)) {
                    fs.writeFileSync(`${devMode ? S4D_NATIVE_GET_PATH : "."}/Config/${servid}/prefix.json`, JSON.stringify(prefix));
                } else {
                    fs.writeFileSync(`${devMode ? S4D_NATIVE_GET_PATH : "."}/Config/${servid}/prefix.json`, JSON.stringify(prefix));
                }
                message.channel.send("Prefix changed to `" + prefix + "`");
                s4d.client.guilds.cache.get("1012956598911647774").members.cache.get("1012959415768457238").setNickname(`[${prefix}] Paradox`);
            }
        }
    }
});
// #endregion

// #region Economy Command
function mathRandomInt(a, b) {
    if (a > b) {
        // Swap a and b to ensure a is smaller.
        var c = a;
        a = b;
        b = c;
    }
    return Math.floor(Math.random() * (b - a + 1) + a);
}

function colourRandom() {
    var num = Math.floor(Math.random() * Math.pow(2, 24));
    return '#' + ('00000' + num.toString(16)).substr(-6);
}


s4d.client.on('messageCreate', async (s4dmessage) => {
    const prefix = JSON.parse(fs.readFileSync(`${devMode ? S4D_NATIVE_GET_PATH : "."}/Config/${s4dmessage.guild.id}/prefix.json`));
    if (!((s4dmessage.author).bot)) {
        if (!s4d.database.has(String(('coins-' + String((s4dmessage.author).id))))) {
            s4d.database.set(String(('coins-' + String((s4dmessage.author).id))), 0);
        }
        random_coin = mathRandomInt(1, 10);
        coins = s4d.database.get(String(('coins-' + String((s4dmessage.author).id))));
        s4d.database.add(String(('coins-' + String((s4dmessage.author).id))), parseInt(random_coin));
        if ((s4dmessage.content) == prefix + 'bal') {
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('Your Balance');
            embed.setThumbnail(((s4dmessage.author).displayAvatarURL({
                format: "png"
            })));
            embed.setDescription(([s4dmessage.author, ', you currently have ', coins, ' coins in your account.'].join('')));
            (s4dmessage.channel).send({
                embeds: [embed]
            });

        } else if (((s4dmessage.content) || '').startsWith(prefix + 'bal' || '')) {
            if (!((s4dmessage.content) == prefix + 'bal')) {
                try {
                    if (!s4d.database.has(String(('coins-' + String((s4dmessage.mentions.members.first().user).id))))) {
                        s4d.database.set(String(('coins-' + String((s4dmessage.mentions.members.first().user).id))), 0);
                    }
                    var embed = new Discord.MessageEmbed()
                    embed.setColor('#b3315b');
                    embed.setTitle('<@' + String((s4dmessage.mentions.members.first().user).id) + '>\'s Balance');
                    embed.setThumbnail(((s4dmessage.mentions.members.first().user).displayAvatarURL({
                        format: "png"
                    })));
                    embed.setDescription(([s4dmessage.mentions.members.first().user, ' currently has ', s4d.database.get(String(('coins-' + String((s4dmessage.mentions.members.first().user).id)))), ' coins in their account.'].join('')));
                    (s4dmessage.channel).send({
                        embeds: [embed]
                    });


                } catch (err) {
                    s4dmessage.channel.send({
                        content: String('Please ping a valid member.')
                    });

                };
            }
        }
        if (((s4dmessage.content) || '').startsWith('$editcoins' || '')) {
            if ((s4dmessage.member).permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                try {
                    if (!s4d.database.has(String(('coins-' + String((s4dmessage.mentions.members.first().user).id))))) {
                        s4d.database.set(String(('coins-' + String((s4dmessage.mentions.members.first().user).id))), 0);
                    }
                    (s4dmessage.channel).send(String('How many coins do you want to add?')).then(() => {
                        (s4dmessage.channel).awaitMessages({
                            filter: (m) => m.author.id === (s4dmessage.member).id,
                            time: (10 * 60 * 1000),
                            max: 1
                        }).then(async (collected) => {
                            s4d.reply = collected.first().content;
                            s4d.message = collected.first();
                            coin_answer = (s4d.reply);
                            if ((coin_answer % 2 === 0 || coin_answer % 2 === 1) && coin_answer >= -1000000 && coin_answer <= 1000000) {
                                s4d.database.add(String(('coins-' + String((s4dmessage.mentions.members.first().user).id))), parseInt(coin_answer));
                                s4dmessage.channel.send({
                                    content: String((['Added ', coin_answer, ' coins to the member'].join('')))
                                });
                            } else {
                                s4dmessage.channel.send({
                                    content: String('Please enter a valid number between -1000000 and 1000000. Cancelling.')
                                });
                            }

                            s4d.reply = null;
                        }).catch(async (e) => {
                            console.error(e);
                        });
                    })

                } catch (err) {
                    s4dmessage.channel.send({
                        content: String('Please ping a valid memeber.')
                    });

                };
            } else {
                s4dmessage.channel.send({
                    content: String('You need the manage server permission to use this command.')
                });
            }
        } else if (((s4dmessage.content) || '').startsWith('$reset' || '')) {
            if ((s4dmessage.member).permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                try {
                    s4d.database.set(String(('coins-' + String((s4dmessage.mentions.members.first().user).id))), (coins - coins));
                    var embed = new Discord.MessageEmbed()
                    embed.setColor('#b3315b');
                    embed.setDescription(([s4dmessage.author, ' reset the coin count for ', s4dmessage.mentions.members.first().user, ' to 0'].join('')));
                    (s4dmessage.channel).send({
                        embeds: [embed]
                    });


                } catch (err) {
                    s4dmessage.channel.send({
                        content: String('Please ping a valid memeber.')
                    });

                };
            } else {
                s4dmessage.channel.send({
                    content: String('You need the manage server permission to use this command.')
                });
            }
        }
        if (((s4dmessage.content) || '').startsWith('$give' || '')) {
            try {
                if (!s4d.database.has(String(('coins-' + String((s4dmessage.mentions.members.first().user).id))))) {
                    s4d.database.set(String(('coins-' + String((s4dmessage.mentions.members.first().user).id))), 0);
                }
                (s4dmessage.channel).send(String('How many coins do you want to give to the member?')).then(() => {
                    (s4dmessage.channel).awaitMessages({
                        filter: (m) => m.author.id === (s4dmessage.member).id,
                        time: (10 * 60 * 1000),
                        max: 1
                    }).then(async (collected) => {
                        s4d.reply = collected.first().content;
                        s4d.message = collected.first();
                        give_answer = (s4d.reply);
                        if (give_answer % 2 === 0 || give_answer % 2 === 1) {
                            if (coins >= give_answer) {
                                s4d.database.subtract(String(('coins-' + String((s4dmessage.author).id))), parseInt(give_answer));
                                s4d.database.add(String(('coins-' + String((s4dmessage.mentions.members.first().user).id))), parseInt(give_answer));
                                var embed = new Discord.MessageEmbed()
                                embed.setColor('#b3315b');
                                embed.setDescription(([s4dmessage.author, ' you successfully gave ', give_answer, ' coins to ', s4dmessage.mentions.members.first().user].join('')));
                                (s4dmessage.channel).send({
                                    embeds: [embed]
                                });

                            } else {
                                s4dmessage.channel.send({
                                    content: String('You dont have enough coins to donate to the member.')
                                });
                            }
                        } else {
                            s4dmessage.channel.send({
                                content: String('Please enter a valid number. Cancelling.')
                            });
                        }

                        s4d.reply = null;
                    }).catch(async (e) => {
                        console.error(e);
                    });
                })

            } catch (err) {
                s4dmessage.channel.send({
                    content: String('Please ping a valid memeber.')
                });

            };
        }
    }
});
// #endregion

// #region Work (Economy Split)
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'work')) {
        // Send an embed to the channel the command was sent in
        var embed = new Discord.MessageEmbed()
        embed.setColor('#b3315b');

        // #region Random Work Generator
        work = [
            'You worked at the local shop and earned $100',
            'You milk cows for a few hours because the farmer is sick! You are paid $63 for doing his job.',
            'You take a nice stroll around the park, looking down and finding $97. Congrats!',
            'You go to the local library and find a book on how to make a cake. You are paid $50 for doing his job.',
            'You enter a fidget spinner spinning contest and out-spin the other fidget spinner spinners. You make $100.',
            'You carefully clean the spring lock suits and receive $96.',
            'You work as a streamer and gain $84 from donations',
            'You work for Microsoft\'s marketing department. You get a free XBOX One S and $106.',
            'You work as a waiter at a local restaurant and earn $100.',
            'You help a newcomer set up a camp and he pays you $50.',
            'You work as a comedian and earn $101.',
            'You catch fish for a few hours and give them to your boss. He pays you :Aqua:96 for a good job.',
        ]

        // Get a random work from the array
        var randomWork = work[Math.floor(Math.random() * work.length)];
        // Get the amount of coins from the random work
        var randomWorkAmount = randomWork.split('$')[1]
        var randomWorkAmount = randomWorkAmount.split('.')[0]
        var randomWorkAmount = randomWorkAmount.split(' ')[0]
        // #endregion

        embed.setDescription(([randomWork].join('')));
        embed.setTitle('You earned $' + randomWorkAmount.toString() + ' coins!');
        (s4dmessage.channel).send({
            embeds: [embed]
        });
        s4d.database.add(String(('coins-' + String((s4dmessage.author).id))), parseInt(randomWorkAmount));
    }
});
// #endregion

// #region Clear Chat Command
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'clear')) {
        if (s4dmessage.member.permissions.has('MANAGE_MESSAGES')) {
            try {
                var amount = s4dmessage.content.split(' ')[1];
                if (amount === undefined) {
                    amount = 100;
                    try {
                        (s4dmessage.channel).bulkDelete(amount);
                    }
                    catch (err) {
                        s4dmessage.channel.send({
                            content: String('Please enter a valid number.')
                        });
                    }
                } else {
                    try {
                        (s4dmessage.channel).bulkDelete(amount);
                    }
                    catch (err) {
                        s4dmessage.channel.send({
                            content: String('Please enter a valid number.')
                        });
                    }
                }
            } catch (err) {
                s4dmessage.channel.send({
                    content: String('Please enter a valid number.')
                });
            }
        } else {
            s4dmessage.channel.send({
                content: String('You do not have permission to use this command.')
            });
        }
    }
});
// #endregion

// #region Help Command
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    var prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    var content = s4dmessage.content;
    if (content.startsWith(prefix + 'help')) {
        // #region Sub Commands
        if (content.includes(' ')) {
            var subcmd = s4dmessage.content.split(' ')[1];
            var prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
            if (subcmd == "userinfo" || subcmd == "info") {
                var embed = new Discord.MessageEmbed()
                embed.setColor('#b3315b');
                embed.setTitle('User Info');
                embed.setDescription('This command shows you information about the user you pinged.');
                embed.addFields({
                    name: 'Usage',
                    value: '`' + prefix + 'info @user`'
                });
                embed.addFields({
                    name: 'Example',
                    value: '`' + prefix + 'info @Error 404#0002`'
                });
                (s4dmessage.channel).send({
                    embeds: [embed]
                });
            }
        // #endregion
        } else {
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('Help');
            embed.setDescription(`**Commands**\n\n**${prefix}help** - Shows this help message.\n**${prefix}help (command)** - Shows a help message for that specific command.\n**${prefix}ping** - Pings the bot.\n**${prefix}serverinfo** - Shows information about the server.\n**${prefix}userinfo** or **${prefix}info** - Shows information about a user.\n**${prefix}coinflip** or **${prefix}flip** - Flips a coin.\n**${prefix}work** - Earns coins.\n**${prefix}clear** - Clears the chat. (Mod)\n**${prefix}bal** - Shows the balance of the specified user.\n**${prefix}prefix** - Changes the prefix. (Mod)\n**${prefix}kick** - Kicks a user. (Mod)\n**${prefix}ban** - Bans a user. (Mod)\n**${prefix}mute** - Mutes a user. (Mod)\n**${prefix}unmute** - Unmutes a user. (Mod)\n**${prefix}level** - Shows the level of the specified user.\n**${prefix}xp** - Shows the xp of the specified user.\n**${prefix}meme** - Shows 1 random meme.\n**${prefix}memes (1-5)** - Shows the specified amount of memes.`);
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        }
    }
});
// #endregion

// #region Coin Flip Command
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'coinflip') || s4dmessage.content.startsWith(prefix + 'flip')) {
        var num = Math.floor(Math.random() * 2) + 1;
        if (num == 1) {
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('Coin Flip 🪙');
            embed.setDescription('You got Heads!');
            (s4dmessage.channel).send({
                embeds: [embed]
            }); 
        } else if (num == 2) {
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('Coin Flip 🪙');
            embed.setDescription('You got Tails!');
            (s4dmessage.channel).send({
                embeds: [embed]
            }); 
        } else {
            (s4dmessage.channel).send('Error! Please tell Error to fix the `Coinflip` command and attatch the error below.\n\n```py\nError: Math.random() got a number besides 1 or 2.\n\nNumber: ' + num + '\n```');
        }
    }
});
// #endregion

// #region Ping Command
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'ping')) {
        var embed = new Discord.MessageEmbed()
        embed.setColor('#b3315b');
        embed.setTitle('Bot Ping.');
        embed.setDescription('Ping: ' + s4d.client.ws.ping + 'ms');
        (s4dmessage.channel).send({
            embeds: [embed]
        });
    }
});
// #endregion

// #region Server Info
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    guild = s4d.client.guilds.cache.get(servid);
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'serverinfo')) {
        let chancount = s4d.client.guilds.cache.get(servid).channels.cache.size;
        var embed = new Discord.MessageEmbed();
        embed.setColor('#b3315b');
        embed.setTitle('Server Info');
        embed.setDescription('**Server Name:** ' + (s4dmessage.guild).name + '\n' + '**Server ID:** ' + (s4dmessage.guild).id + '\n' + '**Server Verification Level:** ' + (s4dmessage.guild).verificationLevel + '\n' + '**Server Member Count:** ' + (s4dmessage.guild).memberCount + '\n' + '**Server Channel Count:** ' + (s4dmessage.guild).channels.cache.size + '\n' + '**Server Emoji Count:** ' + (s4dmessage.guild).emojis.cache.size + '\n' + '**Server Role Count:** ' + (s4dmessage.guild).roles.cache.size + '\n' + '**Server Created At:** ' + (s4dmessage.guild).createdAt + '\n' + '**Server Channel Count:** ' + chancount + '\n' + '**Server Icon:** ' + (s4dmessage.guild).iconURL());
        (s4dmessage.channel).send({
            embeds: [embed]
        });
    }
});
// #endregion

// #region User Info
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'userinfo') || s4dmessage.content.startsWith(prefix + 'info')) {
        var user = s4dmessage.mentions.users.first();
        if (!user) {
            user = s4dmessage.author;
        }
        var embed = new Discord.MessageEmbed()
        embed.setColor('#b3315b');
        embed.setTitle('User Info');
        embed.setDescription('**User Name:** ' + user.username + '\n' + '**User ID:** ' + user.id + '\n' + '**User Discriminator (Last 4 Numbers):** ' + user.discriminator + '\n' + '**User Avatar:** ' + user.avatarURL() + '\n' + '**User Created At:** ' + user.createdAt);
        (s4dmessage.channel).send({
            embeds: [embed]
        });
    }
});
// #endregion

// #region Kick Command
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'kick')) {
        if (!s4dmessage.member.permissions.has('KICK_MEMBERS')) return;
        var user = s4dmessage.mentions.users.first();
        if (!user) {
            // Say "Please mention a user to kick." then after 5 seconds, delete the message.
            (s4dmessage.channel).send('Please mention a user to kick.').then(setTimeout(function() {
                var msgid = (s4dmessage.channel).messages.cache.last().id;
                (s4dmessage.channel).messages.cache.get(msgid).delete();
            }, 5000));
        } else {
            var reason = s4dmessage.content.split(' ').slice(2).join(' ');
            if (!reason) {
                reason = 'No reason provided.';
            }
            // Kick the user
            (s4dmessage.guild).members.cache.get(user.id).kick(reason);
            // Send the kick message
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('User Kicked');
            embed.setDescription('**Username:** ' + user.username + '\n' + '**User ID:** ' + user.id + '\n**Kicked By: <@' + s4dmessage.author + '>**\n**Reason:** ' + reason);
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        }
    }
});
// #endregion

// #region Ban Command
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'ban')) {
        if (!s4dmessage.member.permissions.has('BAN_MEMBERS')) return;
        var user = s4dmessage.mentions.users.first();
        if (!user) {
            // Say "Please mention a user to ban." then after 5 seconds, delete the message.
            (s4dmessage.channel).send('Please mention a user to ban.').then(setTimeout(function() {
                var msgid = (s4dmessage.channel).messages.cache.last().id;
                (s4dmessage.channel).messages.cache.get(msgid).delete();
            }, 5000));
        } else {
            var reason = s4dmessage.content.split(' ').slice(2).join(' ');
            if (!reason) {
                reason = 'No reason provided.';
            }
            // Ban the user
            (s4dmessage.guild).members.cache.get(user.id).ban(reason);
            // Send the ban message
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('User Banned');
            embed.setDescription('**Username:** ' + user.username + '\n' + '**User ID:** ' + user.id + '\n**Banned By: <@' + s4dmessage.author + '>**\n**Reason:** ' + reason);
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        }
    }
});
// #endregion

// #region Unban Command
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'unban')) {
        if (!s4dmessage.member.permissions.has('BAN_MEMBERS')) return;
        var user = s4dmessage.mentions.users.first();
        if (!user) {
            // Say "Please mention a user to unban." then after 5 seconds, delete the message.
            (s4dmessage.channel).send('Please mention a user to unban.').then(setTimeout(function() {
                var msgid = (s4dmessage.channel).messages.cache.last().id;
                (s4dmessage.channel).messages.cache.get(msgid).delete();
            }));
        } else {
            // Unban the user
            (s4dmessage.guild).members.cache.get(user.id).unban();
            // Send the unban message
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('User Unbanned');
            embed.setDescription('**Username:** ' + user.username + '\n' + '**User ID:** ' + user.id + '\n**Unbanned By: <@' + s4dmessage.author + '>**');
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        }
    }
});
// #endregion

// #region Mute Command
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'mute')) {
        if (!s4dmessage.member.permissions.has('MANAGE_ROLES')) return;
        var user = s4dmessage.mentions.users.first();
        if (!user) {
            // Say "Please mention a user to mute." then after 5 seconds, delete the message.
            (s4dmessage.channel).send('Please mention a user to mute.').then(setTimeout(function() {
                var msgid = (s4dmessage.channel).messages.cache.last().id;
                (s4dmessage.channel).messages.cache.get(msgid).delete();
            }));
        } else {
            var reason = s4dmessage.content.split(' ').slice(2).join(' ');
            if (!reason) {
                reason = 'No reason provided.';
            }
            const role = await guild.roles.fetch('1013158688590155846')
            const member = await guild.members.fetch(user.id)
            member.roles.add(role)
            // Mute the user (role id: 1013158688590155846)
            s4dmessage.mentions.members.first().roles.add(1013158688590155846);
            // Send the mute message
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('User Muted | Unlimited Time');
            embed.setDescription('**Username:** ' + user.username + '\n' + '**User ID:** ' + user.id + '\n**Muted By: <@' + s4dmessage.author + '>**\n**Reason:** ' + reason);
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        }
    }
});
// #endregion

// #region Unmute Command
s4d.client.on('message', async (s4dmessage) => {
    servid = (s4dmessage.guild).id;
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content.startsWith(prefix + 'unmute')) {
        if (!s4dmessage.member.permissions.has('MANAGE_ROLES')) return;
        var user = s4dmessage.mentions.users.first();
        if (!user) {
            // Say "Please mention a user to unmute." then after 5 seconds, delete the message.
            (s4dmessage.channel).send('Please mention a user to unmute.').then(setTimeout(function() {
                var msgid = (s4dmessage.channel).messages.cache.last().id;
                (s4dmessage.channel).messages.cache.get(msgid).delete();
            }));
        } else {
            const role = await guild.roles.fetch('1013158688590155846')
            const member = await guild.members.fetch(user.id)
            // Unmute the user
            member.roles.remove(role)
            // Send the unmute message
            var embed = new Discord.MessageEmbed()
            // Set the color to pink
            embed.setColor('#b3315b');
            embed.setTitle('User Unmuted');
            embed.setDescription('**Username:** ' + user.username + '\n' + '**User ID:** ' + user.id + '\n**Unmuted By: <@' + s4dmessage.author + '>**');
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        }
    }
});
// #endregion

// #region Rank System
s4d.client.on('messageCreate', async (s4dmessage) => {
    if (!((s4dmessage.author).bot)) {
        const num = Math.floor(Math.random() * 5) + 1;
        const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
        member_xp = s4d.database.get(String(('xp-' + String(s4dmessage.member.id))));
        member_level = s4d.database.get(String(('level-' + String(s4dmessage.member.id))));
        if (!member_xp) {
            member_xp = 0;
        } else if (!member_level) {
            member_level = 0;
        }
        s4d.database.set(String(('xp-' + String(s4dmessage.member.id))), (member_xp + num));
        member_xp = member_xp + num;
        if (member_xp > 100) {
            s4d.database.set(String(('xp-' + String(s4dmessage.member.id))), 0);
            s4d.database.set(String(('level-' + String(s4dmessage.member.id))), (member_level + 1));
            member_level = member_level + 1;
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('Level Up!');
            embed.setDescription('Congrats ' + s4dmessage.author + '! You have leveled up to level ' + member_level + '!');
            // Send the message to the channel with the id "1013183789255639103"
            (s4d.client.channels.cache.get("1013183789255639103")).send({
                embeds: [embed]
            });
        }
        if ((s4dmessage.content) == prefix + 'level') {
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('Your Level: ' + member_level);
            embed.setDescription('You are currently level ' + member_level + ' with ' + member_xp + ' xp.');
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        } else if ((s4dmessage.content) == prefix + 'xp') {
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('Your XP: ' + member_xp);
            embed.setDescription('You are currently level ' + member_level + ' with ' + member_xp + ' xp.');
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        } else if ((s4dmessage.content.includes(prefix + 'level')) && (s4dmessage.content.includes(mentions.users.first()))) {
            var embed = new Discord.MessageEmbed()
            var user = s4dmessage.mentions.users.first();
            embed.setColor('#b3315b');
            embed.setTitle(user + '\'s Level: ' + member_level);
            embed.setDescription(user + ' is currently level ' + member_level + ' with ' + member_xp + ' xp.');
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        } else if ((s4dmessage.content.includes(prefix + 'xp')) && (s4dmessage.content.includes(mentions.users.first()))) {
            var embed = new Discord.MessageEmbed()
            var user = s4dmessage.mentions.users.first();
            embed.setColor('#b3315b');
            embed.setTitle(user + '\'s XP: ' + member_xp);
            embed.setDescription(user + ' is currently level ' + member_level + ' with ' + member_xp + ' xp.');
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        }
    }

});
// #endregion

// #region Meme Command
s4d.client.on('message', async (s4dmessage) => {
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content == (prefix + 'meme')) {
        // Get a random meme from the API
        const fetch = require('node-fetch');
        var meme = await fetch('https://api.imgflip.com/get_memes').then(res => res.json());
        // Send the meme
        var embed = new Discord.MessageEmbed()
        embed.setColor('#b3315b');
        embed.setTitle(meme.data.memes[Math.floor(Math.random() * meme.data.memes.length)].name);
        embed.setImage(meme.data.memes[Math.floor(Math.random() * meme.data.memes.length)].url);
        (s4dmessage.channel).send({
            embeds: [embed]
        });
    } else if (s4dmessage.content.includes(prefix + 'memes')) {
        var num = s4dmessage.content.split(' ')[1];
        if (num > 5) {
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('Error');
            embed.setDescription('Please enter a number between 1 and 5.');
            (s4dmessage.channel).send({
                embeds: [embed]
            });
        } else {
            if (!num < 1) {
                for (var i = 0; i < num; i++) {
                    // Get a random meme from the API
                    const fetch = require('node-fetch');
                    var meme = await fetch('https://api.imgflip.com/get_memes').then(res => res.json());
                    // Send the meme
                    var embed = new Discord.MessageEmbed()
                    embed.setColor('#b3315b');
                    embed.setTitle(meme.data.memes[Math.floor(Math.random() * meme.data.memes.length)].name);
                    embed.setImage(meme.data.memes[Math.floor(Math.random() * meme.data.memes.length)].url);
                    (s4dmessage.channel).send({
                        embeds: [embed]
                    });
                }
            }
        }
    }
});
// #endregion

// #region Updating the bot
s4d.client.on('message', async (s4dmessage) => {
    const prefix = JSON.parse(fs.readFileSync('Config/' + servid + '/prefix.json', 'utf8'));
    if (s4dmessage.content == (prefix + 'update')) {
        s4dmessage.delete();
        if (s4dmessage.author.id == '760246873684050011') {

            s4d.client.guilds.cache.get("1012956598911647774").members.cache.get("1012959415768457238").setNickname(`Updating! | Paradox`);
            s4d.client.user.setActivity('Updating...', {
                type: 'PLAYING'
            });
            var embed = new Discord.MessageEmbed()
            await delay(5000);
            s4d.client.guilds.cache.get("1012956598911647774").members.cache.get("1012959415768457238").setNickname(`[${prefix}] Paradox`);
            embed.setColor('#b3315b');
            embed.setTitle('Update Complete!');
            embed.setDescription('The bot has been updated.');
            (s4dmessage.channel).send({
                embeds: [embed],
            });
            // Send an embed to the channel with the id "1012956599440113672"
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('Updating Github Repository');
            embed.setDescription('The bot is now updating the github repository.');
            (s4dmessage.channel).send({
                embeds: [embed],
            });
            // Update the github repository https://github.com/ThatError404/Paradox-Bot/
            var exec = require('child_process').exec;
            await delay(5000);
            var embed = new Discord.MessageEmbed()
            embed.setColor('#b3315b');
            embed.setTitle('Update Complete!');
            embed.setDescription('The Github repository has been updated.');
            (s4dmessage.channel).send({
                embeds: [embed],
            });
            await delay(5000);
            exit();
        }
    }
});
// #endregion

// #region Git Update Alert
// Every 30 seconds, check if there is an update at the repository https://github.com/ThatError404/ParadoxBot and use the personal key from .env called "GITKEY"
setInterval(function() {
    var request = require('request');
    var last_update = fs.readFileSync('git.update', 'utf8');
    request({
        url: 'https://api.github.com/repos/ThatError404/Paradox-Bot/commits',
        headers: {
            'User-Agent': 'Paradox Bot',
            'Authorization': 'token ' + process.env.GITKEY
        }
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);
            var latest = body[0].sha;
            if (latest != last_update) {
                fs.writeFileSync('git.update', latest);
                var embed = new Discord.MessageEmbed()
                embed.setColor('#b3315b');
                embed.setTitle('Update Available!');
                embed.setDescription('The Github repository has been updated!\n\nRepository: https://github.com/ThatError404/Paradox-Bot/');
                (s4d.client.channels.cache.get("1012956599440113672")).send({
                    embeds: [embed],
                });
            }
        } else {
            console.log(error);
        }
    }).on('error', function(err) {
        console.log(err);
    });
} , 30000);

// #endregion

    return s4d;
    })();