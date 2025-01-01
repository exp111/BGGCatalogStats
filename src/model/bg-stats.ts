type Date = string; // ISO 8601 string "YYYY-MM-DD hh:mm:ss"
type UUID = string;

export interface BGStatsLocationEntry {
  id: number;
  modificationDate: Date;
  name: string;
  uuid: string;
}

export interface BGStatsGameEntry {
  id: number;
  bggId: number;
  bggName: string;
  bggYear: number;
  cooperative: boolean;
  copies: [];
  designers: string;
  highestWins: boolean;
  uuid: UUID;
}

export interface BGStatsPlayerEntry {
  id: number;
  bggUsername: string;
  isAnonymous: boolean;
  metaData: string;
  modificationDate: Date;
  name: string;
  uuid: UUID;
}

export interface BGStatsPlayerScoreEntry {
  newPlayer: boolean; // is it the first play for the player
  playerRefId: number; // id of the player
  rank: number; // 0?
  role?: string; // custom role, seperated by " / "
  score: string; // score achieved, as string
  seatOrder: number; // 0?
  startPlayer: boolean; // has the player started? default false
  team?: string; // same as role?
  winner: boolean; // has the player won
}

export interface BGStatsPlayEntry {
  gameRefId: number; // id of the game
  locationRefId: number; // id of the location
  bggId: number; // 0?
  board: string;
  durationMin: number;
  entryDate: Date;
  playDate: Date;
  playDateYmd: number; // play date as number YYYYMMDD
  expansionPlays: [];
  ignored: boolean;
  importPlayId: number; // 0?
  nemestatsId: number; // 0?
  manualWinner: boolean;
  modificationDate: Date;
  playerScores: BGStatsPlayerScoreEntry[];
  playImages: string; // "[]"?
  rating: number; // 0?
  rounds: number; // 0?
  scoringSetting: number; //TODO:?
  usesTeams: boolean;
  uuid: UUID;
}

export interface BGStatsUserInfo {
  meRefId: number; // id of the user thats "me"
}

export interface BGStatsBackup {
  challenges: [];
  deletedObjects: [];
  games: BGStatsGameEntry[];
  groups: [];
  locations: BGStatsLocationEntry[];
  players: BGStatsPlayerEntry[];
  plays: BGStatsPlayEntry[];
  tags: [];
  userInfo: BGStatsUserInfo;
}

export interface BGStatsExport {
  about: string;
  games: BGStatsGameEntry[];
  locations: BGStatsLocationEntry[];
  players: BGStatsPlayerEntry[];
  plays: BGStatsPlayEntry[];
  userInfo: BGStatsUserInfo;
}
