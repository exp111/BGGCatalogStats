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
  id: number; // id of the play
  playDate: string; // date of the play
  gameId: number; // id of the game
  locationId: number; // id of the location of the play
  length: number; // play time in minutes
  notes: string;
  noInStats: number; // if the play shouldnt be shown in stats
}

export interface BGGCatalogPlayerPlayEntry {
  id: number;
  playId: number; // the id of the play
  playerId: number; // the id of the player
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
  selectedGames: string; // list of game ids, seperated by commas
}

export interface BGGCatalogCustomDataEntry {
  id: number;
  fieldId: number;
  value: string;
  entityId: number; // the id of the entity, either the play id or the game id
  playerId?: number; // the id of the player play entry, NOT THE PLAYER ID
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
