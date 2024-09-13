import {BaseGamePlay, BaseGamePlayer, BaseGameStats} from "./base-game-stats";
import {enumValuesToStrings} from "../app/enum-utils";

export const MC_GAME_NAME = "Marvel Champions: The Card Game";

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
  MilesMorales,
  END
}

export enum Aspects {
  Aggression = Heroes.END,
  Justice,
  Leadership,
  Protection,
  Deadpool,
  END
}

export enum Scenarios {
  Rhino = Aspects.END,
  Klaw,
  Ultron,
  TaskMaster,
  RedSkull,
  Venom,
  END
}

export enum Modulars {
  BombThreat = Scenarios.END,
  MastersOfEvil,
  UnderAttack,
  DoomsdayChair,
  LegionsOfHydra,
  END
}

export enum Difficulty {
  Standard = Modulars.END,
  Expert,
  END
}

export const PackContent: ({ [key: string]: any[] }) = {
  "Marvel Champions: The Card Game": [
    ...enumValuesToStrings(Aspects, Aspects.Aggression, Aspects.Justice, Aspects.Leadership, Aspects.Protection),
    ...enumValuesToStrings(Heroes, Heroes.SpiderMan, Heroes.SheHulk, Heroes.BlackPanther, Heroes.IronMan, Heroes.CaptainMarvel),
    ...enumValuesToStrings(Scenarios, Scenarios.Rhino, Scenarios.Klaw, Scenarios.Ultron),
    ...enumValuesToStrings(Modulars, Modulars.BombThreat, Modulars.MastersOfEvil, Modulars.UnderAttack, Modulars.DoomsdayChair, Modulars.LegionsOfHydra),
    ...enumValuesToStrings(Difficulty, Difficulty.Standard, Difficulty.Expert)
  ],
  "Marvel Champions: The Card Game \u2013 Deadpool Hero Pack": [
    ...enumValuesToStrings(Aspects, Aspects.Deadpool), ...enumValuesToStrings(Heroes, Heroes.Deadpool)
  ],
  "Marvel Champions: The Card Game \u2013 Doctor Strange Hero Pack": [
    ...enumValuesToStrings(Heroes, Heroes.DoctorStrange),
    //TODO: modular?
  ],
  "Marvel Champions: The Card Game \u2013 The Rise of Red Skull": [
    ...enumValuesToStrings(Heroes, Heroes.Hawkeye, Heroes.SpiderWoman),
    ...enumValuesToStrings(Scenarios, Scenarios.TaskMaster, Scenarios.RedSkull)
    //TODO: remaining
  ],
  "Marvel Champions: The Card Game \u2013 Sinister Motives": [
    ...enumValuesToStrings(Heroes, Heroes.GhostSpider, Heroes.MilesMorales),
    ...enumValuesToStrings(Scenarios, Scenarios.Venom)
    //TODO: remaining
  ]
}

export interface MarvelChampionsPlayer extends BaseGamePlayer {
  Hero: Heroes;
  Aspect: Aspects; //TODO: support multiple aspects?
}

export interface MarvelChampionsPlay extends BaseGamePlay {
  Players: MarvelChampionsPlayer[];
  Scenario: Scenarios;
  Modular: Modulars; //TODO: support multiple modulars
  Difficulty: Difficulty;
}

export interface MarvelChampionsStats extends BaseGameStats {
  Plays: MarvelChampionsPlay[];
  OwnedPacks: string[];
}
