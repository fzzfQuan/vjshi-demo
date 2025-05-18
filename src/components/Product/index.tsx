import { match } from "ts-pattern";
import Image from "next/image";
import Checkbox from "../ui/checkbox";
import { BaseItem, BusinessLine, CartSelectedItem } from "@/type";

interface Props {
  data: BaseItem & {
    id: number;
  };
  type?: BusinessLine;
  value: CartSelectedItem[];
  hasPurchased?: boolean;
  onChange: (value: CartSelectedItem[]) => void;
  onRemove?: (type: BusinessLine, id: number) => void;
}

export default function Product(props: Props) {
  const { value = [], onChange, data } = props;

  const itemId = data.id;

  const disabled = data.auditStatus === "FAIL";

  // 检查是否已选中
  const isSelected = value.some((item) => item.id === itemId);

  const onChangeCheckbox = () => {
    if (disabled) return;

    if (isSelected) {
      // 如果已选中，则从选中列表中移除
      onChange([...value.filter((item) => item.id !== itemId)]);
    } else {
      // 如果未选中，则添加到选中列表
      onChange([
        ...value,
        {
          id: itemId,
          title: data.title,
          type: props.type ?? "videos",
          price: data.price,
        },
      ]);
    }
  };

  return (
    <div
      className="flex space-x-4 p-5 cursor-pointer group/item hover:bg-[#F5F5F5] transition-background rounded-lg flex-shrink-0"
      onClick={onChangeCheckbox}
    >
      <div className="h-16 flex items-center">
        <Checkbox
          disabled={disabled}
          checked={isSelected}
          onCheckedChange={onChangeCheckbox}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden space-y-3">
        <div className="flex items-center">
          <div className="relative rounded overflow-hidden w-[117px] h-[66px]">
            <Image
              src={data?.coverImage}
              fill
              alt={data.title}
              className="object-cover object-center"
            />

            {disabled && (
              <div className="absolute w-full h-full inset-0 bg-[#0D0D0D]/50 text-white flex items-center justify-center">
                <span>已下架</span>
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 space-y-3 overflow-hidden ml-3">
            <div className="text-[#0D0D0D] truncate text-base font-medium">
              {data?.title}
            </div>
            <div className="w-full flex items-center space-x-3 text-sm">
              <span className="text-[#404040] truncate">ID：{itemId}</span>

              {props.type !== "music" && (
                <>
                  <hr
                    aria-orientation="vertical"
                    className="border-0 border-l border-current w-[1px] h-[12px] text-[#CCCCCC]"
                  />
                  <span className="text-[#404040] truncate">
                    类型：
                    {match(props.type)
                      .with("fotos", () => "图片素材")
                      .with("videos", () => "视频素材")
                      .otherwise(() => "未知")}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {props.hasPurchased && (
          <div className="text-[#404040] flex items-center text-sm space-x-1">
            <span>您已购买过此素材</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path
                d="M5.8 3.6L10.2 8L5.8 12.4L7.2 13.8L12.6 8L7.2 2.2L5.8 3.6Z"
                fillRule="evenodd"
              />
            </svg>
          </div>
        )}
        <div className="flex w-full justify-between items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              props.onRemove?.(props.type ?? "videos", itemId);
            }}
            className="appearance-none items-center justify-center select-none relative whitespace-nowrap transition duration-300 outline-none cursor-pointer disabled:cursor-not-allowed text-sm w-auto h-auto data-loading:text-transparent disabled:text-neutral-50 align-baseline border-0 text-[#0D0D0D]/80 hover:text-[#0D0D0D] hidden lg:block group-hover/item:block font-medium"
          >
            移除
          </button>
          <div className="flex items-center w-full justify-end">
            <div className="flex space-x-4 items-center text-sm">
              <div className="flex text-neutral-60 flex-1">
                {match(data.licType)
                  .with("LP", () => "个人授权")
                  .with("NP", () => "企业授权")
                  .with("LPPLUS", () => "企业PLUS")
                  .otherwise(() => null)}
              </div>
              <div className="flex items-center text-black flex-shrink-0 space-x-0.5">
                <span className="text-xl font-medium">{data?.price}</span>
                <span className="leading-none pt-[9px] pb-[7px]">元</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
