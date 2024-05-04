const colors = [
  { bg: "bg-rose-500", text: "text-rose-900" },
  { bg: "bg-yellow-500", text: "text-yellow-900" },
  { bg: "bg-indigo-500", text: "text-indigo-900" },
  { bg: "bg-lime-500", text: "text-lime-900" },
  { bg: "bg-pink-500", text: "text-pink-900" },
  { bg: "bg-amber-500", text: "text-amber-900" },
  { bg: "bg-cyan-500", text: "text-cyan-900" },
];

export default function AvatarName({ name, colorIndex = 0 }: any) {
  const getShort = () => {
    let n = name || "";
    let short = n.split(" ");
    let n1 = short?.[0]?.[0] || "";
    let n2 = short?.[1]?.[0] || "";
    return n1 + n2;
  };

  const index = colorIndex % colors.length;

  return (
    <div
      className={`group select-none text-sm relative size-8 rounded-full flex items-center justify-center ${colors[index].bg} ${colors[index].text}`}
    >
      {getShort().toUpperCase()}
      <div className="group-hover:block absolute -bottom-7 left-0  w-26 text-center hidden  bg-stone-900 text-stone-100 rounded-sm py-1 px-2 text-xs z-10">
        <div className="truncate">{name}</div>
      </div>
    </div>
  );
}
