import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {StatService} from "../services/stat.service";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  static GithubLink = "https://www.github.com/exp111/BGGCatalogStats";
  GithubLink = AppComponent.GithubLink;

  statService = inject(StatService);
  router = inject(Router);

  clearData() {
    this.statService.clearStats();
    this.router.navigateByUrl(this.router.url, {
      onSameUrlNavigation: "reload"
    });
  }
}
