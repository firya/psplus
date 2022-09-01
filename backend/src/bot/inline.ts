import { Composer } from "telegraf";
import GameModel from "../models/games";

import { unixtimeToDate } from "../utils/date";

interface ImessageProps {
  image: string;
  title: string;
  description: string;
  message: string;
}

export default Composer.on("inline_query", async (ctx) => {
  const { query } = ctx.inlineQuery;
  const results = await getGameList(query);

  return await ctx.answerInlineQuery(
    results.slice(0, 50).map((item, i) => ({
      id: i.toString(),
      type: "article",
      thumb_url: item.image,
      title: item.title,
      description: item.description,
      input_message_content: {
        message_text: item.message,
        parse_mode: "Markdown",
      },
    }))
  );
});

const getGameList = async (query: string): Promise<ImessageProps[]> => {
  const records = await GameModel.find({
    name: {
      $regex: query,
      $options: "i",
    },
    limit: 50,
  });

  let results = [];

  for (const record of records) {
    results.push({
      title: record.name,
      image: record.data.background_image,
      url: `https://store.playstation.com/en-us/concept/${record.id}`,
      platforms: record.data.platforms,
      rating: record.data.metacritic,
      release: unixtimeToDate(record.data.released),
    });
  }

  return results.map((item) => ({
    image: item.image,
    title: item.title,
    description: item.description,
    message: generateMessage(item),
  }));
};

const generateMessage = (row): string => {
  let message: string = `*${row.title}*\n`;

  if (row.url !== "") {
    try {
      const parsedUrl = new URL(row.url);
      message += `\n[${parsedUrl.hostname}](${row.url})`;
    } catch (e) {
      message += `\n[${row.url}](${row.url})`;
    }
  }
  if (row.platforms !== "") {
    message += `\nПлатформы: ${row.platforms}`;
  }
  if (row.rating !== "") {
    message += `\nРейтинг: ${row.rating}`;
  }
  if (row.release !== "") {
    message += `\nДата релиза: ${row.release}`;
  }

  return message;
};
