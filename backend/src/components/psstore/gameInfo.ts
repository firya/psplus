import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { IGame, IPlusInfo, IGameData } from "../../models/games";
import { dayBetween } from "../../utils/date";

export interface IGameInfo {
  plus: IPlusInfo;
  data: IGameData;
}

const getGameInfo = async (game: IGame): Promise<IGameInfo | null> => {
  try {
    const gameData =
      dayBetween(game.data.modified, Date.now()) < 7
        ? game.data
        : await getRawgData(game.name);
    return {
      plus: await getPSStore(game.id),
      data: gameData,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default getGameInfo;

const getPSStore = async (id: number): Promise<IPlusInfo> => {
  const baseUrl = `https://store.playstation.com/en-us/concept/`;
  const htmlContent = await fetch(`${baseUrl}${id}`);
  const text = await htmlContent.text();
  const HTML = new JSDOM(text);

  const psPlusText = HTML.window.document.querySelector(
    ".psw-pdp-card-anchor .psw-c-t-ps-plus"
  )?.parentNode?.parentNode?.textContent;

  if (psPlusText && psPlusText.includes("Subscribe")) {
    let tier: string = new RegExp("plus ([a-z]+)", "gi").exec(psPlusText)[1];
    let type: string = "access";

    if (new RegExp("stream", "gi").test(psPlusText)) {
      tier = "extra";
      type = "access";
    } else if (new RegExp("trial", "gi").test(psPlusText)) {
      type = "trial";
    }

    const until = new RegExp("Offer ends (.*)", "gi").exec(psPlusText);
    const untilDate = until ? new Date(until[1]).getTime() : null;

    return {
      tier: tier,
      acessType: type,
      to: untilDate,
    };
  } else {
    return {
      tier: null,
      acessType: null,
    };
  }
};

const getRawgData = async (name: string): Promise<IGameData> => {
  const rawgData = await fetch(
    `https://api.rawg.io/api/games?key=${process.env.RAWGIO_TOKEN}&search=${name}&page_size=1`
  );
  let json = await rawgData.json();

  let result = {};

  if (json.results.length > 0) {
    result = {
      ...result,
      description: json.results[0].description || "",
      metacritic: json.results[0].metacritic || null,
      background_image: json.results[0].background_image || "",
      platforms: json.results[0].platforms.map(
        (platform) => platform.platform.name
      ),
      esrb_rating: json.results[0].esrb_rating.name || null,
      released: new Date(json.results[0].released).getTime() || null,
      modified: Date.now(),
    };
  }

  console.log(result);

  return result as IGameData;
};
