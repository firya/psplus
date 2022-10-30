import { getPSStore } from "./gameInfo";

describe("getPSStore", () => {
  it("should return data without end date", async () => {
    const resp = await getPSStore(10001114); // Stray

    expect(resp).toEqual({
      acessType: "access",
      tier: "Extra",
      to: null,
    });
  });
  it("should return empty data", async () => {
    const resp = await getPSStore(10001130); // Call of Duty: Modern Warfare 2

    expect(resp).toEqual({
      acessType: null,
      tier: null,
    });
  });
  it("should return data with end date", async () => {
    const resp = await getPSStore(10003551); //GTA: Vice city

    expect(resp).toEqual({
      acessType: "access",
      tier: "Extra",
      to: 1676948400000,
    });
  });
});
