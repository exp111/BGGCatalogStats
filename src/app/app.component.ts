import {Component} from '@angular/core';
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
    NgbModule
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
  }

  protected readonly Heroes = Heroes;
  protected readonly Aspects = Aspects;
  protected readonly Scenarios = Scenarios;
  protected readonly Modulars = Modulars;
  protected readonly Difficulty = Difficulty;
}
