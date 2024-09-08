import {Component} from '@angular/core';
import {ChecklistComponent} from "../../app-table/checklist.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "../../app-table/table.component";
import {
  Aspects,
  Difficulty,
  Heroes,
  MarvelChampionsPlay,
  MarvelChampionsStats,
  Modulars,
  PackContent,
  Scenarios
} from "../../../model/marvel-champions";
import {enumToArray, formatFromEnumString, getEnumValue} from "../../enum-utils";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BaseGameComponent} from "../base-game.component";
import {MCBackupReaderService} from "../../backup-reader/marvel-champions/mc-backup-reader.service";

@Component({
  selector: 'app-marvel-champions',
  standalone: true,
  imports: [
    ChecklistComponent,
    ReactiveFormsModule,
    TableComponent,
    FormsModule,
    NgbModule,
  ],
  templateUrl: './marvel-champions.component.html',
  styleUrl: './marvel-champions.component.css'
})
export class MarvelChampionsComponent extends BaseGameComponent {
  static override Title = 'Marvel Champions Stats';
  declare stats?: MarvelChampionsStats;

  constructor(protected backupService: MCBackupReaderService) {
    super(backupService);
  }

  playHasHero(play: MarvelChampionsPlay, hero?: Heroes, aspect?: Aspects) {
    return play.Players.some(p => (hero == undefined || p.Hero == hero)
      && (!this.onlyMe || p.IsMe)
      && (aspect == undefined || p.Aspect == aspect));
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

  heroPlayrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let hero = getEnumValue(Heroes, y);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    return this.getRate(plays.length, heroPlays.length);
  }

  aspectPlayrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspect = getEnumValue(Aspects, y);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    return this.getRate(plays.length, aspectPlays.length);
  }

  scenarioPlayrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenarios, y);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario);
    return this.getRate(plays.length, scenarioPlays.length);
  }

  heroWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let hero = getEnumValue(Heroes, y);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    let wins = this.getWins(heroPlays);
    return this.getRate(heroPlays.length, wins);
  }

  aspectWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspect = getEnumValue(Aspects, y);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    let wins = this.getWins(aspectPlays);
    return this.getRate(aspectPlays.length, wins);
  }

  scenarioWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenarios, y);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario);
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  scenarioHeroWinrateGetter(x: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenarios, x);
    let hero = getEnumValue(Heroes, y);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  heroAspectWinrateGetter(x: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let hero = getEnumValue(Heroes, x);
    let aspect = getEnumValue(Aspects, y);
    let scenarioPlays = plays.filter(p => this.playHasHero(p, hero, aspect));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  scenarioAspectWinrateGetter(x: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenarios, x);
    let aspect = getEnumValue(Aspects, y);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, undefined, aspect));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  heroAspectWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let hero = getEnumValue(Heroes, x);
    let aspect = getEnumValue(Aspects, y);
    return plays.some(p => p.Won && this.playHasHero(p, hero, aspect));
  }

  scenarioHeroWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenarios, x);
    let hero = getEnumValue(Heroes, y);
    return plays.some(p => p.Won && p.Scenario == scenario && this.playHasHero(p, hero));
  }

  scenarioAspectWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenarios, x);
    let aspect = getEnumValue(Aspects, y);
    return plays.some(p => p.Won && p.Scenario == scenario && this.playHasHero(p, undefined, aspect));
  }

  scenarioModuleWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenarios, x);
    let module = getEnumValue(Modulars, y);
    return plays.some(p => p.Won && p.Scenario == scenario && p.Modular == module);
  }

  scenarioDifficultyWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenarios, x);
    let difficulty = getEnumValue(Difficulty, y);
    return plays.some(p => p.Won && p.Scenario == scenario && p.Difficulty == difficulty);
  }

  protected override ownedCheck(e: any) {
    return this.stats?.OwnedPacks.some(p => PackContent[p].includes(e)) ?? false;
  }

  protected readonly Heroes = Heroes;
  protected readonly Aspects = Aspects;
  protected readonly Scenarios = Scenarios;
  protected readonly Modulars = Modulars;
  protected readonly Difficulty = Difficulty;
}
