"use client";

import { cn } from "@/utils";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";

// Tabs组件的属性接口
interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  dir?: "ltr" | "rtl";
  activationMode?: "automatic" | "manual";
}

// Tabs列表属性接口
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  loop?: boolean;
}

// Tabs触发器属性接口
interface TabsTriggerProps {
  children: React.ReactNode;
  className?: string;
  value: string;
  disabled?: boolean;
}

// Tabs内容属性接口
interface TabsContentProps {
  children: React.ReactNode;
  className?: string;
  value: string;
  forceMount?: boolean;
}

// 创建Tabs上下文
type TabsContextType = {
  value: string;
  setValue: (value: string) => void;
  orientation: "horizontal" | "vertical";
  dir: "ltr" | "rtl";
  activationMode: "automatic" | "manual";
};

const TabsContext = React.createContext<TabsContextType | null>(null);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs组件必须在 TabsRoot 内部使用");
  }
  return context;
};

// Tabs根组件
const TabsRoot: React.FC<TabsProps> = ({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = "horizontal",
  dir = "ltr",
  activationMode = "automatic",
}) => {
  // 如果没有提供默认值或受控值，使用子组件中的第一个TabsTrigger的值
  const [value, setValueState] = useState<string>(defaultValue || "");

  // 处理受控组件的状态同步
  useEffect(() => {
    if (controlledValue !== undefined) {
      setValueState(controlledValue);
    }
  }, [controlledValue]);

  // 设置值并触发回调
  const setValue = useCallback(
    (newValue: string) => {
      setValueState(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider
      value={{
        value,
        setValue,
        orientation,
        dir,
        activationMode,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

// Tabs列表组件
const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  const { orientation, dir, value } = useTabsContext();
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLDivElement>(null);
  // 更新指示条位置
  useEffect(() => {
    if (tabsRef.current && indicatorRef.current) {
      const activeTab = tabsRef.current.querySelector(`#tab-${value}`);
      if (activeTab) {
        const tabRect = activeTab.getBoundingClientRect();
        const listRect = tabsRef.current.getBoundingClientRect();

        // 计算指示条的位置和宽度
        const left = tabRect.left - listRect.left;
        const width = tabRect.width;

        // 设置CSS变量
        indicatorRef.current.style.setProperty(
          "--tabs-indicator-x",
          `${left}px`
        );
        indicatorRef.current.style.setProperty(
          "--tabs-indicator-w",
          `${width}px`
        );
      }
    }
  }, [value]);

  return (
    <div
      ref={tabsRef}
      role="tablist"
      aria-orientation={orientation}
      dir={dir}
      className={cn(
        "flex relative items-center border-b border-[#EDEDED] mx-10 justify-start",
        className
      )}
    >
      {children}

      <div
        ref={indicatorRef}
        className="absolute bg-[#0D0D0D] bottom-0 left-0 pointer-events-none rounded h-[3px] transition-[transform,width] duration-300"
        style={{
          width: "var(--tabs-indicator-w)",
          transform: "translateX(var(--tabs-indicator-x))",
        }}
      ></div>
    </div>
  );
};

// Tabs触发器组件
const TabsTrigger: React.FC<TabsTriggerProps> = ({
  children,
  className,
  value,
  disabled = false,
}) => {
  const { value: selectedValue, setValue } = useTabsContext();
  const isSelected = selectedValue === value;

  // 处理点击事件
  const handleClick = () => {
    if (!disabled) {
      setValue(value);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) {
        setValue(value);
      }
    }
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      tabIndex={isSelected ? 0 : -1}
      className={cn(
        "transition-colors duration-300 flex items-center justify-center relative outline-none text-base px-1 py-4 font-medium ml-10 first:ml-0 text-[#888888] hover:text-[#0D0D0D] data-selected:text-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:text-current pt-0 space-x-1",
        {
          "text-[#0D0D0D]": isSelected,
        },
        className
      )}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-state={isSelected ? "active" : "inactive"}
      data-disabled={disabled ? "" : undefined}
    >
      {children}
    </button>
  );
};

// Tabs内容组件
const TabsContent: React.FC<TabsContentProps> = ({
  children,
  className,
  value,
}) => {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;

  return (
    <div
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      id={`panel-${value}`}
      hidden={!isSelected}
      tabIndex={0}
      className={className}
      data-state={isSelected ? "active" : "inactive"}
    >
      {children}
    </div>
  );
};

// 导出组件
const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { Tabs, TabsRoot, TabsList, TabsTrigger, TabsContent };
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps };
