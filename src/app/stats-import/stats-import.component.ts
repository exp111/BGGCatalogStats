import {Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {StatService} from "../../services/stat.service";
import { StatTool } from '../../model/stats';
import {Router} from "@angular/router";

@Component({
  selector: 'app-stats-import',
  imports: [
    FormsModule
  ],
  templateUrl: './stats-import.component.html',
  styleUrl: './stats-import.component.scss'
})
export class StatsImportComponent {
  selectedTool = StatTool.BG_STATS;

  @Input()
  redirect = "";

  constructor(private stats: StatService,
              private router: Router) {
    if (this.stats.hasStats) {
      this.selectedTool = this.stats.stats!.selectedTool;
    }
  }

  onFileLoad(event: Event & { target: HTMLInputElement }) {
    console.log(`Got file ${event?.target?.value}.`);
    const files = event.target.files;
    if (files?.length != null && files?.length > 0) {
      const file = files[0];
      file.text().then((f) => this.readFile(f));
    }
  }

  loadExample() {
    console.log("Loading example");
    fetch(`./example/${this.selectedTool}-example.json`).then(r => r.text()).then(t => this.readFile(t));
  }

  readFile(data: string) {
    this.stats.saveStats(this.selectedTool, JSON.parse(data));
    this.routeBack();
  }

  routeBack() {
    this.router.navigateByUrl(this.redirect ? this.redirect : '/');
  }

  protected readonly StatTool = StatTool;
}
