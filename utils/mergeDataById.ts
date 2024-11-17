type SourceData<T> = {
  sourceArray: T[];
  sourceKey?: keyof T; // 可选，添加默认值支持
  pickKey?: keyof T; // 可选，添加默认值支持
};

type TargetData<U> = {
  targetArray: U[];
  targetKey?: keyof U; // 可选，添加默认值支持
  newKey?: string; // 可选，添加默认值支持
};

export function mergeDataById<
  T extends Record<string, any>,
  U extends Record<string, any>
>(
  {
    sourceArray,
    sourceKey = "id", // 默認值
    pickKey = "url", // 默認值
  }: SourceData<T>,
  {
    targetArray,
    targetKey = "_id", // 默認值
    newKey = "pcImage", // 默認值
  }: TargetData<U>
): U[] {
  // 建立 Map 快速查找
  const sourceMap = new Map<unknown, T>(
    sourceArray.map((item) => [item[sourceKey], item])
  );

  // 合并数据并新增新字段
  return targetArray.map((targetItem) => {
    const key = targetItem[targetKey];
    const sourceItem = sourceMap.get(key);

    return {
      ...targetItem,
      [newKey]: sourceItem ? sourceItem[pickKey] : null, // 动态使用 pickKey
    };
  });
}
