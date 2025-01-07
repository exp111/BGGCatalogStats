import { Pipe, PipeTransform } from '@angular/core';
import {Aspect, Difficulty, Hero, MarvelChampionsPlay, Modular, Scenario} from "../../../model/marvel-champions";

export enum SortOrder {
  Ascending,
  Descending
}
export enum SortType {
  Timestamp,
  Duration
}

export interface MCFilterParams {
  onlyWon: boolean;
  hero: Hero | null;
  aspect: Aspect | null;
  scenario: Scenario | null;
  modular: Modular | null;
  difficulty: Difficulty | null;
  sortBy: SortType | null;
  sortOrder: SortOrder | null;
}

@Pipe({
  name: 'MCFilterPipe',
  standalone: true
})
export class MCFilterPipe implements PipeTransform {

  transform(value: MarvelChampionsPlay[], params: MCFilterParams): MarvelChampionsPlay[] {
    if (!value || value.length == 0) {
      return [];
    }
    if (!params) {
      return value;
    }

    return value.filter(p =>
      (!params.onlyWon || p.Won) &&
      (params.hero == null || p.Players.some(pl => pl.Hero == params.hero)) &&
      (params.aspect == null || p.Players.some(pl => pl.Aspects.includes(params.aspect!))) &&
      (params.scenario == null || p.Scenario == params.scenario) &&
      (params.modular == null || p.Modulars.includes(params.modular)) &&
      (params.difficulty == null || p.Difficulty == params.difficulty)
    ).sort((a,b) => {
      let first = params.sortOrder == SortOrder.Descending ? b : a;
      let second = first == a ? b : a;
      switch (params.sortBy) {
        case SortType.Timestamp:
          return first.Timestamp.localeCompare(second.Timestamp);
        case SortType.Duration:
          return first.Duration - second.Duration;
        default:
          return 0;
      }
    })
  }

}
