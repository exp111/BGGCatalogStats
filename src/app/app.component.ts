import {ChangeDetectorRef, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BackupReaderService} from "./backup-reader.service";
import {
  Aspects,
  Difficulty,
  Heroes,
  MarvelChampionsPlay,
  MarvelChampionsStats,
  Modulars,
  Scenarios
} from "../model/marvelchampions";
import {TableComponent} from "./app-table/table.component";
import {ChecklistComponent} from "./app-table/checklist.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgbModule,
    TableComponent,
    ChecklistComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BGGCollectionStats';
  stats?: MarvelChampionsStats;
  onlyMe: boolean = false;

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

  playHasHero(play: MarvelChampionsPlay, hero: Heroes, aspect?: Aspects) {
    return play.Players.some(p => p.Hero == hero
      && (!this.onlyMe || p.IsMe)
      && (!aspect || p.Aspect == aspect));
  }

  heroPlayrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let hero = Heroes[y as keyof typeof Heroes];
    let totalPlays = this.stats.plays.length;
    let heroPlays = this.stats.plays.filter(p => this.playHasHero(p, hero));
    let plays = heroPlays.length;
    let rate = 0;
    if (plays > 0) {
      rate = plays / totalPlays * 100;
    }
    return `${rate.toFixed(1)}% (${plays}/${totalPlays})`
  }

  heroWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let hero = Heroes[y as keyof typeof Heroes];
    let heroPlays = this.stats.plays.filter(p => this.playHasHero(p, hero));
    let wins = heroPlays.reduce((a, b) => a + Number(b.Won), 0);
    let plays = heroPlays.length;
    let rate = 0;
    if (plays > 0) {
      rate = wins / plays * 100;
    }
    return `${rate.toFixed(1)}% (${wins}/${plays})`;
  }

  heroWinrateCellClassGetter(value: string) {
    return value.startsWith("0.0%") ? "table-danger" : value.startsWith("100.0%") ? "table-success" : "";
  }

  heroAspectGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let hero = Heroes[x as keyof typeof Heroes];
    let aspect = Aspects[y as keyof typeof Aspects];
    return this.stats.plays.some(p => p.Won && this.playHasHero(p, hero, aspect));
  }

  scenarioHeroGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let hero = Heroes[y as keyof typeof Heroes];
    return this.stats.plays.some(p => p.Won && p.Scenario == scenario && this.playHasHero(p, hero));
  }

  scenarioModuleGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let module = Modulars[y as keyof typeof Modulars];
    return this.stats.plays.some(p => p.Won && p.Scenario == scenario && p.Modular == module);
  }

  scenarioDifficultyGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let difficulty = Difficulty[y as keyof typeof Difficulty];
    return this.stats.plays.some(p => p.Won && p.Scenario == scenario && p.Difficulty == difficulty);
  }

  //TODO: can we instead get the enum values instead of strings?
  enumToArray(e: any) {
    // filter out the indexes
    return Object.values(e).filter(v => Number.isNaN(Number(v))) as string[];
  }

  protected readonly Heroes = Heroes;
  protected readonly Aspects = Aspects;
  protected readonly Scenarios = Scenarios;
  protected readonly Modulars = Modulars;
  protected readonly Difficulty = Difficulty;
}
