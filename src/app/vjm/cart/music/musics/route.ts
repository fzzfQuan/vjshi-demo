import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// 模拟购物车数据
const mockCartFotos = [
  {
    auditStatus: "SUCCESS",
    coverImage: "/musics/image-1.jpg",
    price: 99,
    softwareType: "视频素材",
    title: "创意城市风光视频素材",
    licType: "NP",
    mid: 300001,
  },
  {
    auditStatus: "SUCCESS",
    coverImage: "/musics/image-2.jpg",
    price: 199,
    softwareType: "AE模板",
    title: "商业宣传片AE模板",
    licType: "LP",
    mid: 100002,
  },
  {
    auditStatus: "SUCCESS",
    coverImage: "/musics/image-3.jpg",
    price: 299,
    softwareType: "C4D模版",
    title: "3D产品展示C4D模板",
    licType: "LPPLUS",
    mid: 300003,
  },
];

// 存储购物车数据（模拟数据库）
let cartFotos = [...mockCartFotos];

// GET 方法：获取购物车图片列表
export async function GET() {
  try {
    return NextResponse.json({ data: cartFotos }, { status: 200 });
  } catch (error) {
    console.error("获取购物车图片失败:", error);
    return NextResponse.json(
      { message: "获取购物车图片失败" },
      { status: 500 }
    );
  }
}

// DELETE 方法：删除购物车中的图片
export async function DELETE(request: NextRequest) {
  try {
    // 从URL中获取要删除的图片ID
    const { searchParams } = new URL(request.url);
    const midParam = searchParams.get("mid");

    if (!midParam) {
      return NextResponse.json({ message: "缺少必要参数fid" }, { status: 400 });
    }

    const mid = parseInt(midParam);

    // 检查图片是否存在
    const initialLength = cartFotos.length;
    cartFotos = cartFotos.filter((item) => item.mid !== mid);

    if (cartFotos.length === initialLength) {
      return NextResponse.json(
        { message: `未找到ID为${mid}的图片` },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "删除成功", mid }, { status: 200 });
  } catch (error) {
    console.error("删除购物车图片失败:", error);
    return NextResponse.json(
      { message: "删除购物车图片失败" },
      { status: 500 }
    );
  }
}
