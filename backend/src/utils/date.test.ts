import { dayBetween, unixtimeToDate } from "./date";

describe("dayBetween", () => {
  test("Correct", () => {
    const date1 = new Date(2020, 0, 1, 0, 0, 0).getTime();
    const date2 = new Date(2020, 0, 2, 14, 0, 0).getTime();
    expect(dayBetween(date1, date2)).toBe(2);
  });
  test("Correct zero", () => {
    const date1 = new Date(2020, 0, 1).getTime();
    const date2 = new Date(2020, 0, 1).getTime();
    expect(dayBetween(date1, date2)).toBe(0);
  });
  test("Correct minus", () => {
    const date1 = new Date(2020, 0, 2).getTime();
    const date2 = new Date(2020, 0, 1).getTime();
    expect(dayBetween(date1, date2)).toBe(-1);
  });
  test("Negative numbers", () => {
    const date1 = -1 * 60 * 60 * 24 * 1000;
    const date2 = -5 * 60 * 60 * 24 * 1000;
    expect(dayBetween(date1, date2)).toBe(-4);
  });
});

describe("unixtimeToDate", () => {
  const unixtime = new Date(2020, 0, 28).getTime();
  test("Correct", () => {
    expect(unixtimeToDate(unixtime)).toBe("28.01.2020");
  });
});
