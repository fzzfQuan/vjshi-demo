import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// 模拟视频购买历史数据
const mockVideoBoughtHistory = [
  {
    vid: 200001,
    licTypes: ["NP", "LP"],
  },
];

// 视频购买历史查询接口
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const vidsParam = searchParams.get("vids");

    if (!vidsParam) {
      return NextResponse.json(
        { message: "缺少必要参数vids" },
        { status: 400 }
      );
    }

    // 解析vids参数
    const vids = vidsParam.split(",").map((id) => parseInt(id, 10));

    // 过滤出已购买的视频历史
    const boughtHistory = mockVideoBoughtHistory
      .filter((item) => vids.includes(item.vid))
      .map((item) => ({
        licTypes: item.licTypes,
        vid: item.vid,
      }));

    return NextResponse.json(boughtHistory, { status: 200 });
  } catch (error) {
    console.error("获取视频购买历史失败:", error);
    return NextResponse.json(
      { message: "获取视频购买历史失败" },
      { status: 500 }
    );
  }
}
