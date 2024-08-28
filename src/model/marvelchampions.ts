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
  Aggression = 7,
  Justice,
  Leadership,
  Protection,
  Deadpool
}

export enum Scenarios {
  Rhino = 12,
  Klaw,
  Ultron
}

export enum Modulars {
  BombThreat = 15,
  MastersOfEvil,
  UnderAttack,
  DoomsdayChair,
  LegionsOfHydra
}

export enum Difficulty {
  Standard = 20,
  Expert
}

function AspectsString(...args: Aspects[]) {
  return args.map(a => Aspects[a]);
}

function HeroesString(...args: Heroes[]) {
  return args.map(a => Heroes[a]);
}

function ScenariosString(...args: Scenarios[]) {
  return args.map(a => Scenarios[a]);
}

function ModularsString(...args: Modulars[]) {
  return args.map(a => Modulars[a]);
}

function DifficultyString(...args: Difficulty[]) {
  return args.map(a => Difficulty[a]);
}

export const PackContent: ({ [key: string]: any[] }) = {
  "Marvel Champions: The Card Game": [
    ...AspectsString(Aspects.Aggression, Aspects.Justice, Aspects.Leadership, Aspects.Protection),
    ...HeroesString(Heroes.SpiderMan, Heroes.SheHulk, Heroes.BlackPanther, Heroes.IronMan, Heroes.CaptainMarvel),
    ...ScenariosString(Scenarios.Rhino, Scenarios.Klaw, Scenarios.Ultron),
    ...ModularsString(Modulars.BombThreat, Modulars.MastersOfEvil, Modulars.UnderAttack, Modulars.DoomsdayChair, Modulars.LegionsOfHydra),
    ...DifficultyString(Difficulty.Standard, Difficulty.Expert)
  ],
  "Marvel Champions: The Card Game \u2013 Deadpool Hero Pack": [
    ...AspectsString(Aspects.Deadpool), ...HeroesString(Heroes.Deadpool)
  ]
}

export interface MarvelChampionsPlayer {
  Name: string;
  IsMe: boolean;
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
  Plays: MarvelChampionsPlay[];
  OwnedPacks: string[];
}
