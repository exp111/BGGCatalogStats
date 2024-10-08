import {BaseGamePlay, BaseGamePlayer, BaseGameStats} from "./base-game-stats";

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

export const PackContent: ({ [key: string]: number[] }) = {
  "Marvel Champions: The Card Game": [
    Aspect.Aggression, Aspect.Justice, Aspect.Leadership, Aspect.Protection,
    Hero.SpiderMan, Hero.SheHulk, Hero.BlackPanther, Hero.IronMan, Hero.CaptainMarvel,
    Scenario.Rhino, Scenario.Klaw, Scenario.Ultron,
    Modular.BombThreat, Modular.MastersOfEvil, Modular.UnderAttack, Modular.DoomsdayChair, Modular.LegionsOfHydra,
    Difficulty.Standard, Difficulty.Expert
  ],
  "Marvel Champions: The Card Game \u2013 Deadpool Hero Pack": [
    Aspect.Deadpool, Hero.Deadpool
  ],
  "Marvel Champions: The Card Game \u2013 Doctor Strange Hero Pack": [
    Hero.DoctorStrange,
    //TODO: modular?
  ],
  "Marvel Champions: The Card Game \u2013 Wolverine Hero Pack": [
    Hero.Wolverine,
    //TODO: modular?
  ],
  "Marvel Champions: The Card Game \u2013 The Rise of Red Skull": [
    Hero.Hawkeye, Hero.SpiderWoman,
    Scenario.Crossbones, Scenario.AbsorbingMan, Scenario.TaskMaster, Scenario.Zola, Scenario.RedSkull,
    Modular.HydraAssault, Modular.WeaponMaster, Modular.HydraPatrol, Modular.ExperimentalWeapons
  ],
  "Marvel Champions: The Card Game \u2013 Sinister Motives": [
    Hero.GhostSpider, Hero.MilesMorales,
    Scenario.Sandman, Scenario.DoctorOctopus, Scenario.Venom, Scenario.Mysterio
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
