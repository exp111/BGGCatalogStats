import {BaseBackupReaderService} from "../backup-reader/base-backup-reader.service";
import {Directive} from "@angular/core";
import {BaseGamePlay, BaseGamePlayer, BaseGameStats} from "../../model/base-game-stats";
import {enumToNumberArray, formatFromEnumString} from "../util/enum-utils";
import {ChecklistState} from "../app-table/checklist.component";

@Directive()
export abstract class BaseGameComponent<S extends BaseGameStats, P extends BaseGamePlay> {
  static Title: string;
  selectedTool = "bgstats";
  stats?: S;
  onlyMe: boolean = false;
  onlyOwned: boolean = true;
  onlyPlayed: boolean = true;
  abstract exampleFileName: string;
  /**
   * Can contain enum beatifiers that transform enum values to their beautified string value.
   **/
  protected abstract enumBeautifiers: { [end: number]: (e: number) => string | null };

  constructor(protected backupReader: BaseBackupReaderService) {
    (window as any).app = this;
  }

  public loadExample() {
    fetch(`./example/${this.selectedTool}-${this.exampleFileName}.json`).then(r => r.text()).then(t => this.readFile(t));
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
    switch (this.selectedTool) {
      case "bggcatalog":
        this.stats = this.backupReader.parseBGGCatalog(backup) as S;
        break;
      case "bgstats":
        this.stats = this.backupReader.parseBGStats(backup) as S;
        break;
    }
  }

  public winrateCellClassGetter(value: string) {
    return value.startsWith("0.0%") ? "table-danger" : value.startsWith("100.0%") ? "table-success" : "";
  }

  protected enumToNumberArray(e: any) {
    let endMarker = e["END"];
    // filter out the values
    return enumToNumberArray(e)
      .filter(v => v != endMarker) // ignore end marker
      .filter(v => !this.onlyOwned || this.ownedCheck(v)) // only show owned
      .filter(v => !this.onlyPlayed || this.playedCheck(v)) as number[];
  }

  protected ownedCheck(val: number) {
    return this.stats?.OwnedContent.some(p => this.backupReader.GameContent[p].includes(val)) ?? false;
  }

  protected playedCheck(_val: number) {
    return true;
  }

  protected beautifyEnum(enums: any, val: number | null) {
    if (val == null || !enums) {
      return "unknown";
    }
    let endVal = enums["END"];
    if (!endVal) {
      console.error(`Can't find 'END' value for ${enums}, value: ${val}`);
      endVal = -1;
    }
    let fallback = ((e: any) => formatFromEnumString(enums[e]));
    if (this.enumBeautifiers[endVal]) {
      let ret = this.enumBeautifiers[endVal](val);
      // if the beautifier didnt have a entry, use the fallback
      return ret ?? fallback(val);
    }
    // no beautifier, so just use fallback
    return fallback(val);
  }

  protected playsToChecklist(plays: P[]): ChecklistState {
    if (plays.length == 0) {
      return ChecklistState.Empty;
    }
    return plays.some(p => p.Won) ? ChecklistState.Check : ChecklistState.Incomplete;
  }

  protected getPlays(stats: S): P[] {
    return stats.Plays as P[];
  }

  protected getWins(plays: P[]) {
    return plays.reduce((a, b) => a + Number(b.Won), 0);
  }

  protected getPlaytime(plays: P[]) {
    return plays.reduce((a, b) => a + (b.Duration ?? 0), 0);
  }
}
