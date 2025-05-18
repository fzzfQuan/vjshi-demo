"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import Product from "../Product";
import Checkbox from "../ui/checkbox";
import { Drawer } from "../ui/drawer";
import Empty from "../ui/empty";
import { Tabs } from "../ui/tabs";
import {
  getFotosList,
  getVideosList,
  getMusicList,
  calculateTotalPrice,
  deleteVideo,
  deleteFoto,
  deleteMusic,
  checkPurchasedVideo,
  checkPurchasedFoto,
  checkPurchasedMusic,
} from "@/api/cart";
import { useState, useEffect, useCallback, useMemo } from "react";
import { match } from "ts-pattern";
import {
  BaseItem,
  BusinessLine,
  CartSelectedItem,
  FotoItem,
  LicType,
  MusicItem,
  VideoItem,
} from "@/type";

export function CardIcon({ count = 0 }: { count?: number }) {
  return (
    <button className="relative group outline-none w-[3.25rem] h-[3.25rem] rounded-full flex items-center justify-center shadow-[0px_4px_10px_0px_rgba(0,0,0,0.3)] cursor-pointer p-px bg-white">
      <div className="flex w-full h-full items-center justify-center rounded-full group-hover:bg-neutral-50 transition-colors">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            d="M4.132 3.805q-.016-.07-.044-.137-.028-.066-.066-.126-.039-.06-.087-.114-.048-.054-.104-.098-.056-.045-.12-.08-.062-.034-.13-.058-.068-.023-.139-.035-.07-.012-.142-.012-.1 0-.196.023-.07.016-.136.044-.066.028-.126.066-.061.039-.114.087-.054.048-.098.104-.045.056-.08.12-.034.062-.058.13-.023.068-.035.138-.012.071-.012.143 0 .1.022.195l2.404 10.233q.204.87.906 1.426.7.556 1.595.556h9.25q.911 0 1.62-.575.707-.576.894-1.468l.997-4.765q.25-1.197-.52-2.146-.772-.95-1.995-.95H5.157q-.195 0-.37.085l-.655-2.786Zm1.036 4.411 1.368 5.82q.068.292.302.478.235.186.534.186h9.25q.304 0 .54-.193.238-.192.3-.49l.997-4.765q.084-.4-.174-.718-.258-.318-.667-.318H5.168Z"
            fillRule="evenodd"
            fill="currentColor"
          ></path>
          <circle cx="7.616" cy="18.676" fill="currentColor" r="1.286"></circle>
          <circle
            cx="16.386"
            cy="18.676"
            fill="currentColor"
            r="1.286"
          ></circle>
        </svg>
      </div>

      {count > 0 && (
        <div className="absolute py-0.5 px-1.5 text-xs right-0 top-1 bg-[#0071E3] rounded-full text-white">
          {count > 99 ? "99+" : count}
        </div>
      )}
    </button>
  );
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="7" y1="7" x2="17" y2="17"></line>
        <line x1="7" y1="17" x2="17" y2="7"></line>
      </g>
    </svg>
  );
}

