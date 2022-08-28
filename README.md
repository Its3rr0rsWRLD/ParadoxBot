<img src="https://github.com/ThatError404/ParadoxBot/blob/main/image.png?raw=true"></img>
<h1 align="center"><b><a href="https://discord.com/oauth2/authorize?client_id=1012959415768457238&permissions=8&scope=bot%20applications.commands">Paradox</a></b></h1>

<h2 align="center">Wanna use this bot as a template for your bot? Skip to <a href="https://github.com/ThatError404/ParadoxBot#use-this-for-yourself">here</a>.</h2>

<h3 align="center"><b>Paradox is an Open Source Discord bot that can do anything from <a href="https://github.com/ThatError404/ParadoxBot/new/main#backup">backing up entire servers</a> to <a href="https://github.com/ThatError404/ParadoxBot#bal---shows-the-balance-of-the-specified-user">managing an entire economy</a> and is constantly being updated.</b></h3>

<h2 align="center"><b>Ok, but what <i>all</i> can it do?</b></h2>
<h3><b>help (command)</b> - Shows a help message for that specific command.</b></h3>
<h3><b>ping</b> - Pings the bot.</h3>
<h3><b>serverinfo</b> - Shows information about the server.</h3>
<h3><b>userinfo or info</b> - Shows information about a user.</h3>
<h3><b>coinflip or flip</b> - Flips a coin.</h3>
<h3><b>work</b> - Earns coins.</h3>
<h3><b>clear</b> - Clears the chat. (Mod)</h3>
<h3><b>bal</b> - Shows the balance of the specified user.</h3>
<h3><b>prefix</b> - Changes the prefix. (Mod)</h3>
<h3><b>kick</b> - Kicks a user. (Mod)</h3>
<h3><b>ban</b> - Bans a user. (Mod)</h3>
<h3><b>mute</b> - Mutes a user. (Mod)</h3>
<h3><b>unmute</b> - Unmutes a user. (Mod)</h3>
<h3><b>level</b> - Shows the level of the specified user.</h3>
<h3><b>xp</b> - Shows the xp of the specified user.</h3>
<h3><b>meme</b> - Shows 1 random meme.</h3>
<h3><b>memes</b> (1-5) - Shows the specified amount of memes.</h3>

---
<h2 align="center"><b>But why should I use Paradox?</b></h2>
<h3>Idk, it's free though :)</h3>

------
<h1 align="center"><b>Use this for yourself</b></h3>
<p align="center"><b>Your gonna need node.js btw</b></p>

First, download the template from <a href="https://github.com/ThatError404/ParadoxBot/releases/tag/Template-v0.5">here</a>, then unzip it. Now, use `npm install` to install all the dependencies.

Don't forget to add your bot's token to <a href="https://github.com/ThatError404/ParadoxBot/blob/main/bot.js#L53">line 53</a>. There are 2 ways you can do this: either by adding a file called `.env` to the root of the project and adding the token in there (Ex. `TOKEN=<your token>`), or by adding the token to the bot.js file on <a href="https://github.com/ThatError404/ParadoxBot/blob/main/bot.js#L53">line 53</a> (Ex. `await s4d.client.login("TOKEN").catch((e) => { s4d.tokenInvalid = true; s4d.tokenError = e; });`).

---

<a href="https://nodejs.org/en/"><b>Node:</b></a> To start the bot, use `npm start` 

<a href="https://bun.sh/"><b>Bun:</b></a> which i highly recommend when hosting a bot that uses slash commands, use `bun start`
