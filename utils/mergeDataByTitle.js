export function mergeDataByTitle(data) {
  return data.mobile.map((mobileItem) => {
    const pcItem = data.pc.find(
      (pc) => pc.title.split("-")[1] === mobileItem.title.split("-")[1]
    );
    return {
      title: mobileItem.title.split("-")[1],
      image: mobileItem.url,
      pcImage: pcItem?.url || null,
    };
  });
}