export function CardForm({
  data,
  type,
  purchased,
}: {
  data: (BaseItem & {
    id: number;
  })[];
  type: BusinessLine;
  purchased: {
    id: number;
    licTypes: LicType[];
  }[];
}) {
  const [isAllSelected, setIsAllSelected] = useState(false);

  const queryClient = useQueryClient();

  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      selectedItems: [] as CartSelectedItem[],
    },
  });

  const selectedItems = watch("selectedItems");

  const { mutate: mutateVideo } = useMutation({
    mutationFn: deleteVideo,
    onMutate: async (deleteId) => {
      await queryClient.cancelQueries({ queryKey: ["cartVideos"] });

      const previousTodos = queryClient.getQueryData<VideoItem[]>([
        "cartFotos",
      ]);

      queryClient.setQueryData<VideoItem[]>(["cartVideos"], (oldTodos = []) =>
        oldTodos.filter((todo) => todo.vid !== deleteId)
      );

      return { previousTodos };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["cartVideos"], context?.previousTodos);
    },
  });

  const { mutate: mutateFoto } = useMutation({
    mutationFn: deleteFoto,
    onMutate: async (deleteId) => {
      await queryClient.cancelQueries({ queryKey: ["cartFotos"] });

      const previousTodos = queryClient.getQueryData<FotoItem[]>(["cartFotos"]);

      queryClient.setQueryData<FotoItem[]>(["cartFotos"], (oldTodos = []) =>
        oldTodos.filter((todo) => todo.fid !== deleteId)
      );

      return { previousTodos };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["cartFotos"], context?.previousTodos);
    },
  });

  const { mutate: mutateMusic } = useMutation({
    mutationFn: deleteMusic,
    onMutate: async (deleteId) => {
      await queryClient.cancelQueries({ queryKey: ["cartMusics"] });

      const previousTodos = queryClient.getQueryData<MusicItem[]>([
        "cartMusics",
      ]);

      queryClient.setQueryData<MusicItem[]>(["cartMusics"], (oldTodos = []) =>
        oldTodos.filter((todo) => todo.mid !== deleteId)
      );

      return { previousTodos };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["cartMusics"], context?.previousTodos);
    },
  });

  // 处理全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // 全选
      const allItems = data
        .filter((item) => item.auditStatus === "SUCCESS")
        .map((item) => {
          return {
            id: item.id,
            title: item.title,
            type: type,
            price: item.price,
          };
        });

      setValue("selectedItems", allItems);
    } else {
      setValue("selectedItems", []);
    }
  };

  const handleItemRemove = useCallback(
    (type: BusinessLine, id: number) => {
      match(type)
        .with("fotos", () => mutateFoto(id))
        .with("videos", () => mutateVideo(id))
        .with("music", () => mutateMusic(id))
        .otherwise(() => {});
    },
    [mutateFoto, mutateMusic, mutateVideo]
  );

  const totalPrice = useMemo(
    () => calculateTotalPrice(selectedItems),
    [selectedItems]
  );

  // 提交表单
  const onSubmit = (data: { selectedItems: CartSelectedItem[] }) => {
    const total = calculateTotalPrice(data.selectedItems);

    console.log(
      `提交订单: 业务线 - ${type}, id - ${data.selectedItems?.map(
        (i) => i.id
      )}, 总价 - ${total}`
    );
  };

  useEffect(() => {
    const validItems =
      data?.filter((item) => item.auditStatus === "SUCCESS") ?? [];

    setIsAllSelected(
      selectedItems.length === validItems.length && validItems.length > 0
    );
  }, [selectedItems, data]);

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="px-5 pt-5 flex flex-1 flex-col overflow-auto w-full">
        {data.length > 0 ? (
          data.map((item) => {
            // 判断是否已购买过该素材
            const hasPurchased = purchased.some(
              (purchased) =>
                purchased.id === item.id &&
                purchased.licTypes.includes(item.licType)
            );

            return (
              <Controller
                key={item.id}
                name="selectedItems"
                control={control}
                render={({ field }) => (
                  <Product
                    data={item}
                    type={type}
                    value={field.value}
                    hasPurchased={hasPurchased}
                    onRemove={handleItemRemove}
                    onChange={field.onChange}
                  />
                )}
              />
            );
          })
        ) : (
          <Empty title={`购物车${type === "fotos" ? "图片" : "视频"}为空`} />
        )}
      </div>
      <hr
        aria-orientation="horizontal"
        className="border-0 border-b w-full h-0 border-current text-[#F0F0F0]"
      />
      <div className="flex flex-col relative space-y-4 px-10 py-7 lg:px-5">
        <div className="flex relative justify-between">
          <div className="flex items-center">
            <Checkbox
              label="全选"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              disabled={data.length === 0}
            />
          </div>
          <div className="flex flex-1 justify-end space-x-3 items-center text-sm">
            <div className="flex space-x-1 text-neutral-60">
              <span>已选</span>
              <span>{selectedItems.length}</span>
              <span>件</span>
            </div>
            <div className="flex space-x-1 items-center">
              <span className="font-medium">总计：</span>
              <div className="flex space-x-1 items-center text-[#EE4A4A]">
                <span className="text-2xl font-medium">{totalPrice}</span>
                <span className="leading-none pt-2">元</span>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex appearance-none items-center justify-center select-none relative whitespace-nowrap align-middle transition duration-300 outline-none cursor-pointer disabled:cursor-not-allowed h-14 px-10 text-base font-medium lg:h-12 lg:px-8 text-white bg-black hover:bg-black-80 active:bg-black disabled:bg-neutral-400 rounded-full border-0"
          disabled={selectedItems.length === 0}
        >
          立即购买
        </button>
      </div>
    </form>
  );
}

