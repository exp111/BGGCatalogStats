import {BaseGamePlay, BaseGamePlayer, BaseGameStats} from "./base-game-stats";
import {enumValuesToStrings} from "../app/enum-utils";

export const TMB_GAME_NAME = "Too Many Bones";

export enum Gearloc {
  Patches,
  Boomer,
  Tantrum,
  Picket,
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
    ...enumValuesToStrings(Gearloc, Gearloc.Patches, Gearloc.Boomer, Gearloc.Tantrum, Gearloc.Picket),
    ...enumValuesToStrings(Tyrant, Tyrant.Mulmesh, Tyrant.Nom, Tyrant.Drellen, Tyrant.Marrow, Tyrant.GoblinKing, Tyrant.Gendricks, Tyrant.Duster),
    ...enumValuesToStrings(Difficulty, Difficulty.Adventurer, Difficulty.Heroic, Difficulty.Legendary)
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
