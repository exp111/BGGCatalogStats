import {Component} from '@angular/core';
import {TableComponent} from "./table.component";

export enum ChecklistState {
  Empty,
  Incomplete,
  Check,
}

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './checklist.component.scss'
})
export class ChecklistComponent extends TableComponent {
  protected override getValue(x: any, y: any) {
    switch (this.getter(x, y)) {
      default:
      case ChecklistState.Empty:
        return "";
      case ChecklistState.Incomplete:
        return "\u2717";
      case ChecklistState.Check:
        return "\u2713";
    }
  }

  override getColumnClass(x: any) {
    let empty = true;
    let full = true;
    for (let y of this.YAxis) {
      let val = this.getter(x, y);
      if (val != ChecklistState.Check) {
        full = false;
      } else {
        if (val != ChecklistState.Empty) {
          empty = false;
        }
      }
    }
    return full ? "full" : empty ? "empty" : "incomplete";
  }

  override getRowClass(y: any) {
    let empty = true;
    let full = true;
    for (let x of this.XAxis) {
      let val = this.getter(x, y);
      if (val != ChecklistState.Check) {
        full = false;
      } else {
        if (val != ChecklistState.Empty) {
          empty = false;
        }
      }
    }
    return full ? "full" : empty ? "empty" : "incomplete";
  }

  override getCellClass(x: any, y: any) {
    switch (this.getter(x, y)) {
      case ChecklistState.Check:
        return "check";
      case ChecklistState.Incomplete:
        return "incomplete";
      case ChecklistState.Empty:
        return "empty";
      default:
        return "";
    }
  }
}
