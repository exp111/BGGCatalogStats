// type of enums as i dont know what to use else
type Enums = any;

export function formatToEnumString(str: string) {
  return str
    .replaceAll(".", "")
    .replaceAll("-", " ")
    .replaceAll("/", "")
    .replaceAll(/\s(\w)/g, (c) => c[1].toUpperCase()) // convert to camel case
    .trim();
}

// Beautify enum string
export function formatFromEnumString(str: string) {
  return str
    .replaceAll(/([A-Z])/g, (c) => ` ${c}`) // convert camel case to spaces
    .trim();
}

export function enumToArray(e: Enums) {
  return Object.values(e).filter(v => Number.isNaN(Number(v))) as string[]; // only strings, ignoring indexes
}

// Gets the value of a number enum entry by the string key
export function getEnumValue(enums: Enums, str: string) {
  return enums[str as keyof typeof enums];
}

// Maps a list of enum values to their key strings
export function enumValuesToStrings(enums: Enums, ...args: number[]) {
  return args.map(a => enums[a]);
}
