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
    ret.Gearloc = this.parseCustomFieldValuePlayer(backup, entry, gearlocField, Gearlocs);
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
      // tyrant
      obj.Tyrant = this.parseCustomFieldValuePlay(backup, play, tyrantField, Tyrants);
      // difficulty
      obj.Difficulty = this.parseCustomFieldValuePlay(backup, play, difficultyField, Difficulty);
      obj.Won = players.some(p => p.winner == 1)
      plays.push(obj);
    }
    ret.Plays = plays;
    return ret;
  }
}
