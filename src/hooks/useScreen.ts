export function useScreen() {
  const factor = 10;
  const sidebar = 300;
  if (typeof window === "undefined") return { rowHeight: 0 };
  let rowHeight = Math.floor((window.innerWidth - sidebar) / (24 * factor));
  return { rowHeight };
}
