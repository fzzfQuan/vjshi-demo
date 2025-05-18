
import { MusicBougth } from "@/type";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


// 模拟音乐购买历史数据
const mockMusicBoughtHistory: MusicBougth[] = [];

// 音乐购买历史查询接口
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const midsParam = searchParams.get("mids");

    if (!midsParam) {
      return NextResponse.json(
        { message: "缺少必要参数mids" },
        { status: 400 }
      );
    }

    // 解析mids参数
    const mids = midsParam.split(",").map((id) => parseInt(id, 10));

    // 过滤出已购买的音乐历史
    const boughtHistory = mockMusicBoughtHistory
      .filter((item) => mids.includes(item.mid))
      .map((item) => ({
        licTypes: item.licTypes,
        mid: item.mid,
      }));

    return NextResponse.json(boughtHistory, { status: 200 });
  } catch (error) {
    console.error("获取音乐购买历史失败:", error);
    return NextResponse.json(
      { message: "获取音乐购买历史失败" },
      { status: 500 }
    );
  }
}
