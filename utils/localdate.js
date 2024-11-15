export function useToLocalISOString(date) {
  const offset = date.getTimezoneOffset() * 60000; // 獲取本地時區的偏移量，單位為毫秒
  const localDate = new Date(date.getTime() - offset); // 調整日期以匹配本地時間
  return localDate.toISOString().slice(0, -1); // 移除結尾的 "Z"，保持本地時區格式
}

// 可搭配 zod驗證後 格式轉換
// 日期 可空值
// const dateSchema = z.coerce.date().transform((date) => {
//   return useToLocalISOString(date);
// });

// 日期 必填
// const datelike = z.union([z.number(), z.string(), z.date()]);
// const dateSchema2 = datelike.pipe(z.coerce.date()).transform((date) => {
//   return useToLocalISOString(date);
// });
