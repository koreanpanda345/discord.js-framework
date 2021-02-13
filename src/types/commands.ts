import { PermissionString } from 'discord.js';
import { CommandContext } from '../utils/CommandContext';

export type Command = {
  name: string;
  aliases?: Array<string>;
  description?: string;
  usage?: Array<string>;
  category?: string;
  enable?: boolean;
  dmOnly?: boolean;
  guildOnly?: boolean;
  permissions?: {
    user?: Array<PermissionString>;
    self?: Array<PermissionString>;
  };
  preconditions?: Array<(ctx: CommandContext) => boolean | string>;
  invoke: (ctx: CommandContext) => unknown;
};
