export enum StatTool {
  BG_STATS = "bgstats",
  BGG_CATALOG = "bggcatalog",
}

export interface StatData {
  selectedTool: StatTool;
  data: object;
}
