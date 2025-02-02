import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Aspect, Hero, MarvelChampionsStats} from "../../model/marvel-champions";
import {FormsModule} from "@angular/forms";
import {enumToNumberArray} from "../util/enum-utils";

@Component({
  selector: 'app-game-stats-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './game-stats-modal.component.html',
  styleUrl: './game-stats-modal.component.scss'
})
export class GameStatsModalComponent {
  data!: MarvelChampionsStats;
  timespan = "all";

  constructor(protected activeModal: NgbActiveModal) {
  }

  setData(data: MarvelChampionsStats) {
    this.data = data;
  }

  getHeroes(end = 9) {
    let heroes = this.data.Plays
      .flatMap(play => play.Players.map(p => Hero[p.Hero]))
      .filter(h => h != null);
    let count = {} as Record<string, number>;
    for (let hero of heroes) {
      count[hero] = count[hero] ? count[hero] + 1 : 1;
    }
    return Object.entries(count)
      .sort((a,b) => b[1] - a[1])
      .slice(0, end);
  }

  getPlayCount() {
    return this.data.Plays.length;
  }

  getVictoryCount() {
    return this.data.Plays.filter(play => play.Won).length;
  }

  getHeroCount() {
    return new Set(this.data.Plays
      .flatMap(p => p.Players.map(pl => pl.Hero))
      .filter(h => h != null)).size;
  }

  getScenarioCount() {
    return new Set(this.data.Plays
      .map(p => p.Scenario)
      .filter(h => h != null)).size;
  }

  getPlayerCount() {
    return new Set(this.data.Plays.flatMap(p => p.Players.map(pl => pl.Name))).size;
  }

  getHours() {
    return Math.floor(this.data.Plays.map(p => p.Duration).reduce((a, b) => a + b, 0) / 60);
  }

  // ratio of plays in which an aspect was used
  getAspectRatio() {
    let aspects = {} as Record<string, number>;
    let highest = 0;
    let as = enumToNumberArray(Aspect).filter(v => v != Aspect.END);
    for (let a of as) {
      let val = this.data.Plays.filter(p => p.Players.some(pl => pl.Aspects.includes(a))).length / this.data.Plays.length;
      aspects[Aspect[a]] = val;
      if (highest < val) {
        highest = val;
      }
    }
    for (let a of as) {
      aspects[Aspect[a]] = aspects[Aspect[a]] / highest;
    }
    return Object.entries(aspects);
  }

  getScenarioRatio() {

  }

  protected readonly String = String;
}
