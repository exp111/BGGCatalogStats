import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseGameComponent} from "../base-game.component";
import {formatDurationMinutes} from "../../util/helper";
import {BaseGameStats} from "../../../model/base-game-stats";
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
  override exampleFileName = "viewer-example";

  protected override enumBeautifiers = {}

  constructor(protected backupService: ViewerBackupReaderService) {
    super(backupService);
  }
  protected readonly formatDurationMinutes = formatDurationMinutes;
}
