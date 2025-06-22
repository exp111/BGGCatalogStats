import {Injectable} from '@angular/core';
import {BGGCatalogBackup, BGGCatalogCustomFieldEntry, BGGCatalogPlayerPlayEntry} from "../../../model/bgg-catalog";
import {BaseBackupReaderService} from "../base-backup-reader.service";
import {
  BoxContent,
  Difficulty,
  Gearloc,
  TMB_GAME_ID,
  TooManyBonesPlay,
  TooManyBonesPlayer,
  TooManyBonesStats,
  Tyrant
} from "../../../model/too-many-bones";
import {BGStatsBackup, BGStatsPlayerScoreEntry} from "../../../model/bg-stats";

@Injectable({
  providedIn: 'root'
})
export class TMBBackupReaderService extends BaseBackupReaderService {
  protected override BaseGameBGGID = TMB_GAME_ID;
  public override GameContent = BoxContent;

  protected override enumNormalizers = {
    [Tyrant.END]: this.normalizeTyrantName
  }

  private normalizeTyrantName(str: string) {
    return {
      "GoblinK\xf6nig": "GoblinKing",
    }[str] ?? str;
  }

  protected override getEnumName(enums: any): string {
    switch (enums) {
      case Gearloc:
        return "Gearloc";
      case Tyrant:
        return "Tyrant";
      case Difficulty:
        return "Difficulty";
      default:
        return "Unknown";
    }
  }

  private parsePlayer(entry: BGGCatalogPlayerPlayEntry, backup: BGGCatalogBackup, gearlocField: BGGCatalogCustomFieldEntry) {
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
    // find gearloc
    ret.Gearloc = this.parseCustomFieldValuePlayer(backup, entry, Gearloc, gearlocField);
    return ret;
  }

  private parsePlayerBGStats(score: BGStatsPlayerScoreEntry, backup: BGStatsBackup) {
    let ret = {} as TooManyBonesPlayer;
    // get player
    let player = backup.players.find(p => p.id == score.playerRefId);
    if (!player) {
      console.error(`Player with id ${score.playerRefId} not found`);
      return ret;
    }
    // name
    ret.Name = player.name;
    ret.IsMe = backup.userInfo.meRefId == player.id;
    let role = this.getPlayerRoleBGStats(score);
    // find gearloc
    ret.Gearloc = this.parseFieldBGStats(role, Gearloc);
    return ret;
  }

  public override parseBGGCatalog(backup: BGGCatalogBackup) {
    let ret = {
      Plays: [],
      OwnedContent: []
    } as TooManyBonesStats;
    let plays = [];
    // get game id
    let game = this.findBaseGame(backup);
    if (!game) {
      return ret;
    }
    ret.OwnedContent = this.getOwnedContent(backup);
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
        ...this.parseBasePlayBGGCatalog(backup, play),
        Tyrant: this.parseCustomFieldValuePlay(backup, play, Tyrant, tyrantField),
        Difficulty: this.parseCustomFieldValuePlay(backup, play, Difficulty, difficultyField)
      } as TooManyBonesPlay;
      // players
      let players = backup.playersPlays.filter(p => p.playId == play.id);
      for (let player of players) {
        obj.Players.push(this.parsePlayer(player, backup, gearlocField));
      }
      plays.push(obj);
    }
    ret.Plays = plays;
    return ret;
  }

  public override parseBGStats(backup: BGStatsBackup) {
    let ret = {
      Plays: [],
      OwnedContent: []
    } as TooManyBonesStats;
    let plays = [];
    // get game id
    let game = this.findBaseGame(backup);
    if (!game) {
      return ret;
    }
    ret.OwnedContent = this.getOwnedContent(backup);
    let gameId = game.id;
    // plays
    for (let play of backup.plays) {
      // only check game plays
      if (play.gameRefId != gameId) {
        continue;
      }
      let obj = {
        ...this.parseBasePlayBGStats(backup, play),
        Players: play.playerScores.map(score => this.parsePlayerBGStats(score, backup)),
        Tyrant: this.parseFieldBGStats(play.board, Tyrant),
        Difficulty: this.parseFieldBGStats(play.board, Difficulty)
      } as TooManyBonesPlay;
      plays.push(obj);
    }
    ret.Plays = plays;
    return ret;
  }
}
