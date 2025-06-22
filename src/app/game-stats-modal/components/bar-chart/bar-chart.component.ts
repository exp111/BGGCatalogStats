import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
  // force full height
  host: {'class': 'h-100'}
})
export class BarChartComponent {
  @Input()
  title!: string;

  @Input()
  ratios!: [string, number][];
  protected readonly Math = Math;
}
