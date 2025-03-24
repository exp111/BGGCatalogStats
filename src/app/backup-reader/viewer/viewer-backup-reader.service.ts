import {Injectable} from '@angular/core';
import {BGGCatalogBackup, BGGCatalogPlayerPlayEntry} from "../../../model/bgg-catalog";
import {BaseBackupReaderService} from "../base-backup-reader.service";
import {BGStatsBackup, BGStatsPlayerScoreEntry} from "../../../model/bg-stats";
import {ViewerPlay, ViewerPlayer, ViewerStats} from "../../../model/viewer";

@Injectable({
  providedIn: 'root'
})
export class ViewerBackupReaderService extends BaseBackupReaderService {
  enumNormalizers = {};
  BaseGameBGGID = 0;
  GameContent = {};

  protected override getEnumName(enums: any): string {
    return "Unknown";
  }

  private parsePlayer(entry: BGGCatalogPlayerPlayEntry, backup: BGGCatalogBackup) {
    let ret = {} as ViewerPlayer;
    // get player
    let player = backup.players.find(p => p.id == entry.playerId);
    if (!player) {
      console.error(`Player with id ${entry.playerId} not found`);
      return ret;
    }
    // name
    ret.Name = player.name;
    ret.IsMe = player.me == 1;
    let roles = backup.customData.filter(d => d.entityId == entry.playId && d.playerId == entry.id)
    ret.Roles = roles.map(d => String(d.value));
    return ret;
  }

  private parsePlayerBGStats(score: BGStatsPlayerScoreEntry, backup: BGStatsBackup) {
    let ret = {} as ViewerPlayer;
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
    ret.Roles = role?.split("\uff0f");
    return ret;
  }

  public override parseBGGCatalog(backup: BGGCatalogBackup) {
    let ret = {
      Plays: [],
      OwnedContent: []
    } as ViewerStats;
    let plays = [];
    // plays
    for (let play of backup.plays) {
      let game = backup.games.find(g => g.id == play.gameId);
      let obj = {
        Game: game?.name,
        GameId: game?.bggId,
        Id: String(play.id),
        Duration: play.length,
        Notes: play.notes,
        Players: [],
        Timestamp: play.playDate,
        Won: false,
        Data: backup.customData.filter(d => d.entityId == play.id && d.playerId == null).map(d => d.value)
      } as ViewerPlay;
      // players
      let players = backup.playersPlays.filter(p => p.playId == play.id);
      for (let player of players) {
        obj.Players.push(this.parsePlayer(player, backup));
      }
      obj.Won = players.some(p => p.winner == 1)
      plays.push(obj);
    }
    ret.Plays = plays;
    return ret;
  }

  public override parseBGStats(backup: BGStatsBackup) {
    let ret = {
      Plays: [],
      OwnedContent: []
    } as ViewerStats;
    let plays = [];
    // plays
    for (let play of backup.plays) {
      let game = backup.games.find(g => g.id == play.gameRefId);
      let obj = {
        Game: game?.name,
        GameId: game?.bggId,
        Id: play.uuid,
        Duration: play.durationMin,
        Notes: "", //TODO: notes
        Players: play.playerScores.map(score => this.parsePlayerBGStats(score, backup)),
        Timestamp: play.playDate,
        Won: play.playerScores.some(p => p.winner),
        Data: play.board?.split("\uff0f")
      } as ViewerPlay;
      plays.push(obj);
    }
    ret.Plays = plays;
    return ret;
  }
}
