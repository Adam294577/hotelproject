// 專案用途: 與後端要資料時 並非所有圖片都有存取 故需要 引用 第三方 api Imgur 拿圖片
// 若id有值 表示有對應後端的 '手機版'圖片  會搭配使用 utils/mergeDataById 擴充'桌機版'圖片
export default defineEventHandler(() => {
  return {
    pc: [
      {
        id: "67487ddbbe5ded203d6599b8",
        title: "pc-尊爵雙人房",
        url: "https://i.imgur.com/KTqVekd.png",
        imageUrlList: [
          "https://i.imgur.com/KTqVekd.png",
          "https://i.imgur.com/7yP2SSi.png",
          "https://i.imgur.com/7b4khjQ.png",
          "https://i.imgur.com/mtafsrX.png",
          "https://i.imgur.com/3s8G1w2.png",
        ],
      },
      {
        id: "67487f59be5ded203d6599bd",
        title: "pc-景觀雙人房",
        url: "https://i.imgur.com/DSqXHFK.png",
        imageUrlList: [
          "https://i.imgur.com/DSqXHFK.png",
          "https://i.imgur.com/HQ5Az0r.png",
          "https://i.imgur.com/gcqOH1n.png",
          "https://i.imgur.com/KSn5dPY.png",
          "https://i.imgur.com/pLvdANK.png",
        ],
      },
      {
        id: "6748814ebe5ded203d6599c0",
        title: "pc-豪華雅緻房",
        url: "https://i.imgur.com/ccgybGl.png",
        imageUrlList: [
          "https://i.imgur.com/ccgybGl.png",
          "https://i.imgur.com/H46bq7U.png",
          "https://i.imgur.com/2ODQVCY.png",
          "https://i.imgur.com/jyGVPmd.png",
          "https://i.imgur.com/Xrh8fhp.png",
        ],
      },
      {
        id: "67488291be5ded203d6599c3",
        title: "pc-景觀尊榮家庭房",
        url: "https://i.imgur.com/wq2CpGG.png",
        imageUrlList: [
          "https://i.imgur.com/wq2CpGG.png",
          "https://i.imgur.com/pT4eQJM.png",
          "https://i.imgur.com/T1VvkGP.png",
          "https://i.imgur.com/zLIfmvq.png",
          "https://i.imgur.com/qJBa56y.png",
        ],
      },
    ],
    mobile: [
      {
        id: "67487ddbbe5ded203d6599b8",
        title: "mobile-尊爵雙人房",
        url: "https://i.imgur.com/0kAeH8H.png",
        imageUrlList: [
          "https://i.imgur.com/0kAeH8H.png",
          "https://i.imgur.com/cx4HTOd.png",
          "https://i.imgur.com/yppakVJ.png",
          "https://i.imgur.com/2blZAfO.png",
          "https://i.imgur.com/SqzRTqs.png",
        ],
      },
      {
        id: "67487f59be5ded203d6599bd",
        title: "mobile-景觀雙人房",
        url: "https://i.imgur.com/4sXkO1y.png",
        imageUrlList: [
          "https://i.imgur.com/4sXkO1y.png",
          "https://i.imgur.com/6ITVJOf.png",
          "https://i.imgur.com/gN4WgkC.png",
          "https://i.imgur.com/jVOCRjf.png",
          "https://i.imgur.com/zJKlq7A.png",
        ],
      },
      {
        id: "6748814ebe5ded203d6599c0",
        title: "mobile-豪華雅緻房",
        url: "https://i.imgur.com/qGNl17b.png",
        imageUrlList: [
          "https://i.imgur.com/qGNl17b.png",
          "https://i.imgur.com/cXa6pBl.png",
          "https://i.imgur.com/e0vZCe2.png",
          "https://i.imgur.com/bE9UftE.png",
          "https://i.imgur.com/UuREHMa.png",
        ],
      },
      {
        id: "67488291be5ded203d6599c3",
        title: "mobile-景觀尊榮家庭房",
        url: "https://i.imgur.com/Sndnpti.png",
        imageUrlList: [
          "https://i.imgur.com/Sndnpti.png",
          "https://i.imgur.com/FPWJZvY.png",
          "https://i.imgur.com/vFJrs8n.png",
          "https://i.imgur.com/09wRzwi.png",
          "https://i.imgur.com/kI0D5pY.png",
        ],
      },
    ],
  };
});
