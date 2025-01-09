import { Component } from '@angular/core';
import {AppComponent} from "../app.component";

@Component({
    selector: 'app-help-page',
    imports: [],
    templateUrl: './help-page.component.html',
    styleUrl: './help-page.component.scss'
})
export class HelpPageComponent {
  static Title = 'Help';
  GithubLink = AppComponent.GithubLink;
}
