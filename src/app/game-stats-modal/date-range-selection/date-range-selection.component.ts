import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-date-range-selection',
  imports: [
    NgbInputDatepicker
  ],
  templateUrl: './date-range-selection.component.html',
  styleUrl: './date-range-selection.component.scss'
})
export class DateRangeSelectionComponent {
  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  hoveredDate: NgbDate | null = null;

  @Input()
  fromDate?: NgbDate;

  @Output()
  fromDateChange = new EventEmitter<NgbDate | null>();

  @Input()
  toDate?: NgbDate;

  @Output()
  toDateChange = new EventEmitter<NgbDate | null>();

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDateChange.emit(date);
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDateChange.emit(date);
    } else {
      this.toDateChange.emit(null);
      this.fromDateChange.emit(date);
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
