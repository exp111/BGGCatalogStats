import {BaseBackupReaderService} from "../backup-reader/base-backup-reader.service";
import {Directive} from "@angular/core";
import {BaseGameStats} from "../../model/base-game-stats";
import {enumToArray, formatFromEnumString} from "../enum-utils";

@Directive()
export abstract class BaseGameComponent {
  static Title: string;
  stats?: BaseGameStats;
  onlyMe: boolean = false;
  onlyOwned: boolean = true;
  abstract exampleFileName: string;

  constructor(protected backupReader: BaseBackupReaderService) {
    (window as any).app = this;
  }

  public loadExample() {
    fetch(`./example/${this.exampleFileName}.json`).then(r => r.text()).then(t => this.readFile(t));
  }

  public onFileLoad(event: Event & { target: HTMLInputElement }) {
    const files = event.target.files;
    if (files?.length != null && files?.length > 0) {
      const file = files[0];
      file.text().then((f) => this.readFile(f));
    }
  }

  public readFile(text: string) {
    let backup = JSON.parse(text);
    this.stats = this.backupReader.parse(backup);
  }

  public winrateCellClassGetter(value: string) {
    return value.startsWith("0.0%") ? "table-danger" : value.startsWith("100.0%") ? "table-success" : "";
  }

  //TODO: can we instead get the enum values instead of strings?
  protected enumToArray(e: any) {
    // filter out the values
    return enumToArray(e)
      .filter(v => v != "END") // ignore end marker
      .filter(v => !this.onlyOwned || this.ownedCheck(v) // only show owned
      ) as string[];
  }

  protected abstract ownedCheck(v: any): boolean;

  public formatter(val: string) {
    if (!val) {
      return "unknown";
    }
    return formatFromEnumString(val);
  }
}
