export const formatMoney = (num) => {
  if (typeof num !== "number" || isNaN(num)) {
    return "-";
  }
  return `NT$ ${num.toLocaleString()}`;
};
