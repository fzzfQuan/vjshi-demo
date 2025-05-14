"use client";

export default function CardIcon() {
  return (
    <button className="relative group w-[3.25rem] h-[3.25rem] rounded-full flex items-center justify-center shadow-[0px_4px_10px_0px_rgba(0,0,0,0.3)] cursor-pointer p-px bg-white">
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

      <div className="absolute p-1 text-xs right-0 top-1 bg-[#0071E3] rounded-full text-white">
        99
      </div>
    </button>
  );
}
