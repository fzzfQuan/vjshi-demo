"use client";

import { useState } from "react";
import { Drawer } from "./ui/drawer";

export default function AdvancedDrawerExample() {
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [snapDrawerOpen, setSnapDrawerOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 底部抽屉 */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">底部抽屉</h3>
        <p className="mb-3 text-gray-600">从屏幕底部滑入的抽屉组件</p>

        <Drawer.Root
          open={bottomDrawerOpen}
          onOpenChange={setBottomDrawerOpen}
          direction="bottom"
        >
          <Drawer.Trigger className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            打开底部抽屉
          </Drawer.Trigger>

          <Drawer.Portal>
            <Drawer.Overlay />

            <Drawer.Content className="p-4 max-h-[80vh] overflow-auto">
              <div className="px-4 py-2">
                <h3 className="text-lg font-semibold mb-2">底部抽屉内容</h3>
                <p className="mb-4">这是从底部滑入的抽屉组件。</p>

                <button
                  className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={() => setBottomDrawerOpen(false)}
                >
                  关闭抽屉
                </button>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      {/* 右侧抽屉 */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">右侧抽屉</h3>
        <p className="mb-3 text-gray-600">从屏幕右侧滑入的抽屉组件</p>

        <Drawer.Root
          open={rightDrawerOpen}
          onOpenChange={setRightDrawerOpen}
          direction="right"
        >
          <Drawer.Trigger className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            打开右侧抽屉
          </Drawer.Trigger>

          <Drawer.Portal>
            <Drawer.Overlay />

            <Drawer.Content className="p-4 w-[300px] h-full overflow-auto">
              <div className="flex justify-start mb-4">
                <div className="h-12 w-1.5 bg-gray-300 rounded-full" />
              </div>

              <div className="px-4 py-2">
                <h3 className="text-lg font-semibold mb-2">右侧抽屉内容</h3>
                <p className="mb-4">这是从右侧滑入的抽屉组件。</p>

                <button
                  className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={() => setRightDrawerOpen(false)}
                >
                  关闭抽屉
                </button>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      {/* 带快照点的抽屉 */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">带快照点的抽屉</h3>
        <p className="mb-3 text-gray-600">支持多个高度快照点的抽屉组件</p>

        <Drawer.Root
          open={snapDrawerOpen}
          onOpenChange={setSnapDrawerOpen}
          direction="bottom"
          snapPoints={[0.3, 0.6, 0.9]} // 30%, 60%, 90%的高度快照点
        >
          <Drawer.Trigger className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
            打开带快照点的抽屉
          </Drawer.Trigger>

          <Drawer.Portal>
            <Drawer.Overlay />

            <Drawer.Content className="p-4 max-h-[90vh] overflow-auto">
              <div className="px-4 py-2">
                <h3 className="text-lg font-semibold mb-2">带快照点的抽屉</h3>
                <p className="mb-4">
                  这个抽屉支持多个高度快照点，可以通过拖拽到不同高度来查看。
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-100 rounded">
                    <h4 className="font-medium">快照点说明</h4>
                    <ul className="list-disc pl-5 mt-2">
                      <li>30% 高度 - 预览模式</li>
                      <li>60% 高度 - 浏览模式</li>
                      <li>90% 高度 - 全屏模式</li>
                    </ul>
                  </div>

                  <p>尝试上下拖拽抽屉手柄，体验不同的快照点效果。</p>

                  <button
                    className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={() => setSnapDrawerOpen(false)}
                  >
                    关闭抽屉
                  </button>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </div>
  );
}
