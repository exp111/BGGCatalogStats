import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() XAxis!: string[];
  @Input() YAxis!: string[];
  @Input() getter!: (x: string, y: string) => any;

  protected getValue(x: string, y: string) {
    return this.getter(x, y);
  }
}
