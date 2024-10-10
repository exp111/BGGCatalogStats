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
  protected override getValue(x: any, y: any) {
    return this.getter(x, y) ? "X" : "";
  }

  override getColumnClass(x: any) {
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

  override getRowClass(y: any) {
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

  override getCellClass(x: any, y: any) {
    return this.getter(x, y) ? "true" : "false";
  }
}
