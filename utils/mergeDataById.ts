type SourceData<T> = {
  sourceArray: T[];
  sourceKey: keyof T;
  pickKey: keyof T; // 动态指定来源数组中的 URL 字段
};

type TargetData<U> = {
  targetArray: U[];
  targetKey: keyof U;
  newKey: string;
};

export function mergeDataById<
  T extends Record<string, any>,
  U extends Record<string, any>,
  K extends keyof T & keyof U
>(sourceData: SourceData<T>, targetData: TargetData<U>): U[] {
  const { sourceArray, sourceKey, pickKey = "url" } = sourceData;
  const { targetArray, targetKey, newKey = "pcImage" } = targetData;

  // 建立 Map 快速查找
  const sourceMap = new Map<unknown, T>(
    sourceArray.map((item) => [item[sourceKey], item])
  );

  // 合并数据并新增新字段
  return targetArray.map((targetItem) => {
    const key = targetItem[targetKey as K];
    const sourceItem = sourceMap.get(key);

    return {
      ...targetItem,
      [newKey]: sourceItem ? sourceItem[pickKey] : null, // 动态使用 pickKey
    };
  });
}
