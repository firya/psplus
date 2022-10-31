import { Composer } from "telegraf";
import GameModel from "../models/games";

import { unixtimeToDate } from "../utils/date";

interface ImessageProps {
  id: number;
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
      reply_markup: {
        inline_keyboard: [
          [{ text: "Update", callback_data: "update " + item.id }],
        ],
      },
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
    // "plus.from": { $lt: Date.now() },
    // $or: [{ "plus.to": { $gt: Date.now() } }, { "plus.to": null }],
    limit: 50,
  });

  let results = [];

  for (const record of records) {
    results.push({
      id: record.id,
      title: record.name,
      tier: record.plus.tier,
      accessType: record.plus.acessType,
      modified: record.modified,
      to: record.plus.to,
      image: record.data.background_image,
      url: `https://store.playstation.com/en-us/concept/${record.id}`,
      platforms: record.data.platforms,
      rating: record.data.metacritic,
      release: record.data.released,
    });
  }

  return results.map((item) => ({
    id: item.id,
    image: item.image,
    title: item.title,
    description: item.description,
    message: generateMessage(item),
  }));
};

const generateMessage = (row): string => {
  let message: string = `*${row.title}*\n`;

  if (row.modified) {
    message += `\n__Lats update: ${unixtimeToDate(row.modified, true)}__`;
  }

  if (!row.to || row.to > Date.now()) {
    if (row.tier) {
      message += `\n❗PS Plus Tier: ${row.tier} (${row.accessType})`;
    }
    if (row.to) {
      message += `\nExpiring: ${unixtimeToDate(row.to)}`;
    }
  }

  if (row.url) {
    try {
      const parsedUrl = new URL(row.url);
      message += `\n[${parsedUrl.hostname}](${row.url}) \(id: ${row.id}\)`;
    } catch (e) {
      message += `\n[${row.url}](${row.url})`;
    }
  }
  if (row.rating) {
    message += `\nRating: ${row.rating}`;
  }
  if (row.release) {
    message += `\nReleased: ${unixtimeToDate(row.release)}`;
  }

  return message;
};
