# discord.js-framework
This is a framework just like discord.js commando, but is more simple, and easier to use.

## How to install it?
```shell
$ npm i --save discord.js-framework
```

## How to use it?

```js
const {Framework} = require("discord.js-framework");

new Framework({
	token: "YOUR_BOT_TOKEN",
	prefix: "YOUR_BOT_PREFIX"
});

[
	`${__dirname}/commands`,
	`${__dirname}/events`
].forEach(x => Framework.LoadFolders(x));

Framework.startBot();
```
Unlike discord.js-commando, this framework is abusing the static properties, which enables itself to keep its instance, and be used in any file.

## How to make commands?

you can make a folder, and have command files in it, or have the commands made in the index.js file. You can do it in anyway you would like.

```js

Framework.addCommand({
	name: 'ping',
	description: 'Pong!',
	category: 'Miscellaneous',
	enable: true,
	invoke: (ctx) => {
		ctx.sendMessage('Pong');
	}
});
```

if you decide to make command files, then you would need to load them to allow the framework to access them, and load the commands.

```js
[
	`${__dirname}/commands`
].forEach(x => Framework.LoadFolders(x));
```
This will load the files for you, so you don't have to go inot the hassle of making a function to do this.

## What about events?
Yes same process as adding a command

```js
Framework.addEvent({
	name: 'guildCreate',
	invoke: (guild) => {
		// do something
	}
});
```

# TODO
	
- [x] Make Framework
- [x] Add functionality for adding commands, and events.
- [x] Add Default events and commands.

# Command Structure

|	Prop name | Type | Required |
|-----------|------|----------|
| name | string| Yes |
| aliases | string[] | No |
| description | string | No |
| usage | string[] | No |
| category | string[] | No |
| enable | boolean | No |
| dmOnly | boolean | No |
| guildOnly | boolean | No |
| permissions | `{user?: PermissionString[], self?: PermissionString[]}` | No |
| preconditions | `((ctx: CommandContext) => boolean \| string[]` | No |
| invoke | `(ctx: CommandContext) => unknown;` | Yes |

# Event Structure

|Prop name | Type |
|----------|------|
| name | string |
| invoke | `(ctx: CommandContext) => unknown;` |