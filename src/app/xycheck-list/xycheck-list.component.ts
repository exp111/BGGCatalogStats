import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-xycheck-list',
  standalone: true,
  imports: [],
  templateUrl: './xycheck-list.component.html',
  styleUrl: './xycheck-list.component.css'
})
export class XYCheckListComponent {
  @Input() XAxis!: string[];
  @Input() YAxis!: string[];
  @Input() getter!: (x: string, y: string) => boolean;
}
