import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Hero, MarvelChampionsStats} from "../../model/marvel-champions";
import {FormsModule} from "@angular/forms";

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

  getHeroes(end = 10) {
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
}
