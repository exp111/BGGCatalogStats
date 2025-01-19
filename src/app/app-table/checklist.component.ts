import {Component, Input} from '@angular/core';
import {TableComponent} from "./table.component";

export enum ChecklistState {
  Empty,
  Incomplete,
  Check,
}

@Component({
    selector: 'app-checklist',
    imports: [],
    templateUrl: './table.component.html',
    styleUrl: './checklist.component.scss'
})
export class ChecklistComponent extends TableComponent {
  @Input()
  showPercentage = true;

  override getYHeader(y: number) {
    let val = super.getYHeader(y);
    return this.showPercentage ? `${val} (${this.getYPercentage(y)})` : val;
  }

  override getXHeader(x: number) {
    let val = super.getXHeader(x);
    return this.showPercentage ? `${val} (${this.getXPercentage(x)})` : val;
  }

  getYPercentage(y: number) {
    return this.getPercentage(this.XAxis.map(x => this.getter(x, y)));
  }

  getXPercentage(x: number) {
    return this.getPercentage(this.YAxis.map(y => this.getter(x, y)));
  }

  getPercentage(states: ChecklistState[]) {
    let val = 0;
    for (let state of states) {
      if (state == ChecklistState.Check) {
        val += 1;
      }
    }
    return `${((val / states.length) * 100).toFixed(0)}%`;
  }

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
