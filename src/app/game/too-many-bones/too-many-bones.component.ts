import {Component} from '@angular/core';
import {ChecklistComponent} from "../../app-table/checklist.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "../../app-table/table.component";
import {enumToArray, formatFromEnumString, getEnumValue} from "../../enum-utils";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BaseGameComponent} from "../base-game.component";
import {
  BoxContent,
  Difficulty,
  Gearlocs,
  TooManyBonesPlay,
  TooManyBonesStats,
  Tyrants
} from "../../../model/too-many-bones";
import {TMBBackupReaderService} from "../../backup-reader/too-many-bones/tmb-backup-reader.service";

@Component({
  selector: 'app-marvel-champions',
  standalone: true,
  imports: [
    ChecklistComponent,
    ReactiveFormsModule,
    TableComponent,
    FormsModule,
    NgbModule,
  ],
  templateUrl: './too-many-bones.component.html',
  styleUrl: './too-many-bones.component.css'
})
export class TooManyBonesComponent extends BaseGameComponent {
  static override Title = 'Too Many Bones Stats';
  declare stats?: TooManyBonesStats;
  onlyMe: boolean = false;
  onlyOwned: boolean = true;

  constructor(protected backupService: TMBBackupReaderService) {
    super(backupService);
  }

  playHasGearloc(play: TooManyBonesPlay, gearloc?: Gearlocs) {
    return play.Players.some(p => (gearloc == undefined || p.Gearloc == gearloc)
      && (!this.onlyMe || p.IsMe));
  }

  getRate(totalPlays: number, plays: number) {
    let rate = 0;
    if (plays > 0) {
      rate = plays / totalPlays * 100;
    }
    return `${rate.toFixed(1)}% (${plays}/${totalPlays})`;
  }

  getPlays(stats: TooManyBonesStats) {
    return stats.Plays.filter(p => this.playHasGearloc(p)); // check if play is valid (ie contains "me")
  }

  getWins(plays: TooManyBonesPlay[]) {
    return plays.reduce((a, b) => a + Number(b.Won), 0);
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
    return this.stats?.OwnedExpansions.some(p => BoxContent[p].includes(e));
  }

  formatter(val: string) {
    if (!val) {
      return "unknown";
    }
    return formatFromEnumString(val);
  }

  protected readonly Gearlocs = Gearlocs;
  protected readonly Difficulty = Difficulty;
  protected readonly Tyrants = Tyrants;
}
