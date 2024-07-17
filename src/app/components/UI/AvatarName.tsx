const colors = [
  { bg: "bg-neutral-400", text: "text-white", color: "text-neutral-900" },
  { bg: "bg-neutral-400", text: "text-white", color: "text-neutral-900" },
  { bg: "bg-neutral-400", text: "text-white", color: "text-neutral-900" },
  { bg: "bg-neutral-400", text: "text-white", color: "text-neutral-900" },
  { bg: "bg-neutral-400", text: "text-white", color: "text-neutral-900" },
  { bg: "bg-neutral-400", text: "text-white", color: "text-neutral-900" },
  { bg: "bg-neutral-400", text: "text-white", color: "text-neutral-900" },
  { bg: "bg-neutral-400", text: "text-white", color: "text-neutral-900" },
  { bg: "bg-sky-600", text: "text-white" },
  { bg: "bg-lime-600", text: "text-white" },
  { bg: "bg-indigo-600", text: "text-white" },

  { bg: "bg-rose-600", text: "text-white" },
  { bg: "bg-teal-600", text: "text-white" },
  { bg: "bg-pink-600", text: "text-white" },
  { bg: "bg-amber-600", text: "text-white" },
  { bg: "bg-cyan-600", text: "text-white" },
];

type AvatarNameProps = {
  name: string;
  id?: string | number;
  colorIndex?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  image?: string | null;
};
export default function AvatarName({
  name,
  id,
  colorIndex = 0,
  size = "md",
  className = "",
  image = null,
}: AvatarNameProps) {
  const getShort = () => {
    let n = name || "";
    let short = n.split(" ");
    let n1 = short?.[0]?.[0] || "";
    let n2 = short?.[1]?.[0] || "";
    return n1 + n2;
  };

  const sizeClass = () => {
    if (size == "sm") return "size-8 text-xs";
    if (size == "md") return "size-10 text-sm";
    if (size == "lg") return "size-12 ";
    return "size-8 text-sm";
  };
  const index = colorIndex % colors.length;

  return (
    <div
      className={`group select-none relative ${sizeClass()} rounded-full flex items-center justify-center ${
        colors[index].bg
      } ${colors[index].text} ${className}`}
    >
      {image && (
        <img
          src={image}
          alt="avatar"
          className="rounded-full w-full h-full object-cover absolute top-0 left-0 z-10"
        />
      )}
      {!image && id && (
        <img
          src={`https://api.dicebear.com/7.x/micah/svg?seed=${id}&backgroundColor=dddddd`}
          alt="avatar"
          className="rounded-full w-full h-full object-cover absolute top-0 left-0 z-10 "
        />
      )}

      {getShort().toUpperCase()}
      <div className="group-hover:block absolute -bottom-7 left-0  w-26 text-center hidden  bg-neutral-900 text-neutral-100 rounded-sm py-1 px-2 text-xs z-20">
        <div className="truncate">{name}</div>
      </div>
    </div>
  );
}
