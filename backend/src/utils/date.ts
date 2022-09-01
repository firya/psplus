export const dayBetween = (date1: number, date2: number) => {
  const diff = date2 - date1;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const unixtimeToDate = (unixtime: number) => {
  const date = new Date(unixtime);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};
