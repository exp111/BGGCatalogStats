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
  Ironheart,
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
  MariaHill,
  NickFury,
  Shuri,
  Silk,
  Falcon,
  WinterSoldier,
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
  EbonyMaw,
  TowerDefense,
  Thanos,
  Hela,
  Loki,
  BrotherhoodOfBadoon,
  InfiltrateTheMuseum,
  EscapeTheMuseum,
  Nebula,
  RonanTheAccuser,
  Magog,
  Spiral,
  Mojo,
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
  BlackOrder,
  ArmiesOfTitan,
  ChildrenOfThanos,
  InfinityGauntlet,
  LegionsOfHel,
  FrostGiants,
  Enchantress,
  Exodus,
  Reavers,
  Arcade,
  CrazyGang,
  Hellfire,
  KreeFanatic,
  BandOfBadoon,
  GalacticArtifacts,
  KreeMilitants,
  MenagerieMedley,
  SpacePirates,
  ShipCommand,
  PowerStone,
  BadoonHeadhunter,
  Crime,
  Fantasy,
  Horror,
  SciFi,
  Sitcom,
  Western,
  Longshot,
  Armadillo,
  Zzzax,
  Inheritors,
  IronSpidersSinisterSix,
  ShadowKing,
  Sauron,
  END,
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

export enum Pack {
  Core = MC_GAME_ID,
  // Heroes
  Deadpool = 398039,
  DoctorStrange = 300878,
  Wolverine = 369039,
  ScarletWitch = 316695,
  CaptainAmerica = 289222,
  BlackWidow = 299049,
  MsMarvel = 291432,
  Thor = 295782,
  Hulk = 303708,
  AntMan = 315981,
  Quicksilver = 316694,
  Wasp = 316696,
  StarLord = 330615,
  Gamora = 333154,
  Drax = 333748,
  Venom = 335739,
  Nebula = 340900,
  WarMachine = 342671,
  Valkyrie = 345587,
  Vision = 347812,
  Nova = 356075,
  Ironheart = 357957,
  SpiderHam = 360060,
  SPdr = 361485,
  Cyclops = 365913,
  Phoenix = 366645,
  Storm = 370237,
  Gambit = 372718,
  Rogue = 374986,
  Psylocke = 386959,
  Angel = 388330,
  X23 = 391675,
  Iceman = 413236,
  Jubilee = 417417,
  Nightcrawler = 422976,
  Magneto = 426008,
  Shuri = 438671,
  Silk = 439508,
  Falcon = 446592,
  WinterSoldier = 446593,
  //TODO: new wave

  // Expansions
  RiseOfTheRedSkull = 306430,
  GalaxysMostWanted = 315896,
  MadTitansShadow = 339711,
  SinisterMotives = 347813,
  MutantGenesis = 363709,
  NextEvolution = 383818,
  AgeOfApocalypse = 405724,
  AgentsOfShield = 430260,
  // Scenario Packs
  GreenGoblin = 288794,
  WreckingCrew = 294306,
  Hood = 343017,
  MojoMania = 368736,
  Kang = 314028,
  // Misc
  KreeFanatic = 316224,
  END
}

