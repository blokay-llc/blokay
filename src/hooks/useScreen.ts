export function useScreen() {
  const factor = 3.5;
  const sidebar = 300;
  let rowHeight = Math.floor((window.innerWidth - sidebar) / (24 * factor));
  return { rowHeight };
}
