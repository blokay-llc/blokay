export default function CurrentBill() {
  return (
    <div className="border border-neutral-800 rounded-lg py-5 px-5">
      <h2 className="font-bold text-xl mb-3">Current plan</h2>
      <p className="text-sm font-light text-neutral-500">
        You are currently on the{" "}
        <span className="text-neutral-200 font-bold">Free</span>
      </p>
    </div>
  );
}
