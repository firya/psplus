import fecth from "node-fetch";
import { JSDOM } from "jsdom";

const baseUrl = `https://store.playstation.com/en-us/concept/`;

interface IGameInfo {
  tier: string;
  acessType: string;
  to?: number;
}

const getGameInfo = async (id: number): Promise<IGameInfo | null> => {
  try {
    const result = await fecth(`${baseUrl}${id}`);
    const text = await result.text();
    const HTML = new JSDOM(text);

    const psPlusText = HTML.window.document.querySelector(
      ".psw-pdp-card-anchor .psw-c-t-ps-plus"
    )?.parentNode?.parentNode?.textContent;

    if (psPlusText && psPlusText.includes("Subscribe")) {
      const tier = new RegExp("plus ([a-z]+)", "gi").exec(psPlusText)[1];
      let type = "access";
      if (new RegExp("stream", "gi").test(psPlusText)) {
        type = "stream";
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
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default getGameInfo;