export function CartContent() {
  // 获取视频数据
  const { data: videosData = [], isLoading: isVideosLoading } = useQuery({
    queryKey: ["cartVideos"],
    queryFn: getVideosList,
    select(data) {
      return data?.map((item) => ({
        ...item,
        id: item.vid,
      }));
    },
  });

  // 获取图片数据
  const { data: fotosData = [], isLoading: isFotosLoading } = useQuery({
    queryKey: ["cartFotos"],
    queryFn: getFotosList,
    select(data) {
      return data?.map((item) => ({
        ...item,
        id: item.fid,
      }));
    },
  });

  // 获取音乐数据
  const { data: musicData = [], isLoading: isMusicLoading } = useQuery({
    queryKey: ["cartMusics"],
    queryFn: getMusicList,
    select(data) {
      return data?.map((item) => ({
        ...item,
        id: item.mid,
      }));
    },
  });

  // 获取购买过的视频
  const { data: purchasedVideos } = useQuery({
    queryKey: ["purchasedVideos"],
    enabled: !!videosData.length,
    queryFn: () => {
      const ids = videosData.map((item) => item.vid);

      return checkPurchasedVideo(ids);
    },
    select(data) {
      return data?.map((item) => ({
        id: item.vid,
        licTypes: item.licTypes,
      }));
    },
  });

  // 获取购买过的图片
  const { data: purchasedFotos } = useQuery({
    queryKey: ["purchasedFotos"],
    enabled: fotosData.length > 0,
    queryFn: () => {
      const ids = fotosData.map((item) => item.fid);

      return checkPurchasedFoto(ids);
    },
    select(data) {
      return data.map((item) => ({
        id: item.fid,
        licTypes: item.licTypes,
      }));
    },
  });

  // 获取购买过的音乐
  const { data: purchasedMusic } = useQuery({
    queryKey: ["purchasedMusic"],
    enabled: musicData.length > 0,
    queryFn: () => {
      const ids = musicData.map((item) => item.mid);

      return checkPurchasedMusic(ids);
    },
    select(data) {
      return data.map((item) => ({
        id: item.mid,
        licTypes: item.licTypes,
      }));
    },
  });

  return (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">
          <span>视频</span>
          <span>{videosData.length || 0}</span>
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2">
          <span>图片</span>
          <span>{fotosData.length || 0}</span>
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3">
          <span>音乐</span>
          <span>{musicData.length || 0}</span>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="flex flex-col flex-1" value="tab1">
        {isVideosLoading ? (
          <div className="flex justify-center items-center h-full">
            加载中...
          </div>
        ) : (
          <CardForm
            data={videosData}
            type="videos"
            purchased={purchasedVideos ?? []}
          />
        )}
      </Tabs.Content>
      <Tabs.Content className="flex flex-col flex-1" value="tab2">
        {isFotosLoading ? (
          <div className="flex justify-center items-center h-full">
            加载中...
          </div>
        ) : (
          <CardForm
            data={fotosData}
            type="fotos"
            purchased={purchasedFotos ?? []}
          />
        )}
      </Tabs.Content>
      <Tabs.Content className="flex flex-col flex-1" value="tab3">
        {isMusicLoading ? (
          <div className="flex justify-center items-center h-full">
            加载中...
          </div>
        ) : (
          <CardForm
            data={musicData}
            type="music"
            purchased={purchasedMusic ?? []}
          />
        )}
      </Tabs.Content>
    </Tabs>
  );
}

export default function Cart() {
  // 获取视频和图片数据以显示购物车图标上的数量
  const { data: videosData = [], isFetched: isVideosFetched } = useQuery({
    queryKey: ["cartVideos"],
    queryFn: getVideosList,
  });

  const { data: fotosData = [], isFetched: isFotosFetched } = useQuery({
    queryKey: ["cartFotos"],
    queryFn: getFotosList,
  });

  const { data: musicData = [], isFetched: isMusicFetched } = useQuery({
    queryKey: ["cartMusics"],
    queryFn: getMusicList,
  });

  const isFetched = isVideosFetched && isFotosFetched && isMusicFetched; // 等待所有查询都完成后再渲染购物车

  // 计算购物车总数量
  const cartItemsCount =
    (videosData?.length || 0) +
    (fotosData?.length || 0) +
    (musicData?.length || 0);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Drawer.Root direction="right">
        <Drawer.Trigger>
          <CardIcon count={isFetched ? cartItemsCount : 0} />
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay />

          <Drawer.Content className="max-w-lg w-full flex flex-col">
            <header className="flex items-center justify-between text-black w-full font-medium text-2xl px-10 pt-9 pb-8">
              <span>购物车</span>

              <Drawer.Close>
                <CloseIcon />
              </Drawer.Close>
            </header>

            <div className="flex-1 flex flex-col">
              <CartContent />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
