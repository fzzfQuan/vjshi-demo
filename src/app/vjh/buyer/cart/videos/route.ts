import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

let mockCartVideos = [
  {
    auditStatus: "SUCCESS",
    coverImage: "/videos/image-1.jpg",
    price: 199,
    softwareType: "视频素材",
    title: "动态城市夜景",
    licType: "NP",
    vid: 200001,
  },
  {
    auditStatus: "SUCCESS",
    coverImage: "/videos/image-2.jpg",
    price: 299,
    softwareType: "AE模板",
    title: "企业宣传片头",
    licType: "LP",
    vid: 200002,
  },
  {
    auditStatus: "SUCCESS",
    coverImage: "/videos/image-3.jpg",
    price: 399,
    softwareType: "C4D模版",
    title: "3D产品展示",
    licType: "LPPLUS",
    vid: 200003,
  },
];

// GET 处理函数
export async function GET() {
  // 模拟API响应延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 返回模拟数据
  return NextResponse.json({ data: mockCartVideos });
}

// DELETE 处理函数 - 根据vid移除购物车中的视频素材
export async function DELETE(request: NextRequest) {
  // 获取URL中的vid参数
  const url = new URL(request.url);
  const vid = url.searchParams.get("vid");

  if (!vid) {
    return NextResponse.json({ error: "缺少必要的vid参数" }, { status: 400 });
  }

  // 模拟API响应延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 查找要删除的视频索引
  const videoIndex = mockCartVideos.findIndex(
    (video) => video.vid === Number(vid)
  );

  if (videoIndex === -1) {
    return NextResponse.json(
      { error: "未找到指定的视频素材" },
      { status: 404 }
    );
  }

  // 从购物车中移除视频
  mockCartVideos = mockCartVideos.filter((video) => video.vid !== Number(vid));

  // 返回成功状态和更新后的购物车数据
  return NextResponse.json({
    success: true,
    message: "视频素材已从购物车中移除",
    data: mockCartVideos,
  });
}
