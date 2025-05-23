"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";

import { createPortal } from "react-dom";

// 抽屉组件的属性接口
interface DrawerProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: "bottom" | "top" | "left" | "right";
  snapPoints?: number[];
  closeThreshold?: number;
  modal?: boolean;
  handleOnly?: boolean;
}

// 抽屉内容属性接口
interface DrawerContentProps {
  children: React.ReactNode;
  className?: string;
}

// 抽屉触发器属性接口
interface DrawerTriggerProps {
  children: React.ReactNode;
  className?: string;
}

// 抽屉覆盖层属性接口
interface DrawerOverlayProps {
  className?: string;
}

// 创建抽屉上下文
type DrawerContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  direction: "bottom" | "top" | "left" | "right";
  snapPoints: number[];
  activeSnapPoint: number | null;
  setActiveSnapPoint: (point: number | null) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const DrawerContext = React.createContext<DrawerContextType | null>(null);

const useDrawerContext = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("抽屉组件必须在 DrawerRoot 内部使用");
  }
  return context;
};

const DrawerPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

// 抽屉根组件
const DrawerRoot: React.FC<DrawerProps> = ({
  children,
  open: controlledOpen,
  onOpenChange,
  direction = "right",
  snapPoints = [1],
}) => {
  const [open, setOpenState] = useState(controlledOpen || false);
  const [activeSnapPoint, setActiveSnapPoint] = useState<number | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  // 处理受控组件的状态同步
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setOpenState(controlledOpen);
    }
  }, [controlledOpen]);

  // 设置开关状态并触发回调
  const setOpen = useCallback(
    (newOpen: boolean) => {
      setOpenState(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange]
  );

  return (
    <DrawerContext.Provider
      value={{
        open,
        setOpen,
        direction,
        snapPoints,
        activeSnapPoint,
        setActiveSnapPoint,

        contentRef,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

// 抽屉触发器组件
const DrawerTrigger: React.FC<DrawerTriggerProps> = ({
  children,
  className,
}) => {
  const { setOpen } = useDrawerContext();

  // 处理点击事件，确保平滑过渡
  const handleOpen = React.useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <div
      className={className}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
    >
      {children}
    </div>
  );
};

// 抽屉内容组件
const DrawerContent: React.FC<DrawerContentProps> = ({
  children,
  className,
}) => {
  const { open, direction, contentRef, setOpen } = useDrawerContext();

  // 添加状态跟踪动画是否完成
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // 使用react-spring来处理动画
  const getTransformValue = useCallback(() => {
    switch (direction) {
      case "bottom":
        return "translateY(100%)";
      case "top":
        return "translateY(-100%)";
      case "left":
        return "translateX(-100%)";
      case "right":
        return "translateX(100%)";
      default:
        return "translateY(100%)";
    }
  }, [direction]);

  // 使用react-spring的useSpring钩子创建动画
  const [styles, api] = useSpring(() => ({
    transform: open ? "translate(0%)" : getTransformValue(),
    config: { ...config.gentle, tension: 220, friction: 22 },
    immediate: !open,
  }));

  // 添加ESC键盘事件监听器
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    // 添加事件监听器
    document.addEventListener("keydown", handleKeyDown);

    // 组件卸载时移除事件监听器
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  // 当open状态变化时更新动画和动画完成状态
  useEffect(() => {
    if (open) {
      // 抽屉打开时，重置动画完成状态
      setIsAnimationComplete(false);
      api.start({
        transform: "translate(0%)",
        immediate: false,
      });
    } else {
      api.start({
        transform: getTransformValue(),
        immediate: false,
        onRest: () => {
          setIsAnimationComplete(true);
        },
      });
    }
  }, [open, api, direction, getTransformValue]);


  if (!open && isAnimationComplete) return null;

  // 根据方向设置样式
  const getDirectionStyles = () => {
    switch (direction) {
      case "bottom":
        return "fixed bottom-0 left-0 right-0";
      case "top":
        return "fixed top-0 left-0 right-0";
      case "left":
        return "fixed top-0 left-0 bottom-0";
      case "right":
        return "fixed top-0 right-0 bottom-0";
      default:
        return "fixed bottom-0 left-0 right-0";
    }
  };

  return (
    <animated.div
      ref={contentRef}
      style={styles}
      className={`bg-white shadow-lg z-50 ${getDirectionStyles()} ${
        className || ""
      } will-change-transform`}
      role="dialog"
      data-state={open ? "open" : "closed"}
      data-direction={direction}
    >
      {children}
    </animated.div>
  );
};

// 抽屉覆盖层组件
const DrawerOverlay: React.FC<DrawerOverlayProps> = ({ className }) => {
  const { open, setOpen } = useDrawerContext();

  // 使用react-spring处理覆盖层动画
  const [styles, api] = useSpring(() => ({
    opacity: open ? 1 : 0,
    config: { ...config.gentle, tension: 200, friction: 20 },
    immediate: !open,
  }));

  // 当open状态变化时更新动画和动画完成状态
  useEffect(() => {
    if (open) {
      api.start({
        opacity: 1,
        immediate: false,
      });
    } else {
      api.start({
        opacity: 0,
        immediate: false,
      });
    }
  }, [open, api]);

  // 如果覆盖层关闭且动画已完成，不渲染内容（完全从DOM中移除）
  if (!open) return null;

  return (
    <animated.div
      style={styles}
      className={`fixed inset-0 bg-black/40 z-40 ${className || ""}`}
      onClick={() => setOpen(false)}
      data-state={open ? "open" : "closed"}
    />
  );
};

// 抽屉关闭组件
const DrawerClose: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = (props) => {
  const { setOpen } = useDrawerContext();

  // 处理点击事件，确保平滑过渡
  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <button
      className={`${props.className} cursor-pointer`}
      onClick={handleClose}
      role="button"
      tabIndex={0}
      aria-label="Close"
    >
      {props.children}
    </button>
  );
};

// 抽屉组件导出
export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Overlay: DrawerOverlay,
  Portal: DrawerPortal,
  Close: DrawerClose,
};
