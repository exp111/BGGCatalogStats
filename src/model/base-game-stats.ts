export interface BaseGamePlayer {
  Name: string;
  IsMe: boolean;
}

export interface BaseGamePlay {
  Id: string;
  Players: BaseGamePlayer[];
  Duration: number;
  Won: boolean;
  Notes: string;
  Timestamp: string;
  Location: string;
}

export interface BaseGameStats {
  Plays: BaseGamePlay[];
  OwnedContent: string[];
}
