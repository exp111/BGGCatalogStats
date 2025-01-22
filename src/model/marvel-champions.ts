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
  AdamWarlock,
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
  Standard2,
  Standard3,
  Expert,
  Expert2,
  Expert3,
  END
}

export enum Packs {
  Core = MC_GAME_ID,
  // Heroes
  Deadpool = 398039,
  DoctorStrange = 300878,
  Wolverine = 369039,
  ScarletWitch = 316695,
  CaptainAmerica = 289222,
  BlackWidow = 299049,
  // Expansions
  RiseOfTheRedSkull = 306430,
  GalaxysMostWanted = 315896,
  MadTitansShadow = 339711,
  SinisterMotives = 347813,
  MutantGenesis = 363709,
  NextEvolution = 383818,
  AgeOfApocalypse = 405724,
  // Scenario Packs
  GreenGoblin = 288794,
  WreckingCrew = 294306,
  Hood = 343017,
  MojoMania = 368736,
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
  // Heroes
  [Packs.Deadpool]: [Aspect.Pool, Hero.Deadpool],
  [Packs.DoctorStrange]: [Hero.DoctorStrange],
  [Packs.Wolverine]: [Hero.Wolverine, Modular.Deathstrike],
  [Packs.ScarletWitch]: [Hero.ScarletWitch],
  [Packs.CaptainAmerica]: [Hero.CaptainAmerica],
  [Packs.BlackWidow]: [Hero.BlackWidow], //TODO: bw modular?
  // Expansions
  [Packs.RiseOfTheRedSkull]: [
    Hero.Hawkeye, Hero.SpiderWoman,
    Scenario.Crossbones, Scenario.AbsorbingMan, Scenario.TaskMaster, Scenario.Zola, Scenario.RedSkull,
    Modular.HydraAssault, Modular.WeaponMaster, Modular.HydraPatrol, Modular.ExperimentalWeapons
  ],
  [Packs.GalaxysMostWanted]: [
    Hero.Groot, Hero.RocketRaccoon,
    //TODO: scenarios + modulars
  ],
  [Packs.MadTitansShadow]: [
    Hero.Spectrum, Hero.AdamWarlock,
    //TODO: scenarios + modulars
  ],
  [Packs.SinisterMotives]: [
    Hero.GhostSpider, Hero.MilesMorales,
    Scenario.Sandman, Scenario.Venom, Scenario.Mysterio, Scenario.SinisterSix, Scenario.VenomGoblin,
    Modular.CityInChaos, Modular.DownToEarth, Modular.GoblinGear, Modular.GuerrillaTactics, Modular.OsbornTech,
    Modular.PersonalNightmare, Modular.SinisterAssault, Modular.SymbioticStrength, Modular.WhispersOfParanoia,
  ],
  [Packs.MutantGenesis]: [
    Hero.Shadowcat, Hero.Colossus,
    //TODO: scenarios + modulars
  ],
  [Packs.NextEvolution]: [
    Hero.Cable, Hero.Domino,
    //TODO: scenarios + modulars
  ],
  [Packs.AgeOfApocalypse]: [
    Hero.Bishop, Hero.Magik,
    //TODO: scenarios + modulars
    Difficulty.Standard3, Difficulty.Expert3
  ],
  // Scenario Packs
  [Packs.GreenGoblin]: [
    Scenario.RiskyBusiness, Scenario.MutagenFormula,
    Modular.GoblinGimmicks, Modular.AMessOfThings, Modular.PowerDrain, Modular.RunningInterference
  ],
  [Packs.WreckingCrew]: [
    //TODO: scenarios + modulars
  ],
  [Packs.Hood]: [
    //TODO: scenarios + modulars
    Difficulty.Standard2, Difficulty.Expert2
  ],
  [Packs.MojoMania]: [
    //TODO: scenarios + modulars
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
