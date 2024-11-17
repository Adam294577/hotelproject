// 用法: https://api.imgur.com/endpoints/image
// 專案用途: 與後端要圖片的資料格式為 https開頭
import { promises as fs } from "fs";
import path from "path";

interface ImgurResponseSuccess {
  data: {
    id: string;
    title: string | null;
    description: string | null;
    datetime: number;
    type: string;
    animated: boolean;
    width: number;
    height: number;
    size: number;
    views: number;
    bandwidth: number;
    deletehash: string;
    link: string;
    [key: string]: any; // 允許額外字段
  };
  success: true;
  status: number;
}

interface ImgurResponseError {
  data: null;
  success: false;
  status: number;
}

type ImgurResponse = ImgurResponseSuccess | ImgurResponseError;

export default defineEventHandler(async () => {
  // 檢查是否為開發環境
  if (!process.dev) {
    return {
      success: false,
      message: "This API is available only in development mode.",
    };
  }

  const config = useRuntimeConfig();
  const publicPath = path.resolve("public/images");

  try {
    const files = await fs.readdir(publicPath);
    const imageFiles = files.filter((file) =>
      /\.(png|jpe?g|gif|webp)$/i.test(file)
    );

    const uploadResults = await Promise.all(
      imageFiles.map(async (file) => {
        const imagePath = path.join(publicPath, file);
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = imageBuffer.toString("base64");

        const response = await $fetch<ImgurResponse>(
          "https://api.imgur.com/3/image",
          {
            method: "POST",
            body: {
              image: base64Image,
              type: "base64",
            },
            headers: {
              Authorization: `Client-ID ${config.imgurClientId}`,
            },
          }
        );

        return {
          file,
          imgurData: response.data,
        };
      })
    );

    return {
      success: true,
      uploaded: uploadResults,
    };
  } catch (error) {
    console.error("Error uploading images:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to upload images",
      data: error,
    });
  }
});
