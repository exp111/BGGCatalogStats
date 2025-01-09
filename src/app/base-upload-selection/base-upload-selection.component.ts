import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-base-upload-selection',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './base-upload-selection.component.html',
  styleUrl: './base-upload-selection.component.scss'
})
export class BaseUploadSelectionComponent {
  @Input()
  title: string = "Title";

  @Input()
  selectedTool!: string;
  @Output()
  selectedToolChange = new EventEmitter<string>();

  @Output()
  loadExample = new EventEmitter();
  @Output()
  onFileLoad = new EventEmitter<Event & { target: HTMLInputElement }>();
}
