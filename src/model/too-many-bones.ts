import {BaseGamePlay, BaseGamePlayer, BaseGameStats} from "./base-game-stats";

export const TMB_GAME_NAME = "Too Many Bones";

export enum Gearloc {
  Patches,
  Boomer,
  Tantrum,
  Picket,
  Ghillie,
  Gasket,
  Nugget,
  Tink,
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
  END
}

export enum Difficulty {
  Adventurer = Tyrant.END,
  Heroic,
  Legendary,
  END
}

export const BoxContent: ({ [key: string]: any[] }) = {
  "Too Many Bones": [
    Gearloc.Patches, Gearloc.Boomer, Gearloc.Tantrum, Gearloc.Picket,
    Tyrant.Mulmesh, Tyrant.Nom, Tyrant.Drellen, Tyrant.Marrow, Tyrant.GoblinKing, Tyrant.Gendricks, Tyrant.Duster,
    Difficulty.Adventurer, Difficulty.Heroic, Difficulty.Legendary
  ],
  "Too Many Bones: Ghillie": [
    Gearloc.Ghillie
  ],
  "Too Many Bones: Gasket": [
    Gearloc.Gasket
  ],
  "Too Many Bones: Nugget": [
    Gearloc.Nugget
  ],
  "Too Many Bones: Tink": [
    Gearloc.Tink
  ],
  //TODO: expansions
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
