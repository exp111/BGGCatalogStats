import {BaseGamePlay, BaseGamePlayer, BaseGameStats} from "./base-game-stats";
import {enumValuesToStrings} from "../app/enum-utils";

export const MC_GAME_NAME = "Marvel Champions: The Card Game";

export enum Hero {
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
  Wolverine,
  Thor,
  CaptainAmerica,
  BlackWidow,
  MsMarvel,
  Hulk,
  AntMan,
  ScarletWitch,
  Venom,
  Quicksilver,
  Wasp,
  StarLord,
  Iceman,
  Gamora,
  Drax,
  Nebula,
  Vision,
  WarMachine,
  SPdr,
  SpiderHam,
  Gambit,
  IronHeart,
  Valkyrie,
  Cyclops,
  Nova,
  Phoenix,
  Storm,
  Rogue,
  Psylocke,
  X23,
  Angel,
  Jubilee,
  Magneto,
  Nightcrawler,
  Cable,
  Domino,
  Colossus,
  Shadowcat,
  Warlock,
  Spectrum,
  Bishop,
  Magik,
  RocketRaccoon,
  Groot,
  END
}

export enum Aspect {
  Aggression = Hero.END,
  Justice,
  Leadership,
  Protection,
  Deadpool,
  END
}

export enum Scenario {
  Rhino = Aspect.END,
  Klaw,
  Ultron,
  Crossbones,
  AbsorbingMan,
  TaskMaster,
  Zola,
  RedSkull,
  Sandman,
  DoctorOctopus,
  Venom,
  Mysterio,
  END
}

export enum Modular {
  BombThreat = Scenario.END,
  MastersOfEvil,
  UnderAttack,
  DoomsdayChair,
  LegionsOfHydra,
  HydraAssault,
  WeaponMaster,
  HydraPatrol,
  ExperimentalWeapons,
  END
}

export enum Difficulty {
  Standard = Modular.END,
  Expert,
  END
}

export const PackContent: ({ [key: string]: any[] }) = {
  "Marvel Champions: The Card Game": [
    ...enumValuesToStrings(Aspect, Aspect.Aggression, Aspect.Justice, Aspect.Leadership, Aspect.Protection),
    ...enumValuesToStrings(Hero, Hero.SpiderMan, Hero.SheHulk, Hero.BlackPanther, Hero.IronMan, Hero.CaptainMarvel),
    ...enumValuesToStrings(Scenario, Scenario.Rhino, Scenario.Klaw, Scenario.Ultron),
    ...enumValuesToStrings(Modular, Modular.BombThreat, Modular.MastersOfEvil, Modular.UnderAttack, Modular.DoomsdayChair, Modular.LegionsOfHydra),
    ...enumValuesToStrings(Difficulty, Difficulty.Standard, Difficulty.Expert)
  ],
  "Marvel Champions: The Card Game \u2013 Deadpool Hero Pack": [
    ...enumValuesToStrings(Aspect, Aspect.Deadpool), ...enumValuesToStrings(Hero, Hero.Deadpool)
  ],
  "Marvel Champions: The Card Game \u2013 Doctor Strange Hero Pack": [
    ...enumValuesToStrings(Hero, Hero.DoctorStrange),
    //TODO: modular?
  ],
  "Marvel Champions: The Card Game \u2013 Wolverine Hero Pack": [
    Hero.Wolverine,
    //TODO: modular?
  ],
  "Marvel Champions: The Card Game \u2013 The Rise of Red Skull": [
    ...enumValuesToStrings(Hero, Hero.Hawkeye, Hero.SpiderWoman),
    ...enumValuesToStrings(Scenario, Scenario.Crossbones, Scenario.AbsorbingMan, Scenario.TaskMaster, Scenario.Zola, Scenario.RedSkull),
    ...enumValuesToStrings(Modular, Modular.HydraAssault, Modular.WeaponMaster, Modular.HydraPatrol, Modular.ExperimentalWeapons)
  ],
  "Marvel Champions: The Card Game \u2013 Sinister Motives": [
    ...enumValuesToStrings(Hero, Hero.GhostSpider, Hero.MilesMorales),
    ...enumValuesToStrings(Scenario, Scenario.Sandman, Scenario.DoctorOctopus, Scenario.Venom, Scenario.Mysterio)
    //TODO: remaining
  ]
}

export interface MarvelChampionsPlayer extends BaseGamePlayer {
  Hero: Hero;
  Aspects: Aspect[];
}

export interface MarvelChampionsPlay extends BaseGamePlay {
  Players: MarvelChampionsPlayer[];
  Scenario: Scenario;
  Modulars: Modular[];
  Difficulty: Difficulty;
}

export interface MarvelChampionsStats extends BaseGameStats {
  Plays: MarvelChampionsPlay[];
}
