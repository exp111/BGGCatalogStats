import {BackupReaderService} from "./backup-reader.service";
import {Directive} from "@angular/core";
import {BaseGameStats} from "../model/base-game-stats";

@Directive()
export abstract class BaseGameComponent {
  static Title: string;
  stats?: BaseGameStats;

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
}
