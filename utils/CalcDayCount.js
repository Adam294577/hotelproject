import dayjs from "dayjs";
export const CalcDayCount = (checkOut, checkIn) => {
  return dayjs(checkOut).diff(dayjs(checkIn), "day");
};
