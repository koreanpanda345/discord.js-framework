export type FrameworkConfig = {
  token: string;
  prefix?: string;
  useDefaultCommands?: boolean;
  useDefaultEvents?:
    | {
        ready?: boolean;
        message?: boolean;
      }
    | boolean;
  ignore?: {
    bots?: boolean;
    edits?: boolean;
    dms?: boolean;
  };
  caseSensitive?: boolean;
};
