export interface GameEntry {
  id: number;
  name: string;
  minPlayTime: number;
  maxPlayTime: number;
}

export interface PlayerEntry {
  id: number;
  name: string;
  me: number;
  isAnonymous: number;
  isAutoma: number;
}

export interface LocationEntry {
  id: number;
  name: string;
}

export interface PlayEntry {
  id: number;
  playDate: string;
  gameId: number;
  locationId: number;
  length: number;
}

export interface PlayerPlayEntry {
  id: number;
  playId: number; // the id of the play
  playerId: number; // the id of the player
  score: number;
}

export enum CustomFieldTypes {
  STRING = 0,
  LIST_OF_VALUES = 5
}

export enum CustomFieldEntity {
  GAME = 1,
  PLAYER = 2
}

export interface CustomFieldEntry {
  id: number;
  name: string;
  fieldType: CustomFieldTypes;
  entity: CustomFieldEntity;
  selectedGames: string; // list of game ids, seperated by commas
}

export interface CustomDataEntry {
  id: number;
  fieldId: number;
  value: string;
  entityId: number; // the id of the entity, either the play id or the game id
  playerId?: number; // the id of the player play entry, NOT THE PLAYER ID
}

export interface BGGCollectionBackup {
  games: GameEntry[];
  players: PlayerEntry[];
  locations: LocationEntry[];
  plays: PlayEntry[];
  playersPlays: PlayerPlayEntry[];
  customFields: CustomFieldEntry[];
  customData: CustomDataEntry[];
}
