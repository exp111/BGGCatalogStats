export interface BaseGamePlayer {
  Name: string;
  IsMe: boolean;
}

export interface BaseGamePlay {
  Id: number;
  Players: BaseGamePlayer[];
  Time: number;
  Won: boolean;
  Notes: string;
}

export interface BaseGameStats {
  Plays: BaseGamePlay[];
  OwnedContent: string[];
}
