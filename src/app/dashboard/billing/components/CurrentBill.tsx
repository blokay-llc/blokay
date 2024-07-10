export default function CurrentBill() {
  return (
    <div className="text-neutral-800 dark:text-white border border-neutral-200 bg-white dark:bg-transparent dark:border-neutral-800 rounded-lg py-5 px-5">
      <h2 className="font-bold text-xl mb-3">Current plan</h2>
      <p className="text-sm font-light text-neutral-500">
        You are currently on the
        <span className="text-neutral-200 font-bold ml-3">Free</span>
      </p>
    </div>
  );
}
