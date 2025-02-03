import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-month-selection',
  imports: [],
  templateUrl: './month-selection.component.html',
  styleUrl: './month-selection.component.scss'
})
export class MonthSelectionComponent {
  @Input()
  fromDate?: NgbDate;

  @Output()
  fromDateChange = new EventEmitter<NgbDate | null>();

  @Input()
  toDate?: NgbDate;

  @Output()
  toDateChange = new EventEmitter<NgbDate | null>();

  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  back() {
    if (this.selectedMonth == 0 && this.selectedYear == 0) {
      return;
    }
    this.selectedMonth -= 1;
    if (this.selectedMonth < 0) {
      this.selectedMonth = this.monthNames.length - 1;
      this.selectedYear -= 1;
    }
    this.setRange();
  }

  next() {
    this.selectedMonth += 1;
    if (this.selectedMonth >= this.monthNames.length) {
      this.selectedMonth = 0;
      this.selectedYear += 1;
    }
    this.setRange();
  }

  setRange() {
    this.fromDateChange.emit(new NgbDate(this.selectedYear, this.selectedMonth + 1, 1));
    // 0 gives last day of last month, therefore we need to add 1 to month
    let date = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    this.toDateChange.emit(new NgbDate(this.selectedYear, this.selectedMonth + 1, date.getDate()));
  }
}
