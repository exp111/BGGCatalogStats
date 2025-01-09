import {Component} from '@angular/core';
import {ChecklistComponent, ChecklistState} from "../../app-table/checklist.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "../../app-table/table.component";
import {
  Aspect,
  Difficulty,
  Hero,
  MarvelChampionsPlay,
  MarvelChampionsStats,
  Modular,
  Scenario
} from "../../../model/marvel-champions";
import {BaseGameComponent} from "../base-game.component";
import {MCBackupReaderService} from "../../backup-reader/marvel-champions/mc-backup-reader.service";
import {formatDurationMinutes} from "../../util/helper";
import {MCFilterParams, MCFilterPipe, SortOrder, SortType} from "./mc-filter.pipe";
import {BaseUploadSelectionComponent} from "../../base-upload-selection/base-upload-selection.component";

@Component({
    selector: 'app-marvel-champions',
    imports: [
        ChecklistComponent,
        ReactiveFormsModule,
        TableComponent,
        FormsModule,
        MCFilterPipe,
        BaseUploadSelectionComponent,
    ],
    templateUrl: './marvel-champions.component.html',
    styleUrl: './marvel-champions.component.scss'
})
export class MarvelChampionsComponent extends BaseGameComponent {
  static override Title = 'Marvel Champions Stats';
  declare stats?: MarvelChampionsStats;
  override exampleFileName = "mc-example";

  filterParams: MCFilterParams = {
    onlyWon: false,
    hero: null,
    aspect: null,
    scenario: null,
    modular: null,
    difficulty: null,
    sortBy: null,
    sortOrder: SortOrder.Ascending
  };

  protected override enumBeautifiers = {
    [Hero.END]: this.beautifyHeroName
  }

  private beautifyHeroName(e: number) {
    return {
      [Hero.SPdr]: "SP//dr"
    }[e] ?? null;
  }

  constructor(protected backupService: MCBackupReaderService) {
    super(backupService);
  }

  protected override playedCheck(val: number) {
    if (!this.stats) {
      return true;
    }
    return this.stats.Plays.some(p => p.Scenario == val
      || p.Difficulty == val
      || p.Modulars.includes(val)
      || this.playHasHero(p, val)
      || this.playHasHero(p, undefined, val));
  }

  playHasHero(play: MarvelChampionsPlay, hero?: Hero, aspect?: Aspect) {
    return play.Players.some(p => (hero == undefined || p.Hero == hero)
      && (!this.onlyMe || p.IsMe)
      && (aspect == undefined || p.Aspects?.includes(aspect)));
  }

  getRate(totalPlays: number, plays: number) {
    let rate = 0;
    if (plays > 0) {
      rate = plays / totalPlays * 100;
    }
    return `${rate.toFixed(1)}% (${plays}/${totalPlays})`;
  }

  getPlays(stats: MarvelChampionsStats) {
    return stats.Plays.filter(p => this.playHasHero(p)); // check if play is valid (ie contains "me")
  }

  getWins(plays: MarvelChampionsPlay[]) {
    return plays.reduce((a, b) => a + Number(b.Won), 0);
  }

  getPlaytime(plays: MarvelChampionsPlay[]) {
    return plays.reduce((a, b) => a + (b.Duration ?? 0), 0);
  }

  getAveragePlaytime(plays: MarvelChampionsPlay[], onlyWon: boolean | null = null) {
    let filtered = plays;
    switch (onlyWon) {
      case false:
        filtered = plays.filter(p => !p.Won);
        break;
      case true:
        filtered = plays.filter(p => p.Won);
        break;
    }
    let count = filtered.length;
    return count > 0 ? this.getPlaytime(filtered) / count : 0;
  }

  heroPlayrateGetter(_: string, hero: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    return this.getRate(plays.length, heroPlays.length);
  }

  aspectPlayrateGetter(_: string, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    return this.getRate(plays.length, aspectPlays.length);
  }

