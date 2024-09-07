import {Component} from '@angular/core';
import {ChecklistComponent} from "../app-table/checklist.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "../app-table/table.component";
import {
  Aspects,
  Difficulty,
  Heroes,
  MarvelChampionsPlay,
  MarvelChampionsStats,
  Modulars,
  PackContent,
  Scenarios
} from "../../model/marvelchampions";
import {BackupReaderService} from "../backup-reader.service";
import {enumToArray, formatFromEnumString} from "../enumUtils";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-marvelchampions',
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
export class MarvelChampionsComponent {
  static Title = 'Marvel Champions Stats';
  stats?: MarvelChampionsStats;
  onlyMe: boolean = false;
  onlyOwned: boolean = true;

  constructor(protected backupReader: BackupReaderService) {
    (window as any).app = this;
  }

  onFileLoad(event: Event & { target: HTMLInputElement }) {
    const files = event.target.files;
    if (files?.length != null && files?.length > 0) {
      const file = files[0];
      file.text().then((f) => this.readFile(f));
    }
  }

  readFile(text: string) {
    let backup = JSON.parse(text);
    this.stats = this.backupReader.marvelChampions(backup);
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
    let hero = Heroes[y as keyof typeof Heroes];
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    return this.getRate(plays.length, heroPlays.length);
  }

  aspectPlayrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspect = Aspects[y as keyof typeof Aspects];
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    return this.getRate(plays.length, aspectPlays.length);
  }

  scenarioPlayrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = Scenarios[y as keyof typeof Scenarios];
    let scenarioPlays = plays.filter(p => p.Scenario == scenario);
    return this.getRate(plays.length, scenarioPlays.length);
  }

  heroWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let hero = Heroes[y as keyof typeof Heroes];
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    let wins = this.getWins(heroPlays);
    return this.getRate(heroPlays.length, wins);
  }

  winrateCellClassGetter(value: string) {
    return value.startsWith("0.0%") ? "table-danger" : value.startsWith("100.0%") ? "table-success" : "";
  }

  aspectWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspect = Aspects[y as keyof typeof Aspects];
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    let wins = this.getWins(aspectPlays);
    return this.getRate(aspectPlays.length, wins);
  }

  scenarioWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = Scenarios[y as keyof typeof Scenarios];
    let scenarioPlays = plays.filter(p => p.Scenario == scenario);
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  scenarioHeroWinrateGetter(x: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let hero = Heroes[y as keyof typeof Heroes];
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  heroAspectWinrateGetter(x: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let hero = Heroes[x as keyof typeof Heroes];
    let aspect = Aspects[y as keyof typeof Aspects];
    let scenarioPlays = plays.filter(p => this.playHasHero(p, hero, aspect));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  scenarioAspectWinrateGetter(x: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let aspect = Aspects[y as keyof typeof Aspects];
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, undefined, aspect));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  heroAspectWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let hero = Heroes[x as keyof typeof Heroes];
    let aspect = Aspects[y as keyof typeof Aspects];
    return plays.some(p => p.Won && this.playHasHero(p, hero, aspect));
  }

  scenarioHeroWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let hero = Heroes[y as keyof typeof Heroes];
    return plays.some(p => p.Won && p.Scenario == scenario && this.playHasHero(p, hero));
  }

  scenarioAspectWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let aspect = Aspects[y as keyof typeof Aspects];
    return plays.some(p => p.Won && p.Scenario == scenario && this.playHasHero(p, undefined, aspect));
  }

  scenarioModuleWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let module = Modulars[y as keyof typeof Modulars];
    return plays.some(p => p.Won && p.Scenario == scenario && p.Modular == module);
  }

  scenarioDifficultyWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let difficulty = Difficulty[y as keyof typeof Difficulty];
    return plays.some(p => p.Won && p.Scenario == scenario && p.Difficulty == difficulty);
  }

  //TODO: can we instead get the enum values instead of strings?
  enumToArray(e: any) {
    // filter out the values
    return enumToArray(e)
      .filter(v => v != "END") // ignore end marker
      .filter(v => this.ownedCheck(v) // only show owned
      ) as string[];
  }

  ownedCheck(e: any) {
    if (!this.onlyOwned) {
      return true;
    }
    return this.stats?.OwnedPacks.some(p => PackContent[p].includes(e));
  }

  formatter(val: string) {
    if (!val) {
      return "unknown";
    }
    return formatFromEnumString(val);
  }

  protected readonly Heroes = Heroes;
  protected readonly Aspects = Aspects;
  protected readonly Scenarios = Scenarios;
  protected readonly Modulars = Modulars;
  protected readonly Difficulty = Difficulty;
}
