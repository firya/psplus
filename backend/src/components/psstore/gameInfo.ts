import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { IGame, IPlusInfo, IPlusInfoData, IGameData } from "../../models/games";
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

    const psPlusInfo = await getPSStore(game.id);

    if ("error" in psPlusInfo) {
      console.log(psPlusInfo.error);
      return null;
    }

    return {
      plus: psPlusInfo,
      data: gameData,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default getGameInfo;

export const getPSStore = async (id: number): Promise<IPlusInfoData> => {
  try {
    const baseUrl = `https://store.playstation.com/en-us/concept/`;
    const htmlContent = await fetch(`${baseUrl}${id}`);
    const text = await htmlContent.text();
    const HTML = new JSDOM(text);

    const container = HTML.window.document.querySelector(
      "[data-qa='mfeCtaMain']"
    );
    const psPlusText = container?.querySelector(
      "[data-qa$=discountInfo]"
    )?.textContent;
    const psPlusEndText = container?.querySelector(
      "[data-qa$=discountDescriptor]"
    )?.textContent;

    const psPlusTitle = HTML.window.document.querySelector(
      "[data-qa='mfe-game-title#name']"
    )?.textContent;

    if (psPlusText) {
      let tierArr: string[] = new RegExp("plus ([a-z]+)", "gi").exec(
        psPlusText
      );
      let tier = "";
      if (tierArr?.length === 2) {
        tier = tierArr[1];
      }
      let type: string = "access";

      if (new RegExp("stream", "gi").test(psPlusText)) {
        tier = "extra";
      } else if (new RegExp("trial", "gi").test(psPlusText)) {
        type = "trial";
      }

      let untilDate = null;
      if (psPlusEndText) {
        const until = new RegExp("Offer ends ([0-9/ :GMT+]+)", "gi").exec(
          psPlusEndText
        );
        untilDate = until ? new Date(until[1]).getTime() : null;
      }

      return {
        tier: tier,
        acessType: type,
        to: untilDate,
      };
    } else if (psPlusTitle !== undefined) {
      return {
        tier: null,
        acessType: null,
      };
    } else {
      return {
        error: "HTML structure changed or something, idk",
      };
    }
  } catch (e) {
    return {
      error: e.message,
    };
  }
};

const getRawgData = async (name: string): Promise<IGameData> => {
  const rawgData = await fetch(
    `https://api.rawg.io/api/games?key=${process.env.RAWGIO_TOKEN}&search=${name}&page_size=1`
  );
  let json = await rawgData.json();

  let result = {};

  if (json.results?.length > 0) {
    result = {
      ...result,
      description: json.results[0].description || "",
      metacritic: json.results[0].metacritic || null,
      background_image: json.results[0].background_image || "",
      platforms: json.results[0].platforms?.map(
        (platform) => platform.platform.name
      ),
      esrb_rating: json.results[0].esrb_rating?.name || null,
      released: new Date(json.results[0].released).getTime() || null,
      modified: Date.now(),
    };
  }

  return result as IGameData;
};
