export interface BGGCatalogGameEntry {
  id: number;
  bggId: number;
  name: string;
  yearPublished: number;
  minPlayTime: number;
  maxPlayTime: number;
  addedDate: string;
}

export interface BGGCatalogPlayerEntry {
  id: number;
  name: string;
  me: number;
  isAnonymous: number;
  isAutoma: number;
  bggUsername: string;
}

export interface BGGCatalogLocationEntry {
  id: number;
  name: string;
}

export interface BGGCatalogPlayEntry {
  // id of the play
  id: number;
  // date of the play
  playDate: string;
  // id of the game
  gameId: number;
  // id of the location of the play
  locationId: number;
  // play time in minutes
  length: number;
  notes: string;
  // if the play shouldnt be shown in stats
  noInStats: number;
}

export interface BGGCatalogPlayerPlayEntry {
  id: number;
  // the id of the play
  playId: number;
  // the id of the player
  playerId: number;
  score: number;
  winner: number;
  team: number;
  startPlayer: number;
  seatOrder: number;
}

export enum CustomFieldTypes {
  STRING = 0,
  LIST_OF_VALUES = 5
}

export enum CustomFieldEntity {
  GAME = 1,
  PLAYER = 2
}

export interface BGGCatalogCustomFieldEntry {
  id: number;
  name: string;
  fieldType: CustomFieldTypes;
  entity: CustomFieldEntity;
  // list of game ids, seperated by commas
  selectedGames: string;
}

export interface BGGCatalogCustomDataEntry {
  id: number;
  fieldId: number;
  value: string;
  // the id of the entity, either the play id or the game id
  entityId: number;
  // the id of the player play entry, NOT THE PLAYER ID
  playerId?: number;
}

export interface BGGCatalogBackup {
  games: BGGCatalogGameEntry[];
  players: BGGCatalogPlayerEntry[];
  locations: BGGCatalogLocationEntry[];
  plays: BGGCatalogPlayEntry[];
  playersPlays: BGGCatalogPlayerPlayEntry[];
  customFields: BGGCatalogCustomFieldEntry[];
  customData: BGGCatalogCustomDataEntry[];
}
