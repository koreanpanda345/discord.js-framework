import { FrameworkConfig } from './types/FrameworkConfig';
import { Client, Collection } from 'discord.js';
import { Command } from './types/commands';
import { Event } from './types/events';
import { readdirSync } from 'fs';

export class Framework {
  private static _client: Client;
  private static _commands: Collection<string, Command>;
  private static _events: Collection<string, Event>;
  private static _config: FrameworkConfig;
  constructor(config: FrameworkConfig) {
    Framework._client = new Client();
    Framework._commands = new Collection();
    Framework._events = new Collection();

    if (typeof config.prefix === 'undefined') config.prefix = '!';
    if (typeof config.useDefaultCommands === 'undefined') config.useDefaultCommands = true;
    if (typeof config.useDefaultEvents === 'undefined') config.useDefaultEvents = true;
    if (typeof config.useDefaultEvents === 'object') {
      if (typeof config.useDefaultEvents.ready === 'undefined') config.useDefaultEvents.ready = true;
      if (typeof config.useDefaultEvents.message === 'undefined') config.useDefaultEvents.message = true;
    }

    if (typeof config.caseSensitive === 'undefined') config.caseSensitive = true;
    if (typeof config.ignore === 'object') {
      if (typeof config.ignore.bots === 'undefined') config.ignore.bots = true;
      if (typeof config.ignore.dms === 'undefined') config.ignore.dms = true;
      if (typeof config.ignore.edits === 'undefined') config.ignore.edits = false;
    }

    Framework._config = config;
  }

  public static addCommand(command: Command) {
    if (Framework._commands.has(command.name)) {
      console.warn(`Command ${command.name} has already been loaded.`);
      return;
    }
    Framework._commands.set(command.name, command);
    console.log(`Command ${command.name} has been loaded.`);
  }

  public static addCommands(commands: Array<Command>) {
    commands.forEach((command) => Framework.addCommand(command));
    console.log(`Finished loading in ${commands.length} commands.`);
  }

  public static addEvent(event: Event) {
    if (Framework._events.has(event.name)) {
      console.warn(`Event ${event.name} has already been loaded.`);
      return;
    }
    Framework._events.set(event.name, event);
    console.log(`Event ${event.name} has been loaded.`);
  }

  public static async LoadFolders(dir: string) {
    let result = await new Promise(async (resolve) => {
      const files = readdirSync(`${dir}`).filter((d) => d.endsWith('.js') || d.endsWith('.ts'));
      for (let file of files) await import(`${dir}/${file}`);
    });
    return result;
  }

  private static async LoadFiles() {
    let result = await new Promise((resolve) => {
      console.log('Loading all required files');
      let folders = [];
      if (Framework._config.useDefaultEvents) folders.push('defaults/events');
      if (Framework._config.useDefaultEvents) folders.push('defaults/commands');

      folders.forEach(async (x) => {
        const events = readdirSync(`./src/${x}`).filter((d) => d.endsWith('.js') || d.endsWith('.ts'));
        for (let file of events) {
          await import(`./${x}/${file}`);
        }
      });
      return resolve(true);
    });
    return result;
  }

  private static LoadTables() {
    const commands: Array<{ name: string; aliases?: Array<string>; enable?: boolean }> = [];
    Framework._commands.array().forEach((cmd) => {
      const { name, aliases, enable } = cmd;

      commands.push({ name, aliases, enable: enable === undefined ? true : enable });
    });
    console.table(commands);
    console.table(Framework._events.array());
  }

  public static async startBot() {
    console.log('Bot is starting...');
    Framework._client.login(Framework._config.token);
    this.LoadFiles()
      .then(() => {
        Framework._events.array().forEach((event) => {
          Framework._client.on(event.name, async (...args) => await event.invoke(...args));
          console.log(`Event ${event.name} was loaded.`);
        });
      })
      .then(() => this.LoadTables());
  }

  public static get config() {
    return {
      prefix: Framework._config.prefix,
      useDefaultCommands: Framework._config.useDefaultCommands,
      useDefautlEvents: Framework._config.useDefaultEvents,
      ignore: Framework._config.ignore,
      caseSensitive: Framework._config.caseSensitive,
    };
  }
  public static get client() {
    return Framework._client;
  }
  public static get commands() {
    return Framework._commands;
  }

  public static get events() {
    return Framework._events;
  }
}
