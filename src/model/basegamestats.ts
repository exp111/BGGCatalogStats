export interface BaseGamePlay {
  Id: number;
  Time: number;
  Won: boolean;
}
export interface BaseGameStats {
  Plays: BaseGamePlay[];
}
