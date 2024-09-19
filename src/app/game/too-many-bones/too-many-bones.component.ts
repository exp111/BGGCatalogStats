import {Component} from '@angular/core';
import {ChecklistComponent} from "../../app-table/checklist.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "../../app-table/table.component";
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
import {getEnumValue} from "../../enum-utils";

@Component({
  selector: 'app-marvel-champions',
  standalone: true,
  imports: [
    ChecklistComponent,
    ReactiveFormsModule,
    TableComponent,
    FormsModule,
  ],
  templateUrl: './too-many-bones.component.html',
  styleUrl: './too-many-bones.component.css'
})
export class TooManyBonesComponent extends BaseGameComponent {
  static override Title = 'Too Many Bones Stats';
  declare stats?: TooManyBonesStats;

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

  gearlocPlayrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let gearloc = getEnumValue(Gearlocs, y);
    let gearlocPlays = plays.filter(p => this.playHasGearloc(p, gearloc));
    return this.getRate(plays.length, gearlocPlays.length);
  }

  tyrantPlayrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let tyrant = getEnumValue(Tyrants, y);
    let tyrantPlays = plays.filter(p => p.Tyrant == tyrant);
    return this.getRate(plays.length, tyrantPlays.length);
  }

  gearlocWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let gearloc = getEnumValue(Gearlocs, y);
    let gearlocPlays = plays.filter(p => this.playHasGearloc(p, gearloc));
    let wins = this.getWins(gearlocPlays);
    return this.getRate(gearlocPlays.length, wins);
  }

  tyrantWinrateGetter(_: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let tyrant = getEnumValue(Tyrants, y);
    let tyrantPlays = plays.filter(p => p.Tyrant == tyrant);
    let wins = this.getWins(tyrantPlays);
    return this.getRate(tyrantPlays.length, wins);
  }

  tyrantGearlocWinrateGetter(x: string, y: string) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let tyrant = getEnumValue(Tyrants, x);
    let gearloc = getEnumValue(Gearlocs, y);
    let tyrantPlays = plays.filter(p => p.Tyrant == tyrant && this.playHasGearloc(p, gearloc));
    let wins = this.getWins(tyrantPlays);
    return this.getRate(tyrantPlays.length, wins);
  }

  tyrantGearlocWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let tyrant = getEnumValue(Tyrants, x);
    let gearloc = getEnumValue(Gearlocs, y);
    return plays.some(p => p.Won && p.Tyrant == tyrant && this.playHasGearloc(p, gearloc));
  }

  tyrantDifficultyWonGetter(x: string, y: string) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    let tyrant = getEnumValue(Tyrants, x);
    let difficulty = getEnumValue(Difficulty, y);
    return plays.some(p => p.Won && p.Tyrant == tyrant && p.Difficulty == difficulty);
  }

  protected override ownedCheck(e: any) {
    return this.stats?.OwnedExpansions.some(p => BoxContent[p].includes(e)) ?? false;
  }

  protected readonly Gearlocs = Gearlocs;
  protected readonly Difficulty = Difficulty;
  protected readonly Tyrants = Tyrants;
}
