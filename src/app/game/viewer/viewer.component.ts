import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseGameComponent} from "../base-game.component";
import {formatDurationMinutes} from "../../util/helper";
import {ViewerBackupReaderService} from "../../backup-reader/viewer/viewer-backup-reader.service";
import {BaseUploadSelectionComponent} from "../../base-upload-selection/base-upload-selection.component";
import {ViewerPlay, ViewerStats} from "../../../model/viewer";

@Component({
  selector: 'app-viewer',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BaseUploadSelectionComponent,
  ],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss'
})
export class ViewerComponent extends BaseGameComponent<ViewerStats, ViewerPlay> {
  static override Title = 'Play Viewer';
  override exampleFileName = "mc-example";

  protected override enumBeautifiers = {}

  filterText = "";
  sort = "name";
  sortAscending = true;

  constructor(protected backupService: ViewerBackupReaderService) {
    super(backupService);
  }

  protected override getPlays(stats: ViewerStats): ViewerPlay[] {
    return super.getPlays(stats)
      .filter(play => this.filterText.trim() ? eval(this.filterText) : play)
      .sort((a, b) => {
        switch (this.sort) {
          default:
          case "Name":
            return a.Game.localeCompare(b.Game);
          case "Date":
            return a.Timestamp.localeCompare(b.Timestamp);
        }
      });
  }

  protected readonly formatDurationMinutes = formatDurationMinutes;
}
