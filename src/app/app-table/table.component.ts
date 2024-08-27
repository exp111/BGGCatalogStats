import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  //TODO: cache + listen to ngonchanges
  @Input() XAxis!: string[];
  @Input() YAxis!: string[];
  @Input() getter!: (x: string, y: string) => any;
  @Input() columnClassGetter?: (x: string) => string;
  @Input() rowClassGetter?: (y: string) => string;
  @Input() cellClassGetter?: (value: any) => string;

  protected getValue(x: string, y: string) {
    return this.getter(x, y);
  }

  protected getColumnClass(x: string) {
    return this.columnClassGetter ? this.columnClassGetter(x) : "";
  }

  protected getRowClass(y: string) {
    return this.rowClassGetter ? this.rowClassGetter(y) : "";
  }

  protected getCellClass(x: string, y: string) {
    return this.cellClassGetter ? this.cellClassGetter(this.getValue(x, y)) : "";
  }
}