import { Message } from 'discord.js';
import { Framework } from '../../Framework';
import { CommandContext } from '../../utils/CommandContext';

console.log('Attempting to loaded the message event...');

export function invoke() {
  if (
    (typeof Framework.config.useDefautlEvents === 'boolean' && Framework.config.useDefautlEvents) ||
    (typeof Framework.config.useDefautlEvents === 'object' && Framework.config.useDefautlEvents.message)
  )
    Framework.events.set('message', {
      name: 'message',
      invoke: async (message: Message) => {
        const config = Framework.config;
  
        if ((config.ignore?.bots && message.author.bot) || (config.ignore?.dms && message.channel.type === 'dm')) return;
  
        const prefix = Framework.config.prefix!;
        if (config.caseSensitive && !message.content.startsWith(prefix)) return;
        else if (!config.caseSensitive && !message.content.toLowerCase().startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
  
        const ctx = new CommandContext(message, args);
  
        const commandName = args.shift()!.toLowerCase();
  
        const command =
          Framework.commands.get(commandName) ||
          Framework.commands.find((cmd) => cmd.aliases! && cmd.aliases?.includes(commandName));
  
        if (!command) return;
  
        let run = true;
  
        command.permissions?.user?.forEach((permission) => {
          if (!ctx.member?.hasPermission(permission)) {
            run = false;
            ctx.sendMessage(
              `You don't have permission to use this command. You must have the permission of \`${permission}\` to use this command.`,
            );
            return;
          }
        });
        if (!run) return;
  
        command.permissions?.self?.forEach((permission) => {
          if (!ctx.me?.hasPermission(permission)) {
            run = false;
            ctx.sendMessage(
              `I don't have permission to use this command. I must have the permission of \`${permission}\` to use this command.`,
            );
            return;
          }
        });
        if (!run) return;
  
        command.preconditions?.forEach(async (condition) => {
          const result = await condition(ctx);
  
          if (typeof result === 'boolean' && !result) {
            run = false;
            ctx.sendMessage(`Something Happened`);
            return;
          }
          if (typeof result === 'undefined') {
            run = false;
            ctx.sendMessage(`Something happened`);
            return;
          }
          if (typeof result === 'string') {
            run = false;
            ctx.sendMessage(result);
            return;
          }
        });
  
        if (!run) return;
  
        try {
          await command.invoke(ctx);
        } catch (error) {
          console.error(error);
        }
      },
    });
}

