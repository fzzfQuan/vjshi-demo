import {
  CartSelectedItem,
  FotoBougth,
  FotoItem,
  MusicBougth,
  MusicItem,
  VideoBougth,
  VideoItem,
} from "@/type";

// 获取购物车图片列表
export async function getFotosList(): Promise<FotoItem[]> {
  try {
    const response = await fetch("/vjh/buyer/cart/fotos");

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("获取购物车图片失败:", error);
    throw error;
  }
}

// 获取购物车视频列表
export async function getVideosList(): Promise<VideoItem[]> {
  try {
    const response = await fetch("/vjh/buyer/cart/videos");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("获取购物车视频失败:", error);
    throw error;
  }
}

// 获取购物车音乐列表
export async function getMusicList(): Promise<MusicItem[]> {
  try {
    const response = await fetch("/vjm/cart/music/musics");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("获取购物车音乐失败:", error);
    throw error;
  }
}

// 删除购物车中的图片
export async function deleteFoto(fid: number) {
  try {
    const response = await fetch(`/vjh/buyer/cart/fotos?fid=${fid}`, {
      method: "DELETE",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("删除购物车图片失败:", error);
    throw error;
  }
}

// 删除购物车中的视频
export async function deleteVideo(vid: number) {
  try {
    const response = await fetch(`/vjh/buyer/cart/videos?vid=${vid}`, {
      method: "DELETE",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("删除购物车视频失败:", error);
    throw error;
  }
}

// 删除购物车中的音乐
export async function deleteMusic(mid: number) {
  try {
    const response = await fetch(`/vjm/cart/music/musics?mid=${mid}`, {
      method: "DELETE",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("删除购物车音乐失败:", error);
    throw error;
  }
}

// 计算选中商品的总价
export function calculateTotalPrice(selectedItems: CartSelectedItem[]) {
  return selectedItems.reduce((total, item) => {
    return total + (item?.price || 0);
  }, 0);
}

export async function checkPurchasedVideo(
  ids: number[]
): Promise<VideoBougth[]> {
  try {
    const searchParams = new URLSearchParams();
    ids.forEach((id) => searchParams.append("vids", id.toString()));

    const response = await fetch(
      `/vjh/video/download/lic-types-bought?${searchParams.toString()}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("检查购买状态失败:", error);
    throw error;
  }
}

export async function checkPurchasedFoto(ids: number[]): Promise<FotoBougth[]> {
  try {
    const searchParams = new URLSearchParams();
    ids.forEach((id) => searchParams.append("fids", id.toString()));

    const response = await fetch(
      `/vjf/foto/download/lic-types-bought?${searchParams.toString()}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("检查购买状态失败:", error);
    throw error;
  }
}

export async function checkPurchasedMusic(
  ids: number[]
): Promise<MusicBougth[]> {
  try {
    const searchParams = new URLSearchParams();
    ids.forEach((id) => searchParams.append("mids", id.toString()));

    const response = await fetch(
      `/vjm/music/download/lic-types-bought?${searchParams.toString()}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("检查购买状态失败:", error);
    throw error;
  }
}
