import { Component } from '@angular/core';
import {MC_GAME_NAME} from "../../model/marvel-champions";
import {TMB_GAME_NAME} from "../../model/too-many-bones";
import {BGGCatalogBackup} from "../../model/bgg-catalog";

@Component({
  selector: 'app-make-example',
  standalone: true,
  imports: [],
  templateUrl: './make-example.component.html',
  styleUrl: './make-example.component.css'
})
export class MakeExampleComponent {
  static Title = "Make Example";

  do() {
    let dummyDate = "1970-01-01 00:00:00";
    let radio = document.querySelector('input[name="game"]:checked') as HTMLInputElement;
    let baseGameName = "";
    switch (radio.value) {
      case "MC": {
        baseGameName = MC_GAME_NAME;
        break;
      }
      case "TMB": {
        baseGameName = TMB_GAME_NAME;
        break;
      }
    }
    console.log(baseGameName);
    let fileEl = document.getElementById("file") as HTMLInputElement;
    let file = fileEl.files![0];
    console.log(file);
    file.text().then(t => {
      let example = {} as BGGCatalogBackup;
      let json = JSON.parse(t) as BGGCatalogBackup;
      console.log(json);
      // games
      example.games = json.games.filter(g => g.name.startsWith(baseGameName)).map(g => {
        g.addedDate = dummyDate;
        return g;
      });
      let gameId = example.games.find(g => g.name == baseGameName)!.id;
      // plays
      example.plays = json.plays.filter(p => p.gameId == gameId).map(p => {
        p.playDate = dummyDate;
        p.notes = "";
        return p;
      });
      // Players
      let playerCount = 1;
      example.players = json.players.filter(p =>
        json.playersPlays.some(play =>
          play.playerId == p.id
          && example.plays.some(ePlays => play.playId == ePlays.id)) // is in any game play
      ).map(p => {
        p.name = p.me ? "Me" : `Player ${playerCount++}`;
        p.bggUsername = "";
        return p;
      });
      // player plays
      example.playersPlays = json.playersPlays.filter(p => example.players.some(player => p.playerId == player.id) // player in any game play
        && example.plays.some(play => play.id == p.playId)); // play is game play
      example.locations = [];
      example.customFields = json.customFields.filter(f => f.selectedGames.split(",").includes(String(gameId)));
      example.customData = json.customData.filter(d => example.customFields.some(f => f.id == d.fieldId));
      console.log(JSON.stringify(example));
      // dl
      let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(example));
      let dlAnchorElem = document.createElement("a");
      dlAnchorElem.setAttribute("href",     dataStr     );
      dlAnchorElem.setAttribute("download", `${radio.value.toLowerCase()}-example.json`);
      document.body.appendChild(dlAnchorElem); // required for firefox
      dlAnchorElem.click();
      dlAnchorElem.remove();
    })
  }
}
