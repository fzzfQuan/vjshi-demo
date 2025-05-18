"use client";

import { cn } from "@/utils";
import * as React from "react";
import { useCallback, useState } from "react";

// 复选框组件的属性接口
interface CheckboxProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  label?: string;
  labelClassName?: string;
}

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  (
    {
      className = "",
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      indeterminate = false,
      disabled = false,
      required = false,
      name,
      value,
      label,
      labelClassName = "",
      ...props
    },
    ref
  ) => {
    // 管理复选框的状态
    const [checkedState, setCheckedState] = useState<boolean>(defaultChecked);

    // 处理受控组件的状态同步
    const isChecked =
      controlledChecked !== undefined ? controlledChecked : checkedState;

    // 处理点击事件
    const handleClick = useCallback(() => {
      if (disabled) return;

      const newChecked = !isChecked;
      setCheckedState(newChecked);
      onCheckedChange?.(newChecked);
    }, [isChecked, disabled, onCheckedChange]);

    // 处理键盘事件
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;

        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          handleClick();
        }
      },
      [disabled, handleClick]
    );

    // 确定当前状态
    const getState = () => {
      if (indeterminate) return "indeterminate";
      return isChecked ? "checked" : "unchecked";
    };

    return (
      <div className="flex items-center">
        <div
          ref={ref}
          role="checkbox"
          aria-checked={indeterminate ? "mixed" : isChecked}
          aria-required={required}
          data-state={getState()}
          data-disabled={disabled ? "" : undefined}
          tabIndex={disabled ? undefined : 0}
          className={cn(
            "relative flex items-center cursor-pointer justify-center w-4 h-4 rounded border-2 hover:border-blue-500 border-[#CCCCCC] transition-colors text-white duration-300",
            {
              "opacity-50 cursor-not-allowed": disabled,
              "bg-blue-500 border-blue-500": isChecked,
            },
            className
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {/* 选中状态的SVG图标 */}
          {isChecked && !indeterminate && (
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="stroke-current absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5"
            >
              <polyline
                points="7,11.98 10.75,15.43 17,9"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.29"
              ></polyline>
            </svg>
          )}

          {/* 半选状态的SVG图标 */}
          {indeterminate && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 bg-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}

          {/* 隐藏的原生复选框，用于表单提交 */}
          {name && (
            <input
              type="checkbox"
              name={name}
              value={value}
              checked={isChecked}
              onChange={() => {}}
              disabled={disabled}
              required={required}
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
        </div>
        {label && (
          <label
            onClick={disabled ? undefined : handleClick}
            className={cn(
              "ml-2 text-sm cursor-pointer select-none",
              {
                "opacity-50 cursor-not-allowed": disabled,
              },
              labelClassName
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
export type { CheckboxProps };
