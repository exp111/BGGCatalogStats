import {Component, Input} from '@angular/core';
import {TableComponent} from "./table.component";

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.css'
})
export class ChecklistComponent extends TableComponent {
  protected override getValue(x: string, y: string) {
    return this.getter(x, y) ? "X" : "";
  }

  getRowClass(x: string) {
    let empty = true;
    let full = true;
    for (let y of this.YAxis) {
      if (!this.getter(x, y)) {
        full = false;
      } else {
        empty = false;
      }
    }
    return full ? "full" : empty ? "empty" : "incomplete";
  }
}