export const PackContent: Record<number, number[]> = {
  [Pack.Core]: [
    Aspect.Aggression, Aspect.Justice, Aspect.Leadership, Aspect.Protection,
    Hero.SpiderMan, Hero.SheHulk, Hero.BlackPanther, Hero.IronMan, Hero.CaptainMarvel,
    Scenario.Rhino, Scenario.Klaw, Scenario.Ultron,
    Modular.BombThreat, Modular.MastersOfEvil, Modular.UnderAttack, Modular.DoomsdayChair, Modular.LegionsOfHydra,
    Difficulty.Standard, Difficulty.Expert
  ],
  // Heroes
  [Pack.Deadpool]: [Aspect.Pool, Hero.Deadpool],
  [Pack.DoctorStrange]: [Hero.DoctorStrange],
  [Pack.Wolverine]: [Hero.Wolverine, Modular.Deathstrike],
  [Pack.ScarletWitch]: [Hero.ScarletWitch],
  [Pack.CaptainAmerica]: [Hero.CaptainAmerica],
  [Pack.BlackWidow]: [Hero.BlackWidow],
  [Pack.MsMarvel]: [Hero.MsMarvel],
  [Pack.Thor]: [Hero.Thor],
  [Pack.Hulk]: [Hero.Hulk],
  [Pack.AntMan]: [Hero.AntMan],
  [Pack.Quicksilver]: [Hero.Quicksilver],
  [Pack.Wasp]: [Hero.Wasp],
  [Pack.StarLord]: [Hero.StarLord],
  [Pack.Gamora]: [Hero.Gamora],
  [Pack.Drax]: [Hero.Drax],
  [Pack.Venom]: [Hero.Venom],
  [Pack.Nebula]: [Hero.Nebula],
  [Pack.WarMachine]: [Hero.WarMachine],
  [Pack.Valkyrie]: [Hero.Valkyrie],
  [Pack.Vision]: [Hero.Vision],
  [Pack.Nova]: [Hero.Nova, Modular.Armadillo],
  [Pack.Ironheart]: [Hero.Ironheart, Modular.Zzzax],
  [Pack.SpiderHam]: [Hero.SpiderHam, Modular.Inheritors],
  [Pack.SPdr]: [Hero.SPdr, Modular.IronSpidersSinisterSix],
  [Pack.Cyclops]: [Hero.Cyclops],
  [Pack.Phoenix]: [Hero.Phoenix],
  [Pack.Storm]: [Hero.Storm, Modular.ShadowKing],
  [Pack.Gambit]: [Hero.Gambit, Modular.Exodus],
  [Pack.Rogue]: [Hero.Rogue, Modular.Reavers],
  [Pack.Psylocke]: [Hero.Psylocke],
  [Pack.Angel]: [Hero.Angel],
  [Pack.X23]: [Hero.X23],
  [Pack.Iceman]: [Hero.Iceman, Modular.Sauron],
  [Pack.Jubilee]: [Hero.Jubilee, Modular.Arcade],
  [Pack.Nightcrawler]: [Hero.Nightcrawler, Modular.CrazyGang],
  [Pack.Magneto]: [Hero.Magneto, Modular.Hellfire],
  [Pack.Shuri]: [Hero.Shuri],
  [Pack.Silk]: [Hero.Silk],
  [Pack.Falcon]: [Hero.Falcon],
  [Pack.WinterSoldier]: [Hero.WinterSoldier],
  // Expansions
  [Pack.RiseOfTheRedSkull]: [
    Hero.Hawkeye, Hero.SpiderWoman,
    Scenario.Crossbones, Scenario.AbsorbingMan, Scenario.TaskMaster, Scenario.Zola, Scenario.RedSkull,
    Modular.HydraAssault, Modular.WeaponMaster, Modular.HydraPatrol, Modular.ExperimentalWeapons
  ],
  [Pack.GalaxysMostWanted]: [
    Hero.Groot, Hero.RocketRaccoon,
    Scenario.BrotherhoodOfBadoon, Scenario.InfiltrateTheMuseum, Scenario.EscapeTheMuseum, Scenario.Nebula, Scenario.RonanTheAccuser,
    Modular.BandOfBadoon, Modular.GalacticArtifacts, Modular.KreeMilitants, Modular.MenagerieMedley, Modular.SpacePirates, Modular.ShipCommand, Modular.PowerStone, Modular.BadoonHeadhunter
  ],
  [Pack.MadTitansShadow]: [
    Hero.Spectrum, Hero.AdamWarlock,
    Scenario.EbonyMaw, Scenario.TowerDefense, Scenario.Thanos, Scenario.Hela, Scenario.Loki,
    Modular.BlackOrder, Modular.ArmiesOfTitan, Modular.ChildrenOfThanos, Modular.InfinityGauntlet, Modular.LegionsOfHel, Modular.FrostGiants, Modular.Enchantress
  ],
  [Pack.SinisterMotives]: [
    Hero.GhostSpider, Hero.MilesMorales,
    Scenario.Sandman, Scenario.Venom, Scenario.Mysterio, Scenario.SinisterSix, Scenario.VenomGoblin,
    Modular.CityInChaos, Modular.DownToEarth, Modular.GoblinGear, Modular.GuerrillaTactics, Modular.OsbornTech, Modular.PersonalNightmare, Modular.SinisterAssault, Modular.SymbioticStrength, Modular.WhispersOfParanoia,
  ],
  [Pack.MutantGenesis]: [
    Hero.Shadowcat, Hero.Colossus,
    //TODO: scenarios + modulars
  ],
  [Pack.NextEvolution]: [
    Hero.Cable, Hero.Domino,
    //TODO: scenarios + modulars
  ],
  [Pack.AgeOfApocalypse]: [
    Hero.Bishop, Hero.Magik,
    //TODO: scenarios + modulars
    Difficulty.Standard3, Difficulty.Expert3
  ],
  [Pack.AgentsOfShield]: [
    Hero.MariaHill, Hero.NickFury
    //TODO: scenarios + modulars
  ],
  // Scenario Packs
  [Pack.GreenGoblin]: [
    Scenario.RiskyBusiness, Scenario.MutagenFormula,
    Modular.GoblinGimmicks, Modular.AMessOfThings, Modular.PowerDrain, Modular.RunningInterference
  ],
  [Pack.WreckingCrew]: [
    //TODO: scenarios + modulars
  ],
  [Pack.Hood]: [
    //TODO: scenarios + modulars
    Difficulty.Standard2, Difficulty.Expert2
  ],
  [Pack.MojoMania]: [
    Scenario.Magog, Scenario.Spiral, Scenario.Mojo,
    Modular.Crime, Modular.Fantasy, Modular.Horror, Modular.SciFi, Modular.Sitcom, Modular.Western, Modular.Longshot
  ],
  [Pack.Kang]: [
    //TODO: scenarios + modulars
  ],
  // Misc
  [Pack.KreeFanatic]: [Modular.KreeFanatic]
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
