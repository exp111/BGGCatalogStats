import {Component} from '@angular/core';
import {ChecklistComponent} from "../../app-table/checklist.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "../../app-table/table.component";
import {
  Aspect,
  Difficulty,
  Hero,
  MarvelChampionsPlay,
  MarvelChampionsStats,
  Modular,
  PackContent,
  Scenario
} from "../../../model/marvel-champions";
import {getEnumValue} from "../../enum-utils";
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
  ],
  templateUrl: './marvel-champions.component.html',
  styleUrl: './marvel-champions.component.css'
})
export class MarvelChampionsComponent extends BaseGameComponent {
  static override Title = 'Marvel Champions Stats';
  declare stats?: MarvelChampionsStats;
  override exampleFileName = "mc-example";

  constructor(protected backupService: MCBackupReaderService) {
    super(backupService);
  }

  playHasHero(play: MarvelChampionsPlay, hero?: Hero, aspect?: Aspect) {
    return play.Players.some(p => (hero == undefined || p.Hero == hero)
      && (!this.onlyMe || p.IsMe)
      && (aspect == undefined || p.Aspects.includes(aspect)));
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
    let hero = getEnumValue(Hero, y);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    return this.getRate(plays.length, heroPlays.length);
  }

  aspectPlayrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspect = getEnumValue(Aspect, y);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    return this.getRate(plays.length, aspectPlays.length);
  }

  scenarioPlayrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenario, y);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario);
    return this.getRate(plays.length, scenarioPlays.length);
  }

  heroWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let hero = getEnumValue(Hero, y);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    let wins = this.getWins(heroPlays);
    return this.getRate(heroPlays.length, wins);
  }

  aspectWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspect = getEnumValue(Aspect, y);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    let wins = this.getWins(aspectPlays);
    return this.getRate(aspectPlays.length, wins);
  }

  scenarioWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenario, y);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario);
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  scenarioHeroWinrateGetter(x: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenario, x);
    let hero = getEnumValue(Hero, y);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  heroAspectWinrateGetter(x: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let hero = getEnumValue(Hero, x);
    let aspect = getEnumValue(Aspect, y);
    let scenarioPlays = plays.filter(p => this.playHasHero(p, hero, aspect));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  scenarioAspectWinrateGetter(x: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenario, x);
    let aspect = getEnumValue(Aspect, y);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, undefined, aspect));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  heroAspectWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let hero = getEnumValue(Hero, x);
    let aspect = getEnumValue(Aspect, y);
    return plays.some(p => p.Won && this.playHasHero(p, hero, aspect));
  }

  scenarioHeroWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenario, x);
    let hero = getEnumValue(Hero, y);
    return plays.some(p => p.Won && p.Scenario == scenario && this.playHasHero(p, hero));
  }

  scenarioAspectWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenario, x);
    let aspect = getEnumValue(Aspect, y);
    return plays.some(p => p.Won && p.Scenario == scenario && this.playHasHero(p, undefined, aspect));
  }

  scenarioModuleWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenario, x);
    let module = getEnumValue(Modular, y);
    return plays.some(p => p.Won && p.Scenario == scenario && p.Modulars.includes(module));
  }

  scenarioDifficultyWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = getEnumValue(Scenario, x);
    let difficulty = getEnumValue(Difficulty, y);
    return plays.some(p => p.Won && p.Scenario == scenario && p.Difficulty == difficulty);
  }

  formatEnumList(enums: any, entries: any[]) {
    return entries ? entries.map(a => this.formatter(enums[a])).join(", ") : this.formatter();
  }

  protected readonly Hero = Hero;
  protected readonly Aspect = Aspect;
  protected readonly Scenario = Scenario;
  protected readonly Modular = Modular;
  protected readonly Difficulty = Difficulty;
}
