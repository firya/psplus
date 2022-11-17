import Users, { IUser } from "../../models/users";

export default () => async (ctx, next) => {
  const publicCommands: string[] = [
    "myid",
    "start",
    "report",
    "help",
    "getall",
    "getextra",
    "getpremium",
    "getexpiring",
    "getnew",
    "reportnow",
  ];

  if (ctx.channelPost || ctx.message) {
    if (ctx.state?.command) {
      if (!publicCommands.includes(ctx.state.command.command)) {
        const { id } = ctx.update.message.from;

        if ((await checkUserStatus(id)) !== "admin") {
          ctx.reply(`You have no permission to use this command`);
          return;
        }
      }
    }
  }
  return next();
};

export const checkUserStatus = async (id: number): Promise<string> => {
  const getUser: IUser = await Users.findOne({ id });

  return getUser ? getUser.status : "";
};
