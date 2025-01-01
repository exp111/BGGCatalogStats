import {Component} from '@angular/core';
import {BGStatsExport} from "../../model/bg-stats";

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css'
})
export class ConverterComponent {
  loadExample() {
    fetch(`./example/mc-example.json`).then(r => r.text()).then(t => this.readFile(t));
  }

  onFileLoad(event: Event & { target: HTMLInputElement }) {
    const files = event.target.files;
    if (files?.length != null && files?.length > 0) {
      const file = files[0];
      file.text().then((f) => this.readFile(f));
    }
  }

  public readFile(text: string) {
    let backup = JSON.parse(text);
    // we export the plays as a bgsplay file, cause then we dont have to deal with the correct play/location/user formatting
    let output: BGStatsExport = {
      about: "",
      games: [],
      locations: [],
      players: [],
      plays: [],
      userInfo: {
        meRefId: 0 //TODO:
      }
    };
    //TODO: do
    this.saveFile("export.bgsplay", JSON.stringify(output, null, 2));
  }

  saveFile(fileName: string, data: string) {
    const blob = new Blob([data], {type: "text/csv"});
    const blobUrl = URL.createObjectURL(blob);
    const aElement = document.createElement('a');
    aElement.href = blobUrl;
    aElement.download = fileName;
    aElement.style.display = 'none';
    document.body.appendChild(aElement);
    aElement.click();
    URL.revokeObjectURL(blobUrl);
    aElement.remove();
  }
}
