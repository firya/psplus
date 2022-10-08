export const dayBetween = (date1: number, date2: number) => {
  const diff = date2 - date1;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const unixtimeToDate = (unixtime: number, time: boolean = false) => {
  const date = new Date(unixtime);
  const day: string = date.getDate().toString().padStart(2, "0");
  const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
  const year: string = date.getFullYear().toString();

  if (!time) return `${day}.${month}.${year}`;

  const hour: string = date.getHours().toString().padStart(2, "0");
  const minute: string = date.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${year} ${hour}:${minute}`;
};
