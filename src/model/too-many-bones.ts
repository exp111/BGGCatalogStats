import {BaseGamePlay, BaseGamePlayer, BaseGameStats} from "./base-game-stats";

export const TMB_GAME_ID = 192135;

export enum Gearloc {
  Patches,
  Boomer,
  Tantrum,
  Picket,
  Ghillie,
  Gasket,
  Nugget,
  Tink,
  Stanza,
  Duster,
  LabRats,
  Dart,
  Gale,
  Figment,
  Carcass,
  Static,
  Polaris,
  Riffle,
  END
}

export enum Tyrant {
  Mulmesh = Gearloc.END,
  Nom,
  Drellen,
  Marrow,
  GoblinKing,
  Gendricks,
  Duster,
  Nobulous,
  Barnacle,
  VolKesh,
  GoblinQueen,
  Kollossum,
  Domina,
  RokRol,
  Gavenkog,
  Nexus,
  Cinder,
  Amanight,
  Blobulous,
  Leech,
  Oxide,
  Locgear,
  AutomatonOfShale,
  END
}

export enum Difficulty {
  Adventurer = Tyrant.END,
  Heroic,
  Legendary,
  END
}

export const BoxContent: ({ [key: string]: any[] }) = {
  [TMB_GAME_ID]: [
    Gearloc.Patches, Gearloc.Boomer, Gearloc.Tantrum, Gearloc.Picket,
    Tyrant.Mulmesh, Tyrant.Nom, Tyrant.Drellen, Tyrant.Marrow, Tyrant.GoblinKing, Tyrant.Gendricks, Tyrant.Duster,
    Difficulty.Adventurer, Difficulty.Heroic, Difficulty.Legendary
  ],
  [235802]: [ // Undertow
    Gearloc.Stanza, Gearloc.Duster,
    Tyrant.Nobulous, Tyrant.Barnacle, Tyrant.VolKesh, Tyrant.GoblinQueen, Tyrant.Kollossum,
    Difficulty.Adventurer, Difficulty.Heroic, Difficulty.Legendary
  ],
  [347811]: [ // Unbreakable
    Gearloc.Gale, Gearloc.Figment,
    Tyrant.Domina, Tyrant.RokRol, Tyrant.Gavenkog, Tyrant.Nexus, Tyrant.Cinder,
    Difficulty.Adventurer, Difficulty.Heroic, Difficulty.Legendary
  ],
  [281285]: [ // Splice and Dice
    Tyrant.Amanight, Tyrant.Blobulous, Tyrant.Leech, Tyrant.Oxide, Tyrant.Locgear
  ],
  // Gearlocs
  [224897]: [Gearloc.Nugget],
  [224899]: [Gearloc.Ghillie],
  [239290]: [Gearloc.Gasket],
  [224898]: [Gearloc.Tink],
  [283861]: [Gearloc.Dart],
  [283862]: [Gearloc.LabRats],
  [349579]: [Gearloc.Polaris],
  [349580]: [Gearloc.Static],
  [349581]: [Gearloc.Carcass],
  [370264]: [Gearloc.Riffle],
  // Automaton
  [349916]: [Tyrant.AutomatonOfShale]
}

export interface TooManyBonesPlayer extends BaseGamePlayer {
  Gearloc: Gearloc;
}

export interface TooManyBonesPlay extends BaseGamePlay {
  Players: TooManyBonesPlayer[];
  Tyrant: Tyrant;
  Difficulty: Difficulty;
}

export interface TooManyBonesStats extends BaseGameStats {
  Plays: TooManyBonesPlay[];
}
