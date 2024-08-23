import {ChangeDetectorRef, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BackupReaderService} from "./backup-reader.service";
import {Aspects, Difficulty, Heroes, MarvelChampionsStats, Modulars, Scenarios} from "../model/marvelchampions";
import {XYCheckListComponent} from "./xycheck-list/xycheck-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgbModule,
    XYCheckListComponent
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
    console.log(text);
    let backup = JSON.parse(text);
    this.stats = this.backupReader.marvelChampions(backup);
    console.log(this.stats);
  }

  heroAspectGetter = (x: string, y: string) => {
    if (!this.stats) {
      return false;
    }
    let hero = Heroes[x as keyof typeof Heroes];
    let aspect = Aspects[y as keyof typeof Aspects];
    return this.stats.plays.some(p => p.Won && p.Players.some(p => p.Hero == hero && p.Aspect == aspect));
  }

  scenarioHeroGetter = (x: string, y: string) => {
    if (!this.stats) {
      return false;
    }
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let hero = Heroes[y as keyof typeof Heroes];
    return this.stats.plays.some(p => p.Won && p.Scenario == scenario && p.Players.some(p => p.Hero == hero));
  }

  scenarioModuleGetter = (x: string, y: string) => {
    if (!this.stats) {
      return false;
    }
    let scenario = Scenarios[x as keyof typeof Scenarios];
    let module = Modulars[y as keyof typeof Modulars];
    return this.stats.plays.some(p => p.Won && p.Scenario == scenario && p.Modular == module);
  }

  scenarioDifficultyGetter = (x: string, y: string) => {
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
