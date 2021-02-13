import { Framework } from '../../Framework';
import { CommandContext } from '../../utils/CommandContext';

console.log('Attempting to load latency command.');
export function invoke() {
  if (Framework.config.useDefaultCommands)
  Framework.commands.set('latency', {
    name: 'latency',
    description: 'Displays my latency in ms.',
    category: 'Miscellaneous',
    invoke: (ctx: CommandContext) => {
      ctx.sendMessage(`Pong`);
    },
  });
}

