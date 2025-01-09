import { Component } from '@angular/core';
import {MC_GAME_ID, PackContent} from "../../model/marvel-champions";
import {BoxContent, TMB_GAME_ID} from "../../model/too-many-bones";
import {BGGCatalogBackup} from "../../model/bgg-catalog";

@Component({
  selector: 'app-make-example',
  standalone: true,
  imports: [],
  templateUrl: './make-example.component.html',
  styleUrl: './make-example.component.scss'
})
export class MakeExampleComponent {
  static Title = "Make Example";
  dummyDate = "1970-01-01 00:00:00";

  do() {
    let toolRadio = document.querySelector('input[name="tool"]:checked') as HTMLInputElement;
    let gameRadio = document.querySelector('input[name="game"]:checked') as HTMLInputElement;
    let baseGameBGGID = -1;
    let content: Record<number, number[]>;
    switch (gameRadio.value) {
      case "MC": {
        baseGameBGGID = MC_GAME_ID;
        content = PackContent;
        break;
      }
      case "TMB": {
        baseGameBGGID = TMB_GAME_ID;
        content = BoxContent;
        break;
      }
      default:
        alert("Unknown game");
        return;
    }
    console.log("Game ID:");
    console.log(baseGameBGGID);
    console.log("Content:");
    console.log(content!);
    let fileEl = document.getElementById("file") as HTMLInputElement;
    let file = fileEl.files![0];
    console.log("Raw File:");
    console.log(file);
    file.text().then(text => {
      let example: Object;
      switch (toolRadio.value) {
        case "BGGCatalog":
          example = this.makeBGGCatalog(text, baseGameBGGID, content);
          break;
        case "BGStats":

          break;
        default:
          alert("Unknown tool");
          return;
      }
      // output
      console.log("Example:");
      console.log(example!);
      let jsonStr = JSON.stringify(example!);
      console.log(jsonStr);
      let output = document.querySelector('textarea[id="output"]') as HTMLTextAreaElement;
      output.innerText = JSON.stringify(example!, null, 2);
      let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
      this.downloadFile(`${toolRadio.value.toLowerCase()}-example.json`, dataStr);
    });
  }

  makeBGGCatalog(t: string, baseGameBGGID: number, content: Record<number, number[]>) {
    let example = {} as BGGCatalogBackup;
    let json = JSON.parse(t) as BGGCatalogBackup;
    console.log("Json:");
    console.log(json);
    // games
    example.games = json.games.filter(g => Object.keys(content).includes(String(g.bggId))).map(g => {
      g.addedDate = this.dummyDate;
      return g;
    });
    let gameId = example.games.find(g => g.bggId == baseGameBGGID)!.id;
    // plays
    example.plays = json.plays.filter(p => p.gameId == gameId).map(p => {
      p.playDate = this.dummyDate;
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
    return example;
  }

  downloadFile(fileName: string, dataStr: string) {
    let dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", fileName);
    document.body.appendChild(dlAnchorElem); // required for firefox
    dlAnchorElem.click();
    dlAnchorElem.remove();
  }
}
