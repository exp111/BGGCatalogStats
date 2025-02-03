import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-year-selection',
  imports: [],
  templateUrl: './year-selection.component.html',
  styleUrl: './year-selection.component.scss'
})
export class YearSelectionComponent {
  @Input()
  fromDate?: NgbDate;

  @Output()
  fromDateChange = new EventEmitter<NgbDate | null>();

  @Input()
  toDate?: NgbDate;

  @Output()
  toDateChange = new EventEmitter<NgbDate | null>();

  selectedYear: number = new Date().getFullYear();

  back() {
    if (this.selectedYear == 0) {
      return;
    }
    this.selectedYear -= 1;
    this.setRange();
  }

  next() {
    this.selectedYear += 1;
    this.setRange();
  }

  setRange() {
    this.fromDateChange.emit(new NgbDate(this.selectedYear, 1, 1));
    // 0 gives last day of last month, therefore we need to add 1 to month
    let date = new Date(this.selectedYear, 12, 0);
    this.toDateChange.emit(new NgbDate(this.selectedYear, 12, date.getDate()));
  }
}
