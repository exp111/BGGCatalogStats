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
  Pool,
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
  RiskyBusiness,
  MutagenFormula,
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
  GoblinGimmicks,
  AMessOfThings,
  PowerDrain,
  RunningInterference,
  END
}

export enum Difficulty {
  Standard = Modular.END,
  Expert,
  END
}

export enum Packs {
  Core = MC_GAME_ID,
  Deadpool = 398039,
  DoctorStrange = 300878,
  Wolverine = 369039,
  RiseOfTheRedSkull = 306430,
  SinisterMotives = 347813,
  GreenGoblin = 288794,
  ScarletWitch = 316695,
  CaptainAmerica = 289222,
  BlackWidow = 299049,
  END
}

export const PackContent: Record<number, number[]> = {
  [Packs.Core]: [
    Aspect.Aggression, Aspect.Justice, Aspect.Leadership, Aspect.Protection,
    Hero.SpiderMan, Hero.SheHulk, Hero.BlackPanther, Hero.IronMan, Hero.CaptainMarvel,
    Scenario.Rhino, Scenario.Klaw, Scenario.Ultron,
    Modular.BombThreat, Modular.MastersOfEvil, Modular.UnderAttack, Modular.DoomsdayChair, Modular.LegionsOfHydra,
    Difficulty.Standard, Difficulty.Expert
  ],
  [Packs.Deadpool]: [Aspect.Pool, Hero.Deadpool],
  [Packs.DoctorStrange]: [Hero.DoctorStrange],
  [Packs.Wolverine]: [Hero.Wolverine, Modular.Deathstrike],
  [Packs.RiseOfTheRedSkull]: [
    Hero.Hawkeye, Hero.SpiderWoman,
    Scenario.Crossbones, Scenario.AbsorbingMan, Scenario.TaskMaster, Scenario.Zola, Scenario.RedSkull,
    Modular.HydraAssault, Modular.WeaponMaster, Modular.HydraPatrol, Modular.ExperimentalWeapons
  ],
  [Packs.SinisterMotives]: [
    Hero.GhostSpider, Hero.MilesMorales,
    Scenario.Sandman, Scenario.Venom, Scenario.Mysterio, Scenario.SinisterSix, Scenario.VenomGoblin,
    Modular.CityInChaos, Modular.DownToEarth, Modular.GoblinGear, Modular.GuerrillaTactics, Modular.OsbornTech,
    Modular.PersonalNightmare, Modular.SinisterAssault, Modular.SymbioticStrength, Modular.WhispersOfParanoia,
  ],
  // Green Goblin
  [Packs.GreenGoblin]: [
    Scenario.RiskyBusiness, Scenario.MutagenFormula,
    Modular.GoblinGimmicks, Modular.AMessOfThings, Modular.PowerDrain, Modular.RunningInterference
  ],
  [Packs.ScarletWitch]: [Hero.ScarletWitch],
  [Packs.CaptainAmerica]: [Hero.CaptainAmerica], //TODO: cap modular?
  [Packs.BlackWidow]: [Hero.BlackWidow] //TODO: bw modular?
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
