import {Component} from '@angular/core';
import {
  BGStatsExport,
  BGStatsGameEntry,
  BGStatsLocationEntry,
  BGStatsPlayEntry,
  BGStatsPlayerEntry, BGStatsPlayerScoreEntry
} from "../../model/bg-stats";
import {
  BGGCatalogBackup, BGGCatalogCustomDataEntry,
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
      name: game.name,
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

  makeCustomData(entries: BGGCatalogCustomDataEntry[]) {
    return entries
      // flat map all entries. if the value contains a ",", then its a mult field, so split it
      .flatMap(d => d.value.includes(",") ? d.value.split(",") : d.value)
      // trim any whitespace
      .map(v => v.trim())
      // seperate with bgstats seperator (weird unicode /)
      .join("\uff0f");
  }

  makePlays(backup: BGGCatalogBackup): BGStatsPlayEntry[] {
    return backup.plays.map(p => {
      let customData = backup.customData.filter(d => d.entityId === p.id);
      let playerPlays = backup.playersPlays.filter(ppl => ppl.playId == p.id);
      let date = new Date(p.playDate);
      return {
        board: this.makeCustomData(customData.filter(d => d.playerId == null)),
        gameRefId: p.gameId,
        ignored: p.noInStats == 1,
        expansionPlays: [],
        uuid: this.makeUUID(`play${p.id}`),
        durationMin: p.length,
        locationRefId: p.locationId,
        playDate: p.playDate,
        playDateYmd: Number(`${String(date.getFullYear()).padStart(4, "0")}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`),
        entryDate: p.playDate,
        modificationDate: p.playDate, // set to play date
        usesTeams: playerPlays.some(ppl => ppl.team != null),
        manualWinner: false, //?
        scoringSetting: 0, //?
        rounds: 0,
        playerScores: playerPlays.map(ppl => {
          let obj: BGStatsPlayerScoreEntry = {
            newPlayer: false, //TODO: newPlayer
            playerRefId: ppl.playerId,
            rank: 0,
            role: this.makeCustomData(customData.filter(d => d.playerId == ppl.id)),
            score: `${ppl.score ?? ""}`,
            seatOrder: ppl.seatOrder ?? 0,
            startPlayer: ppl.startPlayer == 1,
            winner: ppl.winner == 1,
            team: `${ppl.team ?? ""}`
          };
          return obj;
        })
      }
    })
  }

  public readFile(text: string) {
    let backup: BGGCatalogBackup = JSON.parse(text);
    // we export the plays as a bgsplay file, cause then we dont have to deal with the correct play/location/user formatting
    let output: BGStatsExport = {
      about: "", //TODO: needed?
      // only add games which have plays
      games: backup.games.filter(g => backup.plays.some(p => p.gameId == g.id)).map(g => this.makeGame(g)),
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
