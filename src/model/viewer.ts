import {BaseGamePlay, BaseGamePlayer, BaseGameStats} from "./base-game-stats";

export interface ViewerPlayer extends BaseGamePlayer {
  Roles: string[];
}

export interface ViewerPlay extends BaseGamePlay {
  Game: string;
  GameId: number;
  Players: ViewerPlayer[];
  Data: string[];
}

export interface ViewerStats extends BaseGameStats {
  Plays: ViewerPlay[];
}
