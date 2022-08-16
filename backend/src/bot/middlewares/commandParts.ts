const regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i;

interface ICommand {
  text: string;
  command: string;
  bot: string;
  args: string;
  splitArgs: string[];
}

export default () =>
  (ctx, next): void => {
    if (ctx.channelPost || ctx.message) {
      const messageText: string =
        ctx.updateType === "channel_post"
          ? ctx.channelPost.text
          : ctx.message.text;

      const parts = regex.exec(messageText);
      if (!parts) return next();
      const command: ICommand = {
        text: messageText,
        command: parts[1],
        bot: parts[2],
        args: parts[3],
        get splitArgs() {
          return !parts[3]
            ? []
            : parts[3].split(/\s+/).filter((arg) => arg.length);
        },
      };
      ctx.state.command = command;
    }
    return next();
  };
