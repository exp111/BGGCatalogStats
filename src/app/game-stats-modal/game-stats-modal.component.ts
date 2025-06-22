import {Component} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {Aspect, Hero, MarvelChampionsStats, Scenario} from "../../model/marvel-champions";
import {FormsModule} from "@angular/forms";
import {enumToNumberArray, formatFromEnumString} from "../util/enum-utils";
import {DateRangeSelectionComponent} from "./date-selection/date-range-selection/date-range-selection.component";
import {MonthSelectionComponent} from "./date-selection/month-selection/month-selection.component";
import {BarChartComponent} from "./components/bar-chart/bar-chart.component";
import {ListComponent} from "./components/list/list.component";
import {NumberCardComponent} from "./components/number-card/number-card.component";
import {YearSelectionComponent} from "./date-selection/year-selection/year-selection.component";
import {BaseGamePlay, BaseGameStats} from "../../model/base-game-stats";

@Component({
  selector: 'app-game-stats-modal',
  imports: [
    FormsModule,
    DateRangeSelectionComponent,
    MonthSelectionComponent,
    BarChartComponent,
    ListComponent,
    NumberCardComponent,
    YearSelectionComponent
  ],
  templateUrl: './game-stats-modal.component.html',
  styleUrl: './game-stats-modal.component.scss'
})
export abstract class GameStatsModalComponent<S extends BaseGameStats, P extends BaseGamePlay> {
  data!: S;
  timespan = "all";
  timespanFrom: NgbDate;
  timespanTo?: NgbDate;

  abstract imgPath: string;
  abstract insightName1: string;
  abstract insightName2: string;
  abstract insightName3: string;
  abstract insightName4: string;
  abstract barChartTitle: string;
  abstract listTitle: string;

  constructor(protected activeModal: NgbActiveModal,
              protected calendar: NgbCalendar) {
    this.timespanFrom = this.calendar.getToday();
    (window as any).modal = this;
  }

  setData(data: S) {
    this.data = data;
  }

  getPlays(): P[] {
    switch (this.timespan) {
      case "custom":
      case "month":
      case "year":
        if (this.timespanFrom && this.timespanTo) {
          return this.data.Plays.filter(p => {
            // build date from timestamp. date month is 0 indexed
            let d = new Date(p.Timestamp);
            let date = new NgbDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
            return this.timespanFrom.equals(date) || this.timespanTo!.equals(date) || (this.timespanFrom.before(date) && this.timespanTo!.after(date));
          }) as P[];
        } else {
          // fallback to all plays if time range isnt given
          return this.data.Plays as P[];
        }
      case "all":
      default:
        return this.data.Plays as P[];
    }
  }

  abstract getEntries(end: number): [string, number][];

  getPlayCount() {
    return this.getPlays().length;
  }

  getVictoryCount() {
    return this.getPlays().filter(play => play.Won).length;
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

  abstract getInsightCount1(): number;
  abstract getInsightCount2(): number;
  abstract getInsightCount3(): number;
  abstract getInsightCount4(): number;
  abstract getBarChartItems(): [string, number][];
  abstract getListItems(): [string, number][];

  protected readonly String = String;
}
