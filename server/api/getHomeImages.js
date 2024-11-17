// 專案用途: 與後端要資料時 並非所有圖片都有存取 故需要 引用 第三方 api Imgur 拿圖片
// 若id有值 表示有對應後端手機版圖片 會搭配使用 utils/mergeDataById 擴充桌機版圖片
export default defineEventHandler(() => {
  return {
    banner: {
      pc: [
        {
          id: null,
          title: "pc-享樂酒店",
          url: "https://i.imgur.com/BxIh8bn.png",
        },
      ],
      mobile: [
        {
          id: null,
          title: "mobile-享樂酒店",
          url: "https://i.imgur.com/ZGYeRqG.png",
        },
      ],
    },
    news: {
      pc: [
        {
          id: null,
          title: "pc-秋季旅遊",
          url: "https://i.imgur.com/fd1vR7b.png",
        },
        {
          id: null,
          title: "pc-輕鬆住房專案",
          url: "https://i.imgur.com/GrAIAQR.png",
        },
        {
          id: null,
          title: "pc-耶誕快樂",
          url: "https://i.imgur.com/MoanaNn.png",
        },
      ],
      mobile: [
        {
          id: null,
          title: "mobile-秋季旅遊",
          url: "https://i.imgur.com/ikx5SuA.png",
        },
        {
          id: null,
          title: "mobile-輕鬆住房專案",
          url: "https://i.imgur.com/LBLgrrw.png",
        },
        {
          id: null,
          title: "mobile-耶誕快樂",
          url: "https://i.imgur.com/2e7uCyT.png",
        },
      ],
    },
    rooms: {
      pc: [
        {
          id: null,
          title: "pc-尊爵雙人房",
          url: "https://i.imgur.com/BeUXFTV.png",
        },
      ],
      mobile: [
        {
          id: null,
          title: "mobile-尊爵雙人房",
          url: "https://i.imgur.com/icLwVsf.png",
        },
      ],
    },
    culinary: {
      pc: [
        { id: null, title: "pc-海霸", url: "https://i.imgur.com/RmUQObA.png" },
        { id: null, title: "pc-日食", url: "https://i.imgur.com/DEWYIcw.png" },
        { id: null, title: "pc-山臻", url: "https://i.imgur.com/Y5AKsAZ.png" },
        { id: null, title: "pc-月永", url: "https://i.imgur.com/9dGz06f.png" },
        { id: null, title: "pc-天潮", url: "https://i.imgur.com/dPWjLoo.png" },
      ],
      mobile: [
        {
          id: null,
          title: "mobile-海霸",
          url: "https://i.imgur.com/yJ6E4TB.png",
        },
        {
          id: null,
          title: "mobile-日食",
          url: "https://i.imgur.com/ZDdki9u.png",
        },
        {
          id: null,
          title: "mobile-山臻",
          url: "https://i.imgur.com/R2AdL6C.png",
        },
        {
          id: null,
          title: "mobile-月永",
          url: "https://i.imgur.com/od4RtXn.png",
        },
        {
          id: null,
          title: "mobile-天潮",
          url: "https://i.imgur.com/77fjgGA.png",
        },
      ],
    },
    traffic: {
      pc: [
        {
          id: null,
          title: "pc-交通方式map",
          url: "https://i.imgur.com/Kkguiza.png",
        },
      ],
      mobile: [
        {
          id: null,
          title: "mobile-交通方式map",
          url: "https://i.imgur.com/mcFhsSu.png",
        },
      ],
    },
  };
});
