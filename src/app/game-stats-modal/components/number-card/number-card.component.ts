import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-number-card',
  imports: [],
  templateUrl: './number-card.component.html',
  styleUrl: './number-card.component.scss'
})
export class NumberCardComponent {
  @Input()
  title!: string;

  @Input()
  subtitle!: string;
}
