import {BaseBackupReaderService} from "../backup-reader/base-backup-reader.service";
import {Directive} from "@angular/core";
import {BaseGamePlay, BaseGameStats} from "../../model/base-game-stats";
import {enumToNumberArray, formatFromEnumString} from "../util/enum-utils";
import {ChecklistState} from "../app-table/checklist.component";
import {StatService} from "../../services/stat.service";
import {BGGCatalogBackup} from "../../model/bgg-catalog";
import {BGStatsBackup} from "../../model/bg-stats";
import {Router} from "@angular/router";

@Directive()
export abstract class BaseGameComponent<S extends BaseGameStats, P extends BaseGamePlay> {
  static Title: string;
  stats!: S;
  onlyMe: boolean = false;
  onlyOwned: boolean = true;
  onlyPlayed: boolean = true;

  /**
   * Can contain enum beatifiers that transform enum values to their beautified string value.
   **/
  protected abstract enumBeautifiers: { [end: number]: (e: number) => string | null };

  constructor(protected backupReader: BaseBackupReaderService,
              protected statService: StatService,
              protected router: Router) {
    (window as any).app = this;
    if (this.statService.hasStats) {
      this.stats = this.loadData();
    } else {
      // route back
      this.router.navigate(["/import"]);
    }
  }

  public loadData() {
    switch (this.statService.stats?.selectedTool) {
      case "bggcatalog":
        return this.backupReader.parseBGGCatalog(this.statService.stats.data as BGGCatalogBackup) as S;
      case "bgstats":
        return this.backupReader.parseBGStats(this.statService.stats.data as BGStatsBackup) as S;
    }
    throw new Error(`Can't load data for tool ${this.statService.stats?.selectedTool}`);
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

  protected sortedEnumToNumberArray(e: any) {
    return this.enumToNumberArray(e).sort((a,b) => e[a].localeCompare(e[b]));
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
