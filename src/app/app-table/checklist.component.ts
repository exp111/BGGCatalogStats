import {Component} from '@angular/core';
import {TableComponent} from "./table.component";

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './checklist.component.css'
})
export class ChecklistComponent extends TableComponent {
  protected override getValue(x: string, y: string) {
    return this.getter(x, y) ? "X" : "";
  }

  override getColumnClass(x: string) {
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

  override getRowClass(y: string) {
    let empty = true;
    let full = true;
    for (let x of this.XAxis) {
      if (!this.getter(x, y)) {
        full = false;
      } else {
        empty = false;
      }
    }
    return full ? "full" : empty ? "empty" : "incomplete";
  }

  override getCellClass(x: string, y: string) {
    return this.getter(x, y) ? "true" : "false";
  }
}
