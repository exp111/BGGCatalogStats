import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Hero, MarvelChampionsStats} from "../../model/marvel-champions";
import {FormsModule} from "@angular/forms";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-game-stats-modal',
  imports: [
    FormsModule,
    NgOptimizedImage
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

  getHeroes() {
    let heroes = this.data.Plays
      .flatMap(play => play.Players.map(p => Hero[p.Hero]))
      .filter(h => h);
    let count = {} as Record<string, number>;
    for (let hero of heroes) {
      count[hero] = count[hero] ? count[hero] + 1 : 1;
    }
    return Object.entries(count)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 10);
  }

  protected readonly Object = Object;
}
