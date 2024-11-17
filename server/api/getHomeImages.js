// 專案用途: 與後端要資料時 並非所有圖片都有存取 故需要 引用 第三方 api Imgur 拿圖片
// 若id有值 表示有對應後端的 '手機版'圖片  會搭配使用 utils/mergeDataById 擴充'桌機版'圖片
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
          id: "6739909cdffe5d5d41f8fcf2",
          title: "pc-秋季旅遊",
          url: "https://i.imgur.com/fd1vR7b.png",
        },
        {
          id: "673990eedffe5d5d41f8fcf5",
          title: "pc-輕鬆住房專案",
          url: "https://i.imgur.com/GrAIAQR.png",
        },
        {
          id: "67399129dffe5d5d41f8fcf8",
          title: "pc-耶誕快樂",
          url: "https://i.imgur.com/MoanaNn.png",
        },
      ],
      mobile: [
        {
          id: "6739909cdffe5d5d41f8fcf2",
          title: "mobile-秋季旅遊",
          url: "https://i.imgur.com/ikx5SuA.png",
        },
        {
          id: "673990eedffe5d5d41f8fcf5",
          title: "mobile-輕鬆住房專案",
          url: "https://i.imgur.com/LBLgrrw.png",
        },
        {
          id: "67399129dffe5d5d41f8fcf8",
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
        {
          id: "6739bf4089088fa6fbd868ff",
          title: "pc-海霸",
          url: "https://i.imgur.com/RmUQObA.png",
        },
        {
          id: "6739bf6f89088fa6fbd86902",
          title: "pc-日食",
          url: "https://i.imgur.com/DEWYIcw.png",
        },
        {
          id: "6739bfa989088fa6fbd86905",
          title: "pc-山臻",
          url: "https://i.imgur.com/Y5AKsAZ.png",
        },
        {
          id: "6739c02989088fa6fbd86908",
          title: "pc-月永",
          url: "https://i.imgur.com/9dGz06f.png",
        },
        {
          id: "6739c05689088fa6fbd8690b",
          title: "pc-天潮",
          url: "https://i.imgur.com/dPWjLoo.png",
        },
      ],
      mobile: [
        {
          id: "6739bf4089088fa6fbd868ff",
          title: "mobile-海霸",
          url: "https://i.imgur.com/yJ6E4TB.png",
        },
        {
          id: "6739bf6f89088fa6fbd86902",
          title: "mobile-日食",
          url: "https://i.imgur.com/ZDdki9u.png",
        },
        {
          id: "6739bfa989088fa6fbd86905",
          title: "mobile-山臻",
          url: "https://i.imgur.com/R2AdL6C.png",
        },
        {
          id: "6739c02989088fa6fbd86908",
          title: "mobile-月永",
          url: "https://i.imgur.com/od4RtXn.png",
        },
        {
          id: "6739c05689088fa6fbd8690b",
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
