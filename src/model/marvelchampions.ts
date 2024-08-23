export enum Heroes {
  SpiderMan,
  SheHulk,
  BlackPanther,
  IronMan,
  CaptainMarvel,
  Deadpool,
  DoctorStrange
}

export enum Aspects {
  Aggression,
  Justice,
  Leadership,
  Protection,
  Deadpool
}

export enum Scenarios {
  Rhino,
  Klaw,
  Ultron
}

export enum Modulars {
  BombThreat,
  MastersOfEvil,
  UnderAttack,
  DoomsdayChair,
  LegionsOfHydra
}

export enum Difficulty {
  Standard,
  Expert
}

export interface MarvelChampionsPlayer {
  Name: string;
  Hero: Heroes;
  Aspect: Aspects;
}

export interface MarvelChampionsPlay {
  Id: number;
  Players: MarvelChampionsPlayer[];
  Scenario: Scenarios;
  Modular: Modulars; //TODO: support multiple modulars
  Difficulty: Difficulty;
  Time: number;
  Won: boolean;
}

export interface MarvelChampionsStats {
  plays: MarvelChampionsPlay[];
}
