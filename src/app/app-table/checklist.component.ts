import {Component, Input} from '@angular/core';
import {TableComponent} from "./table.component";

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class ChecklistComponent extends TableComponent {
  protected override getValue(x: string, y: string) {
    return this.getter(x, y) ? "X" : "";
  }
}
