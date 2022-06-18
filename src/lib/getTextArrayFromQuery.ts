export function getTextArrayFromQuery(query: string): string[] {
  return Array.from(document.querySelectorAll(query), function (el) {
    if (el.textContent) return el.textContent;
  }).filter(txt => txt !== null && txt !== undefined);
}