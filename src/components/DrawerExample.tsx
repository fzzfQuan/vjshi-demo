"use client";

import { useState } from "react";
import { Drawer } from "./ui/drawer";

export default function DrawerExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">抽屉组件示例</h2>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          打开抽屉
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay />

          <Drawer.Content className="p-4 max-h-[80vh] overflow-auto">
            <div className="px-4">
              <h3 className="text-lg font-semibold mb-2">抽屉内容</h3>
              <p className="mb-4">
                这是一个基于vaul库实现的抽屉组件，支持拖拽和手势操作。
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded">
                  <h4 className="font-medium">特性</h4>
                  <ul className="list-disc pl-5 mt-2">
                    <li>支持从底部、顶部、左侧和右侧打开</li>
                    <li>支持拖拽手势</li>
                    <li>可自定义样式</li>
                    <li>支持模态和非模态模式</li>
                  </ul>
                </div>

                <button
                  className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  关闭抽屉
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