  scenarioPlayrateGetter(_: string, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario);
    return this.getRate(plays.length, scenarioPlays.length);
  }

  heroWinrateGetter(_: string, hero: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    let wins = this.getWins(heroPlays);
    return this.getRate(heroPlays.length, wins);
  }

  aspectWinrateGetter(_: string, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    let wins = this.getWins(aspectPlays);
    return this.getRate(aspectPlays.length, wins);
  }

  scenarioWinrateGetter(_: string, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario);
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  scenarioHeroWinrateGetter(scenario: number, hero: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  heroAspectWinrateGetter(hero: number, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => this.playHasHero(p, hero, aspect));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  scenarioAspectWinrateGetter(scenario: number, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, undefined, aspect));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  heroPlaytimeGetter(_: string, hero: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    return formatDurationMinutes(this.getPlaytime(heroPlays));
  }

  aspectPlaytimeGetter(_: string, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    return formatDurationMinutes(this.getPlaytime(aspectPlays));
  }

  scenarioPlaytimeGetter(_: string, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p));
    return formatDurationMinutes(this.getPlaytime(scenarioPlays));
  }

  playerCountPlaytimeGetter(_: string, count: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let countPlays = plays.filter(p => p.Players.length == count);
    return formatDurationMinutes(this.getPlaytime(countPlays));
  }

  heroScenarioPlaytimeGetter(hero: number, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroScenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero));
    return formatDurationMinutes(this.getPlaytime(heroScenarioPlays));
  }

  avgHeroPlaytimeGetter(_: string, hero: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    return formatDurationMinutes(this.getAveragePlaytime(heroPlays));
  }

  avgAspectPlaytimeGetter(_: string, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    return formatDurationMinutes(this.getAveragePlaytime(aspectPlays));
  }

  avgScenarioPlaytimeGetter(_: string, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p));
    return formatDurationMinutes(this.getAveragePlaytime(scenarioPlays));
  }

  avgPlayerCountPlaytimeGetter(_: string, count: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let countPlays = plays.filter(p => p.Players.length == count && this.playHasHero(p));
    return formatDurationMinutes(this.getAveragePlaytime(countPlays));
  }

  avgHeroScenarioPlaytimeGetter(hero: number, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroScenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero));
    return formatDurationMinutes(this.getAveragePlaytime(heroScenarioPlays));
  }

  heroAspectWonGetter(hero: number, aspect: number) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    return this.playsToChecklist(plays.filter(p => this.playHasHero(p, hero, aspect)));
  }

  scenarioHeroWonGetter(scenario: number, hero: number) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    return this.playsToChecklist(plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero)));
  }

  scenarioAspectWonGetter(scenario: number, aspect: number) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    return this.playsToChecklist(plays.filter(p => p.Scenario == scenario && this.playHasHero(p, undefined, aspect)));
  }

  scenarioModularWonGetter(scenario: number, modular: number) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    return this.playsToChecklist(plays.filter(p => p.Scenario == scenario && p.Modulars.includes(modular)));
  }

  scenarioDifficultyWonGetter(scenario: number, difficulty: number) {
    if (!this.stats) {
      return ChecklistState.Empty;
    }
    let plays = this.getPlays(this.stats);
    return this.playsToChecklist(plays.filter(p => p.Scenario == scenario && p.Difficulty == difficulty));
  }

  formatEnumList(enums: any, entries: any[]) {
    return entries ? entries.map(a => this.beautifyEnum(enums, a)).join(", ") : this.beautifyEnum(null, null); // else just return the default value
  }

  protected readonly Hero = Hero;
  protected readonly Aspect = Aspect;
  protected readonly Scenario = Scenario;
  protected readonly Modular = Modular;
  protected readonly Difficulty = Difficulty;
  protected readonly formatDurationMinutes = formatDurationMinutes;
  protected readonly SortOrder = SortOrder;
  protected readonly SortType = SortType;
}
