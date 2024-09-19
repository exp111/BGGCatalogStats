import { Component } from '@angular/core';
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.css'
})
export class HelpPageComponent {
  static Title = 'Help';
  GithubLink = AppComponent.GithubLink;
}
