import { dayBetween } from "./date";

describe("dayBetween", () => {
  test("Correct", () => {
    const date1 = new Date(2020, 0, 1).getTime();
    const date2 = new Date(2020, 0, 2).getTime();
    expect(dayBetween(date1, date2)).toBe(1);
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
