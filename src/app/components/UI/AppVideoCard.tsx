export default function AppVideoCard({
  duration,
  title,
  subtitle,
  preview,
  name,
}: any) {
  return (
    <div
      className="px-5 group  transition lg:w-2/3 rounded-xl py-5 flex justify-between gap-5 items-center text-indigo-900 cursor-pointer select-none"
      style={{
        backgroundImage: " linear-gradient(45deg, #f4def6, #d7ecf8)",
      }}
    >
      <div>
        <div className="text-2xl font-bold">{title}</div>
        <div className="font-light">{subtitle}</div>
      </div>
      <div className="shadow-lg bg-white group-hover:bg-indigo-100 px-3 py-2 rounded-xl border-black/10 border flex gap-10 items-center">
        <div className="text-sm">
          <div>{name}</div>
          <div className="text-indigo-600">{duration}</div>
        </div>

        <div>
          <img src={preview} className="size-16" />
        </div>
      </div>
    </div>
  );
}
