import qs from "qs";
import fecth from "node-fetch";
import { waiter } from "../../utils/waiter";

const baseUrl: string = `https://web.np.playstation.com/api/graphql/v1//op`;

let params: any = {
  operationName: "categoryGridRetrieve",
  variables: {
    id: "28c9c2b2-cecc-415c-9a08-482a605cb104",
    pageArgs: { size: 100, offset: 0 },
    sortBy: null,
    filterBy: [],
    facetOptions: [
      "ageRating",
      "conceptGenres",
      "conceptReleaseDate",
      "conceptVrCompatibility",
      "webBasePrice",
      "productGenres",
      "productReleaseDate",
      "productVrCompatibility",
      "storeDisplayClassification",
      "targetPlatforms",
    ],
    maxResults: null,
  },
  extensions: {
    persistedQuery: {
      version: 1,
      sha256Hash: process.env.PS_STORE_HASH,
    },
  },
};

export interface IGameData {
  name: string;
  id: number;
}

export const getGameList = async (
  size: number,
  offset: number
): Promise<IGameData[]> => {
  const newParams = { ...params };
  newParams.variables.pageArgs.size = size;
  newParams.variables.pageArgs.offset = offset;

  newParams.variables = JSON.stringify(newParams.variables);
  newParams.extensions = JSON.stringify(newParams.extensions);

  const result = await fecth(`${baseUrl}?${qs.stringify(newParams)}`);

  const json = await result.json();

  return json.data.categoryGridRetrieve.concepts.map((item: any) => ({
    name: item.name,
    id: item.id,
  }));
};

const getAllGames = async (): Promise<IGameData[]> => {
  const size = 100;
  let resultCount = 100;
  let i = 0;
  let result = [];

  while (resultCount == size) {
    const tempResult = await getGameList(size, size * i);
    resultCount = tempResult.length;
    result = result.concat(tempResult);
    console.log("Update game list:", i * size);
    await waiter(1000);
    i++;
  }

  return result;
};

export default getAllGames;
