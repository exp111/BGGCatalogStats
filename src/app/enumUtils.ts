export function formatToEnumString(str: string) {
  return str
    .replaceAll(".", "")
    .replaceAll("-", " ")
    .replaceAll(/\s(\w)/g, (c) => c[1].toUpperCase()) // convert to camel case
    .trim();
}

// Beautify enum string
export function formatFromEnumString(str: string) {
  return str
    .replaceAll(/([A-Z])/g, (c) => ` ${c}`) // convert camel case to spaces
    .trim();
}

export function enumToArray(e: any) {
  return Object.values(e).filter(v => Number.isNaN(Number(v))) as string[]; // only strings, ignoring indexes
}
