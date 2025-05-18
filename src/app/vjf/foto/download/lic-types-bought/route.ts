import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// 模拟图片购买历史数据
const mockFotoBoughtHistory = [
  {
    fid: 100002,
    licTypes: ["NP"],
  },
];

// 图片购买历史查询接口
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const fidsParam = searchParams.get("fids");

    if (!fidsParam) {
      return NextResponse.json(
        { message: "缺少必要参数fids" },
        { status: 400 }
      );
    }

    // 解析fids参数
    const fids = fidsParam.split(",").map((id) => parseInt(id, 10));

    // 过滤出已购买的图片历史
    const boughtHistory = mockFotoBoughtHistory
      .filter((item) => fids.includes(item.fid))
      .map((item) => ({
        licTypes: item.licTypes,
        fid: item.fid,
      }));

    return NextResponse.json(boughtHistory, { status: 200 });
  } catch (error) {
    console.error("获取图片购买历史失败:", error);
    return NextResponse.json(
      { message: "获取图片购买历史失败" },
      { status: 500 }
    );
  }
}
