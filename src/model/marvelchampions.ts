export enum Heroes {
  SpiderMan,
  SheHulk,
  BlackPanther,
  IronMan,
  CaptainMarvel,
  Deadpool,
  DoctorStrange,
  Hawkeye,
  SpiderWoman,
  GhostSpider,
  MilesMorales
}

export enum Aspects {
  Aggression = 11,
  Justice,
  Leadership,
  Protection,
  Deadpool,
}

export enum Scenarios {
  Rhino = 16,
  Klaw,
  Ultron,
  TaskMaster,
  RedSkull,
  Venom
}

export enum Modulars {
  BombThreat = 22,
  MastersOfEvil,
  UnderAttack,
  DoomsdayChair,
  LegionsOfHydra
}

export enum Difficulty {
  Standard = 27,
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
  ],
  "Marvel Champions: The Card Game \u2013 Doctor Strange Hero Pack": [
    ...HeroesString(Heroes.DoctorStrange),
    //TODO: modular?
  ],
  "Marvel Champions: The Card Game \u2013 The Rise of Red Skull": [
    ...HeroesString(Heroes.Hawkeye, Heroes.SpiderWoman),
    ...ScenariosString(Scenarios.TaskMaster, Scenarios.RedSkull)
    //TODO: remaining
  ],
  "Marvel Champions: The Card Game \u2013 Sinister Motives": [
    ...HeroesString(Heroes.GhostSpider, Heroes.MilesMorales),
    ...ScenariosString(Scenarios.Venom)
    //TODO: remaining
  ]
}

export interface MarvelChampionsPlayer {
  Name: string;
  IsMe: boolean;
  Hero: Heroes;
  Aspect: Aspects; //TODO: support multiple aspects?
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
