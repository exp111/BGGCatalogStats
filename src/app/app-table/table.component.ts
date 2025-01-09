import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-table',
    imports: [],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent {
  //TODO: cache + listen to ngonchanges

  // items on the x axis
  @Input() XAxis!: any[];
  // formatter for the x axis headers
  @Input() XFormatter?: (x: any) => string;
  // items on the y axis
  @Input() YAxis!: any[];
  // formatter for the y axis headers
  @Input() YFormatter?: (y: any) => string;
  // gets the value of the cells at (x,y)
  @Input() getter!: (x: any, y: any) => any;
  @Input() columnClassGetter?: (x: any) => string;
  @Input() rowClassGetter?: (y: any) => string;
  @Input() cellClassGetter?: (value: any) => string;

  protected getValue(x: number, y: number) {
    return this.getter(x, y);
  }

  protected getXHeader(x: number) {
    return this.XFormatter ? this.XFormatter(x) : x;
  }

  protected getYHeader(y: number) {
    return this.YFormatter ? this.YFormatter(y) : y;
  }

  protected getColumnClass(x: number) {
    return this.columnClassGetter ? this.columnClassGetter(x) : "";
  }

  protected getRowClass(y: number) {
    return this.rowClassGetter ? this.rowClassGetter(y) : "";
  }

  protected getCellClass(x: number, y: number) {
    return this.cellClassGetter ? this.cellClassGetter(this.getValue(x, y)) : "";
  }
}
