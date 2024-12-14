export const LoadImg = (imgUrl, loadingRef) => {
  const imgArr = [...imgUrl];
  let i = 0;
  imgArr.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      i += 1;
      if (i === imgArr.length) {
        loadingRef.value = false;
      }
    };
  });
};
