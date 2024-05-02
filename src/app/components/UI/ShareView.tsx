import AvatarName from "./AvatarName";
export default function ShareView({ SharedUsers }: any) {
  return (
    <>
      <div className="flex flex-col gap-0 divide-y divide-stone-300">
        {SharedUsers.map((user: any, index: any) => (
          <div className="flex gap-3 items-center py-2" key={user.id}>
            <AvatarName name={user.name} colorIndex={index} />
            <div className="font-light text-sm">{user.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
