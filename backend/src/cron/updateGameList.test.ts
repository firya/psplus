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
    },
  };

  const gameInfo = {
    tier: "Extra",
    acessType: "access",
    to: new Date(2022, 7, 31).getTime(),
  };

  Date.now = jest.fn(() => new Date(Date.UTC(2022, 7, 16, 11, 0, 0)).valueOf());

  test("Not in PS plus", async () => {
    const tempGame = { ...game };
    delete tempGame.plus;
    expect(await updateGame(tempGame, gameInfo)).toEqual({
      $set: { modified: Date.now(), plus: { ...gameInfo, from: Date.now() } },
    });
  });
  test("Not in PS plus and not added", async () => {
    const tempGame = { ...game };
    delete tempGame.plus;
    expect(await updateGame(tempGame, null)).toEqual({
      $set: { modified: Date.now() },
    });
  });
  test("In PS plus but no <to> date and get new", async () => {
    const tempGame = { ...game };
    tempGame.plus.to = null;
    expect(await updateGame(tempGame, gameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        plus: { ...gameInfo, from: tempGame.plus.from },
      },
    });
  });
  test("In PS plus but no <to> date and don't get it", async () => {
    const tempGame = { ...game };
    tempGame.plus.to = null;
    expect(await updateGame(tempGame, gameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        plus: { ...gameInfo, from: tempGame.plus.from },
      },
    });
  });
  test("In PS plus but <to> date less then new", async () => {
    const tempGame = { ...game };
    expect(await updateGame(tempGame, gameInfo)).toEqual({
      $set: {
        modified: Date.now(),
        plus: { ...gameInfo, from: tempGame.plus.from },
      },
    });
  });
  test("In PS plus but was removed", async () => {
    const tempGame = { ...game };
    expect(await updateGame(tempGame, null)).toEqual({
      $set: {
        modified: Date.now(),
        plus: { ...tempGame.plus, to: Date.now() },
      },
    });
  });
});
