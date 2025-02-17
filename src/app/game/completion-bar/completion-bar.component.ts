import {Component, Input} from '@angular/core';
import {NgbProgressbar, NgbProgressbarStacked, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'completion-bar',
  imports: [
    NgbProgressbarStacked,
    NgbProgressbar,
    NgbTooltip
  ],
  templateUrl: './completion-bar.component.html',
  styleUrl: './completion-bar.component.scss'
})
export class CompletionBarComponent {
  @Input({required: true})
  title!: string;

  @Input({required: true})
  played!: number;

  @Input({required: true})
  owned!: number;
}
