import { IGameInfo } from "../components/psstore/gameInfo";
import { updateGame } from "./updateGameList";

describe("updateGame", () => {
  Date.now = jest.fn(() => new Date(2022, 8, 26, 0, 0, 0).valueOf());
  const dateCreated = new Date(Date.now() - 86400000 * 10);
  const dateModified = new Date(Date.now() - 86400000);
  const dateFrom = new Date(Date.now() - 86400000 * 7);
  const dateTo = new Date(Date.now() + 86400000 * 10);
  const dateToLess = new Date(Date.now() + 86400000 * 9);
  const dateToGreater = new Date(Date.now() + 86400000 * 11);

  const game = {
    id: 10001114,
    name: "Stray",
    created: dateCreated.getTime(),
    modified: dateModified.getTime(),
    plus: {
      from: dateFrom.getTime(),
      to: dateTo.getTime(),
      acessType: "access",
      tier: "Extra",
      updated: false,
    },
  };

  const gameInfo = {
    plus: {
      tier: "Extra",
      acessType: "access",
      to: dateToGreater.getTime(),
    },
    data: {},
  } as IGameInfo;

  test("Not in PS plus", async () => {
    const tempGame = { ...game, plus: { ...game.plus } };
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
    const tempGame = { ...game, plus: { ...game.plus } };
    delete tempGame.plus;
    expect(
      await updateGame(tempGame, { plus: {}, data: {} } as IGameInfo)
    ).toEqual({
      $set: { modified: Date.now(), data: {} },
    });
  });
  test("In PS plus but without from date", async () => {
    const tempGame = { ...game, plus: { ...game.plus } };
    delete tempGame.plus.from;
    expect(await updateGame(tempGame, gameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        plus: { ...gameInfo.plus, from: Date.now() },
        data: {},
      },
    });
  });
  test("In PS plus but no <to> date and get new", async () => {
    const tempGame = { ...game, plus: { ...game.plus } };
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
    const tempGame = { ...game, plus: { ...game.plus } };
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
  test("In PS plus but was removed", async () => {
    const tempGame = { ...game, plus: { ...game.plus } };
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
    const tempGame = { ...game, plus: { ...game.plus } };
    tempGame.plus.to = null;
    const tempGameInfo = {
      plus: {
        tier: "Premium",
        acessType: "stream",
        to: dateTo.getTime(),
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
  test("Updated PS plus info with <to> less then current", async () => {
    const tempGame = { ...game, plus: { ...game.plus } };
    tempGame.plus.updated = true;
    const tempGameInfo = {
      plus: {
        tier: "Premium",
        acessType: "stream",
        to: dateToLess.getTime(),
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
  test("Updated PS plus info with <to> greater then current", async () => {
    const tempGame = { ...game, plus: { ...game.plus } };
    const tempGameInfo = {
      plus: {
        tier: "Premium",
        acessType: "stream",
        to: dateToGreater.getTime(),
      },
      data: {},
    } as IGameInfo;

    expect(await updateGame(tempGame, tempGameInfo)).toEqual({
      $set: {
        plus: {
          ...tempGameInfo.plus,
          from: tempGame.plus.from,
        },
        modified: Date.now(),
        data: {},
      },
    });
  });
});
