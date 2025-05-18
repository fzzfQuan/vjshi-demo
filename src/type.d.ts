export type LicType = "NP" | "LP" | "LPPLUS";
export type AuditStatus = "SUCCESS" | "FAIL";
export type BusinessLine = "fotos" | "videos" | "music";

// 基础数据类型
export interface BaseItem {
  auditStatus: AuditStatus;
  coverImage: string;
  price: number;
  title: string;
  licType: LicType;
}

// 定义图片数据类型
export interface FotoItem extends BaseItem {
  softwareType: "图片素材" | "AI模板" | "PSD模板";
  fid: number;
}

// 定义视频数据类型
export interface VideoItem extends BaseItem {
  softwareType: "视频素材" | "AE模板" | "C4D模板";
  vid: number;
}

export interface MusicItem extends BaseItem {
  mid: number;
}

// 定义购物车选中项类型
export interface CartSelectedItem {
  id: number;
  title: string;
  type: BusinessLine;
  price?: number;
}

export type VideoBougth = {
  vid: number;
  licTypes: LicType[];
};

export type MusicBougth = {
  mid: number;
  licTypes: LicType[];
};

export type FotoBougth = {
  fid: number;
  licTypes: LicType[];
};
