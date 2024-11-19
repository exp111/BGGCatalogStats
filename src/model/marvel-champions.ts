import {BaseGamePlay, BaseGamePlayer, BaseGameStats} from "./base-game-stats";

export const MC_GAME_ID = 285774;

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
  Venom,
  Mysterio,
  SinisterSix,
  VenomGoblin,
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
  Deathstrike,
  CityInChaos,
  DownToEarth,
  GoblinGear,
  GuerrillaTactics,
  OsbornTech,
  PersonalNightmare,
  SinisterAssault,
  SymbioticStrength,
  WhispersOfParanoia,
  END
}

export enum Difficulty {
  Standard = Modular.END,
  Expert,
  END
}

export const PackContent: Record<number, number[]> = {
  [MC_GAME_ID]: [
    Aspect.Aggression, Aspect.Justice, Aspect.Leadership, Aspect.Protection,
    Hero.SpiderMan, Hero.SheHulk, Hero.BlackPanther, Hero.IronMan, Hero.CaptainMarvel,
    Scenario.Rhino, Scenario.Klaw, Scenario.Ultron,
    Modular.BombThreat, Modular.MastersOfEvil, Modular.UnderAttack, Modular.DoomsdayChair, Modular.LegionsOfHydra,
    Difficulty.Standard, Difficulty.Expert
  ],
  [398039]: [
    Aspect.Deadpool, Hero.Deadpool
  ],
  [300878]: [
    Hero.DoctorStrange,
    //TODO: modular?
  ],
  [369039]: [
    Hero.Wolverine,
    Modular.Deathstrike
  ],
  [306430]: [
    Hero.Hawkeye, Hero.SpiderWoman,
    Scenario.Crossbones, Scenario.AbsorbingMan, Scenario.TaskMaster, Scenario.Zola, Scenario.RedSkull,
    Modular.HydraAssault, Modular.WeaponMaster, Modular.HydraPatrol, Modular.ExperimentalWeapons
  ],
  [347813]: [
    Hero.GhostSpider, Hero.MilesMorales,
    Scenario.Sandman, Scenario.Venom, Scenario.Mysterio, Scenario.SinisterSix, Scenario.VenomGoblin,
    Modular.CityInChaos, Modular.DownToEarth, Modular.GoblinGear, Modular.GuerrillaTactics, Modular.OsbornTech,
    Modular.PersonalNightmare, Modular.SinisterAssault, Modular.SymbioticStrength, Modular.WhispersOfParanoia,
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
