import {Injectable} from '@angular/core';
import {BGGCatalogBackup, CustomFieldEntry, PlayerPlayEntry} from "../../../model/bgg-catalog";
import {formatToEnumString} from "../../enum-utils";
import {BaseBackupReaderService} from "../base-backup-reader.service";
import {
  Difficulty,
  Gearlocs,
  TMB_GAME_NAME,
  TooManyBonesPlay,
  TooManyBonesPlayer,
  TooManyBonesStats,
  Tyrants
} from "../../../model/too-many-bones";

@Injectable({
  providedIn: 'root'
})
export class TMBBackupReaderService extends BaseBackupReaderService {
  protected override enumNormalizers = {
    [Tyrants.END]: this.normalizeTyrantName
  }
  private normalizeTyrantName(str: string) {
    return {
      "GoblinK\xf6nig": "GoblinKing",
    }[str] ?? str;
  }

  private parsePlayer(entry: PlayerPlayEntry, backup: BGGCatalogBackup, gearlocField: CustomFieldEntry) {
    let ret = {} as TooManyBonesPlayer;
    // get player
    let player = backup.players.find(p => p.id == entry.playerId);
    if (!player) {
      console.error(`Player with id ${entry.playerId} not found`);
      return ret;
    }
    // name
    ret.Name = player.name;
    ret.IsMe = player.me == 1;
    // find hero
    let gearloc = this.getFieldValue(backup, gearlocField.id, entry.playId, entry.id);
    if (!gearloc) {
      console.error(`Gearloc field with id ${gearlocField.id} not found`);
      console.log(backup.plays.find(p => p.id == entry.playId));
      console.log(entry);
      return ret;
    }
    ret.Gearloc = this.parseEnumValue(Gearlocs, gearloc.value);
    if (ret.Gearloc == undefined) {
      console.error(`Gearloc Value ${formatToEnumString(gearloc.value)} can not be parsed`);
      return ret;
    }
    return ret;
  }

  public override parse(backup: BGGCatalogBackup) {
    let ret = {
      Plays: [],
      OwnedExpansions: []
    } as TooManyBonesStats;
    let plays = [];
    // get game id
    let game = backup.games.find(g => g.name == TMB_GAME_NAME);
    if (!game) {
      console.error("Game not found");
      return ret;
    }
    let owned = backup.games.filter(g => g.name.startsWith(TMB_GAME_NAME));
    ret.OwnedExpansions = owned.map(g => g.name);
    let gameId = game.id;
    // get custom data fields
    let gearlocField = this.findCustomField(backup, gameId, "Gearloc");
    let tyrantField = this.findCustomField(backup, gameId, "Tyrant");
    let difficultyField = this.findCustomField(backup, gameId, "Difficulty");
    if (!gearlocField || !tyrantField || !difficultyField) {
      console.error("Can't find custom fields");
      return ret;
    }
    // plays
    for (let play of backup.plays) {
      // only check game plays
      if (play.gameId != gameId) {
        continue;
      }
      let obj = {
        Id: play.id,
        Players: [] as TooManyBonesPlayer[],
      } as TooManyBonesPlay;
      // players
      let players = backup.playersPlays.filter(p => p.playId == play.id);
      for (let player of players) {
        obj.Players.push(this.parsePlayer(player, backup, gearlocField));
      }
      // scenario
      let tyrant = this.getFieldValue(backup, tyrantField.id, play.id);
      if (!tyrant) {
        console.error(`Tyrant with id ${tyrantField.id} not found`);
        console.log(play);
        return ret;
      }
      obj.Tyrant = this.parseEnumValue(Tyrants, tyrant.value);
      if (obj.Tyrant == undefined) {
        console.error(`Scenario Value ${formatToEnumString(tyrant.value)} can not be parsed`);
        return ret;
      }
      // difficulty
      let difficulty = this.getFieldValue(backup, difficultyField.id, play.id);
      if (!difficulty) {
        console.error(`Difficulty with id ${difficultyField.id} not found`);
        return ret;
      }
      obj.Difficulty = this.parseEnumValue(Difficulty, difficulty.value);
      if (obj.Difficulty == undefined) {
        console.error(`Difficulty Value ${formatToEnumString(difficulty.value)} can not be parsed`);
        return ret;
      }
      obj.Won = players.some(p => p.winner == 1)
      plays.push(obj);
    }
    ret.Plays = plays;
    return ret;
  }
}
