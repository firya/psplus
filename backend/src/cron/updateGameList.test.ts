import { IGameInfo } from "../components/psstore/gameInfo";
import { updateGame } from "./updateGameList";

describe("updateGame", () => {
  const game = {
    id: 10001114,
    name: "Stray",
    created: new Date(2022, 7, 14).getTime(),
    modified: new Date(2022, 7, 15).getTime(),
    plus: {
      from: new Date(2022, 7, 16).getTime(),
      to: new Date(2022, 7, 20).getTime(),
      acessType: "access",
      tier: "Extra",
      updated: false,
    },
  };

  const gameInfo = {
    plus: {
      tier: "Extra",
      acessType: "access",
      to: new Date(2022, 7, 31).getTime(),
    },
    data: {},
  } as IGameInfo;

  Date.now = jest.fn(() => new Date(Date.UTC(2022, 7, 16, 11, 0, 0)).valueOf());

  test("Not in PS plus", async () => {
    const tempGame = { ...game };
    delete tempGame.plus;
    expect(await updateGame(tempGame, gameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        plus: { ...gameInfo.plus, from: Date.now() },
        data: {},
      },
    });
  });
  test("Not in PS plus and not added", async () => {
    const tempGame = { ...game };
    delete tempGame.plus;
    expect(
      await updateGame(tempGame, { plus: {}, data: {} } as IGameInfo)
    ).toEqual({
      $set: { modified: Date.now(), data: {} },
    });
  });
  test("In PS plus but no <to> date and get new", async () => {
    const tempGame = { ...game };
    tempGame.plus.to = null;
    expect(await updateGame(tempGame, gameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        plus: { ...gameInfo.plus, from: tempGame.plus.from },
        data: {},
      },
    });
  });
  test("In PS plus but no <to> date and don't get it", async () => {
    const tempGame = { ...game };
    tempGame.plus.to = null;
    const tempGameInfo = { ...gameInfo };
    tempGameInfo.plus.to = null;
    expect(await updateGame(tempGame, tempGameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        plus: { ...gameInfo.plus, from: tempGame.plus.from },
        data: {},
      },
    });
  });
  test("In PS plus but <to> date less then new", async () => {
    const tempGame = { ...game };
    expect(await updateGame(tempGame, gameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        plus: { ...gameInfo.plus, from: tempGame.plus.from },
        data: {},
      },
    });
  });
  test("In PS plus but was removed", async () => {
    const tempGame = { ...game };
    expect(
      await updateGame(tempGame, { plus: {}, data: {} } as IGameInfo)
    ).toEqual({
      $set: {
        modified: Date.now(),
        plus: { ...tempGame.plus, to: Date.now() },
        data: {},
      },
    });
  });
  test("Updated PS plus info without <to>", async () => {
    const tempGame = { ...game };
    tempGame.plus.updated = true;
    tempGame.plus.to = null;
    const tempGameInfo = {
      plus: {
        tier: "Premium",
        acessType: "stream",
        to: new Date(2022, 7, 31).getTime(),
      },
      data: {},
    } as IGameInfo;
    expect(await updateGame(tempGame, tempGameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        plus: {
          ...tempGameInfo.plus,
          from: tempGame.plus.from,
        },
        data: {},
      },
    });
  });
  test("Updated PS plus info with <to> less then now", async () => {
    const tempGame = { ...game };
    tempGame.plus.updated = true;
    tempGame.plus.to = new Date(2022, 7, 1).getTime();
    const tempGameInfo = {
      plus: {
        tier: "Premium",
        acessType: "stream",
        to: new Date(2022, 7, 31).getTime(),
      },
      data: {},
    } as IGameInfo;
    expect(await updateGame(tempGame, tempGameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        plus: {
          ...tempGameInfo.plus,
          from: Date.now(),
        },
        data: {},
      },
    });
  });
  test("Updated PS plus info with <to> greater then new", async () => {
    const tempGame = { ...game };
    tempGame.plus.updated = true;
    tempGame.plus.to = new Date(2022, 8, 1).getTime();
    const tempGameInfo = {
      plus: {
        tier: "Premium",
        acessType: "stream",
        to: new Date(2022, 7, 31).getTime(),
      },
      data: {},
    } as IGameInfo;
    expect(await updateGame(tempGame, tempGameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        data: {},
      },
    });
  });
});
