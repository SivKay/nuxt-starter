export function formatDateTime(date: string | Date) {
  if (!date) {
    return null;
  }

  const value = new Date(date);

  const year = value.getFullYear();
  const month = (value.getMonth() + 1).toString().padStart(2, "0");
  const day = value.getDate().toString().padStart(2, "0");
  const hour = value.getHours().toString().padStart(2, "0");
  const minute = value.getMinutes().toString().padStart(2, "0");
  const second = value.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function getPaginationRowNumber(
  rowIndex: number,
  page: number,
  limit: number,
) {
  return (Math.max(page, 1) - 1) * limit + rowIndex + 1;
}

export function enumToCamelCase(value: string) {
  const [firstWord = "", ...remainingWords] = value
    .trim()
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .split(/[_\-\s]+/)
    .filter(Boolean);

  return [
    firstWord,
    ...remainingWords.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    ),
  ].join("");
}
