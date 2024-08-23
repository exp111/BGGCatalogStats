import {ChangeDetectorRef, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BackupReaderService} from "./backup-reader.service";
import {Aspects, Difficulty, Heroes, MarvelChampionsStats, Modulars, Scenarios} from "../model/marvelchampions";
import {TableComponent} from "./app-table/table.component";
import {ChecklistComponent} from "./app-table/checklist.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgbModule,
    TableComponent,
    ChecklistComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BGGCollectionStats';
  stats?: MarvelChampionsStats;

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

  heroWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let hero = Heroes[y as keyof typeof Heroes];
    let heroPlays = this.stats.plays.filter(p => p.Players.some(pl => pl.Hero == hero));
    let wins = heroPlays.reduce((a, b) => a + Number(b.Won), 0);
    let plays = heroPlays.length;
    let rate = 0;
    if (plays > 0) {
      rate = wins / plays * 100;
    }
    return `${rate.toFixed(1)}% (${wins}/${plays})`;
  }

  heroAspectGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let hero = Heroes[x as keyof typeof Heroes];
    let aspect = Aspects[y as keyof typeof Aspects];
    return this.stats.plays.some(p => p.Won && p.Players.some(pl => pl.Hero == hero && pl.Aspect == aspect));
  }

  scenarioHeroGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let hero = Heroes[y as keyof typeof Heroes];
    return this.stats.plays.some(p => p.Won && p.Scenario == scenario && p.Players.some(pl => pl.Hero == hero));
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

  //TODO: can we instead get the enum values?
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
