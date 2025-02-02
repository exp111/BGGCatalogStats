import {Component} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {Aspect, Hero, MarvelChampionsStats, Scenario} from "../../model/marvel-champions";
import {FormsModule} from "@angular/forms";
import {enumToNumberArray, formatFromEnumString} from "../util/enum-utils";
import {DateRangeSelectionComponent} from "./date-range-selection/date-range-selection.component";

@Component({
  selector: 'app-game-stats-modal',
  imports: [
    FormsModule,
    DateRangeSelectionComponent
  ],
  templateUrl: './game-stats-modal.component.html',
  styleUrl: './game-stats-modal.component.scss'
})
export class GameStatsModalComponent {
  data!: MarvelChampionsStats;
  timespan = "all";
  timespanFrom: NgbDate;
  timespanTo?: NgbDate;

  constructor(protected activeModal: NgbActiveModal,
              protected calendar: NgbCalendar) {
    this.timespanFrom = this.calendar.getToday();
    (window as any).modal = this;
  }

  setData(data: MarvelChampionsStats) {
    this.data = data;
  }

  getPlays() {
    switch (this.timespan) {
      case "custom":
        if (this.timespanFrom && this.timespanTo) {
          return this.data.Plays.filter(p => {
            // build date from timestamp. date month is 0 indexed
            let d = new Date(p.Timestamp);
            let date = new NgbDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
            return this.timespanFrom.before(date) && this.timespanTo!.after(date);
          });
        } else {
          // fallback to all plays if time range isnt given
          return this.data.Plays;
        }
      case "all":
      default:
        return this.data.Plays;
    }
  }

  getHeroes(end = 9) {
    let heroes = this.getPlays()
      .flatMap(play => play.Players.map(p => Hero[p.Hero]))
      .filter(h => h != null);
    let count = {} as Record<string, number>;
    for (let hero of heroes) {
      count[hero] = count[hero] ? count[hero] + 1 : 1;
    }
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, end);
  }

  getPlayCount() {
    return this.getPlays().length;
  }

  getVictoryCount() {
    return this.getPlays().filter(play => play.Won).length;
  }

  getHeroCount() {
    return new Set(this.getPlays()
      .flatMap(p => p.Players.map(pl => pl.Hero))
      .filter(h => h != null)).size;
  }

  getScenarioCount() {
    return new Set(this.getPlays()
      .map(p => p.Scenario)
      .filter(h => h != null)).size;
  }

  getPlayerCount() {
    return new Set(this.getPlays().flatMap(p => p.Players.map(pl => pl.Name))).size;
  }

  getHours() {
    return Math.floor(this.getPlays()
        .map(p => p.Duration)
        .reduce((a, b) => a + b, 0)
      / 60);
  }

  // ratio of plays in which an aspect was used
  getAspectRatio() {
    let plays = this.getPlays();
    let aspects = {} as Record<string, number>;
    let highest = 0;
    let as = enumToNumberArray(Aspect).filter(v => v != Aspect.END);
    for (let a of as) {
      let val = (plays.filter(p => p.Players.some(pl => pl.Aspects.includes(a))).length / plays.length) || 0;
      aspects[Aspect[a]] = val;
      if (highest < val) {
        highest = val;
      }
    }
    // normalize to the highest ratio
    if (highest > 0) {
      for (let a of as) {
        aspects[Aspect[a]] = aspects[Aspect[a]] / highest;
      }
    }
    return Object.entries(aspects);
  }

  getScenarioRatio(end = 4) {
    let plays = this.getPlays();
    let scenarios = {} as Record<string, number>;
    for (let scenario of enumToNumberArray(Scenario).filter(v => v != Scenario.END)) {
      let val = (plays.filter(p => p.Scenario == scenario).length / plays.length) || 0;
      // only add scenario if played
      if (val > 0) {
        scenarios[formatFromEnumString(Scenario[scenario])] = val;
      }
    }
    return Object.entries(scenarios).sort((a, b) => b[1] - a[1]).slice(0, end);
  }

  protected readonly String = String;
}
