import Bot from "../";

export default async (id, msg) => {
  const MSG_LIMIT = 9192;
  const ROW_LIMIT = 100;
  const parts = msg.match(new RegExp(`.{1,${MSG_LIMIT}}`, "g"));
  if (msg.length > MSG_LIMIT || parts.length > ROW_LIMIT) {
    let message = "";
    let rowCounter = 0;
    for await (let part of parts) {
      if (part.length + message.length > MSG_LIMIT || rowCounter >= ROW_LIMIT) {
        await Bot.telegram.sendMessage(id, message, {
          parse_mode: "MarkdownV2",
          disable_web_page_preview: true,
        });
        message = "";
        rowCounter = 0;
      }
      message += part + "\n";
      rowCounter++;
    }
    await Bot.telegram.sendMessage(id, message, {
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    });
  } else {
    await Bot.telegram.sendMessage(id, msg, {
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    });
  }
};
