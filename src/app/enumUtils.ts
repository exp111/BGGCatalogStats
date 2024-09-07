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
