import {Component} from '@angular/core';
import {BGStatsExport, BGStatsGameEntry, BGStatsLocationEntry, BGStatsPlayerEntry} from "../../model/bg-stats";
import {
  BGGCatalogBackup,
  BGGCatalogGameEntry,
  BGGCatalogLocationEntry,
  BGGCatalogPlayerEntry
} from "../../model/bgg-catalog";
import getUuidByString from "uuid-by-string";

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

  // bg stats uuids are standard format
  makeUUID(name: string) {
    return getUuidByString(name).toUpperCase();
  }

  getDate() {
    return "2025-01-01 14:30:00"
  }

  makeGame(game: BGGCatalogGameEntry): BGStatsGameEntry {
    return {
      bggId: game.bggId,
      bggName: game.name,
      bggYear: game.yearPublished,
      id: game.id,
      uuid: this.makeUUID(game.name)
    }
  }

  makePlayer(player: BGGCatalogPlayerEntry): BGStatsPlayerEntry {
    return {
      id: player.id,
      bggUsername: player.bggUsername ?? "",
      isAnonymous: player.isAnonymous == 1,
      metaData: `{"isNpc":0}`,
      modificationDate: this.getDate(),
      name: player.name,
      uuid: this.makeUUID(player.name)
    }
  }

  makeLocation(loc: BGGCatalogLocationEntry): BGStatsLocationEntry {
    return {
      id: loc.id,
      name: loc.name,
      modificationDate: this.getDate(),
      uuid: this.makeUUID(loc.name)
    }
  }

  makePlays(backup: BGGCatalogBackup) {

  }

  public readFile(text: string) {
    let backup: BGGCatalogBackup = JSON.parse(text);
    // we export the plays as a bgsplay file, cause then we dont have to deal with the correct play/location/user formatting
    let output: BGStatsExport = {
      about: "", //TODO: needed?
      games: backup.games.map(g => this.makeGame(g)),
      locations: backup.locations.map(g => this.makeLocation(g)),
      players: backup.players.map(g => this.makePlayer(g)),
      plays: this.makePlays(backup),
      userInfo: {
        meRefId: backup.players.find(p => p.me == 1)?.id ?? -1
      }
    };
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
