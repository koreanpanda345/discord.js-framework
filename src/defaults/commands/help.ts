import { MessageEmbed } from 'discord.js';
import { Framework } from '../../Framework';
import { CommandContext } from '../../utils/CommandContext';
export function invoke() {
// usage:
// ${prefix}help
// ${prefix}help (command name)
if (Framework.config.useDefautlEvents)
  Framework.commands.set('help', {
    name: 'help',
    aliases: ['command', 'commands '],
    description: 'Displays a list of commands, or information about a specific command.',
    usage: [`${Framework.config.prefix}help`, `${Framework.config.prefix}help (latency)`],
    category: 'Information',
    enable: true,
    guildOnly: true,
    invoke: (ctx: CommandContext) => {
      let embed = new MessageEmbed();
      if (!ctx.args[0]) {
        // get list of commands.
        embed.description = '';
        Framework.commands.forEach((cmd) => {
          embed.description += `${Framework.config.prefix}${cmd.name}\n`;
        });

        embed.setTitle('List of my commands.');
      } else {
        // Gets information about a specific command.
        const command =
          Framework.commands.get(ctx.args[0]) ||
          Framework.commands.find((cmd) => cmd.aliases! && cmd.aliases?.includes(ctx.args[0]));
        if (!command) return ctx.sendMessage(`Couldn't find a command like ${ctx.args[0]}`);

        embed.setTitle(`Information on ${command.name}`);
        embed.setDescription(
          `Description: ${command.description || 'No Description was provided'}\nUsages: \n${
            command.usage?.join('\n') || 'No Usages was provided.'
          }\nCategory: ${command.category || 'Uncategorized'}`,
        );
        if (command.permissions?.user !== undefined && command.permissions?.user?.length !== 0)
          embed.addField('User Permissions', `${command.permissions.user.join(', ')}`);
        if (command.permissions?.self !== undefined && command.permissions?.self?.length !== 0)
          embed.addField('Bot Permission', `${command.permissions?.self?.join(', ')}`);
      }
      embed.setColor('RANDOM');
      ctx.sendMessage(embed);
    },
  });

}
