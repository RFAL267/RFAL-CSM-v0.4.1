// utils.js



export function splitByFirstPipe(text) {
  if (typeof text !== "string") return ["", ""];

  const index = text.indexOf("|");
  if (index === -1) return [text, ""]; // если '|' нет, возвращаем исходную строку и пустую

  const left = text.slice(0, index).trim();
  const right = text.slice(index + 1).trim();

  return [left, right];
}
