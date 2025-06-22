import {Injectable} from '@angular/core';
import {BGGCatalogBackup, BGGCatalogCustomDataEntry, BGGCatalogCustomFieldEntry, BGGCatalogPlayEntry, BGGCatalogPlayerPlayEntry} from "../../model/bgg-catalog";
import {BaseGamePlay, BaseGamePlayer, BaseGameStats} from "../../model/base-game-stats";
import {formatToEnumString, getEnumValue} from "../util/enum-utils";
import {BGStatsBackup, BGStatsPlayEntry, BGStatsPlayerScoreEntry} from "../../model/bg-stats";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseBackupReaderService {
  private playFieldValueGetter = (backup: BGGCatalogBackup, field: BGGCatalogCustomFieldEntry, play: BGGCatalogPlayEntry) => this.getFieldValue(backup, field.id, play.id);
  private playerFieldValueGetter = (backup: BGGCatalogBackup, field: BGGCatalogCustomFieldEntry, play: BGGCatalogPlayerPlayEntry) => this.getFieldValue(backup, field.id, play.playId, play.id);

  /** Can contain enum normalizers that transform string names to their normalized enum value names.
   *  Allows support for localized or alternative enum value names.
   **/
  protected abstract enumNormalizers: { [end: number]: (e: string) => string };

  protected abstract BaseGameBGGID: number;
  public abstract GameContent: {[name: string]: any[]}

  constructor() {
    (window as any).backupReader = this;
  }

  protected findBaseGame(backup: BGGCatalogBackup | BGStatsBackup) {
    let game = backup.games.find(g => g.bggId == this.BaseGameBGGID);
    if (!game) {
      console.error("Game not found");
      return undefined;
    }
    return game;
  }

  protected getOwnedContent(backup: BGGCatalogBackup | BGStatsBackup) {
    let keys = Object.keys(this.GameContent);
    let ret = [];
    for (let key of keys) {
      if (backup.games.find(g => String(g.bggId) == key)) {
        ret.push(key);
      }
    }
    return ret;
  }

  /* Parses a string to an enum value of the given enum. Normalizes the name if a normalizer is in {@link enumNormalizers} */
  protected parseEnumValue(enums: any, str: string) {
    let endVal = enums["END"];
    if (!endVal) {
      console.error(`Can't find 'END' value for ${this.getEnumName(enums)}, value: ${str}`);
      endVal = -1;
    }
    let normalizer = this.enumNormalizers[endVal] ?? ((e: string) => e);
    return getEnumValue(enums, normalizer(formatToEnumString(str)))
  }

  /* Parses the value of a custom play field */
  protected parseCustomFieldValuePlay(backup: BGGCatalogBackup, play: BGGCatalogPlayEntry, enums: any, field: BGGCatalogCustomFieldEntry, multiField?: BGGCatalogCustomFieldEntry) {
    return this.parseCustomFieldValueGeneric(this.playFieldValueGetter, backup, play, enums, field, multiField);
  }

  /* Parses the value of a custom player field */
  protected parseCustomFieldValuePlayer(backup: BGGCatalogBackup, play: BGGCatalogPlayerPlayEntry, enums: any, field: BGGCatalogCustomFieldEntry, multiField?: BGGCatalogCustomFieldEntry) {
    return this.parseCustomFieldValueGeneric(this.playerFieldValueGetter, backup, play, enums, field, multiField);
  }

  private parseCustomFieldValueGeneric(getter: (_1: BGGCatalogBackup, _2: BGGCatalogCustomFieldEntry, _3: any) => BGGCatalogCustomDataEntry | undefined,
                                       backup: BGGCatalogBackup, play: BGGCatalogPlayEntry | BGGCatalogPlayerPlayEntry, enums: any, field: BGGCatalogCustomFieldEntry, multiField?: BGGCatalogCustomFieldEntry) {
    let entry = getter(backup, field, play);
    let multiEntry = multiField ? getter(backup, multiField, play) : undefined;
    if (!entry && !multiEntry) {
      console.error(`Custom field ${field.name} (${field.id}) not found`);
      return multiField ? [] : undefined;
    }
    // if its a multi field
    if (multiField) {
      // if the multi field has an entry, prioritize that over the single entry
      return multiEntry ? this.parseCustomFieldValues(multiEntry, enums) : [this.parseCustomFieldValue(entry!, enums)];
    } else {
      return this.parseCustomFieldValue(entry!, enums);
    }
  }

  protected parseCustomFieldValues(entry: BGGCatalogCustomDataEntry, enums: any) {
    let values = entry.value.split(",");
    let ret = [];
    for (let value of values) {
      let val = this.parseEnumValue(enums, value);
      if (val == undefined) {
        console.error(`Custom Field Value ${formatToEnumString(value)} for enum ${this.getEnumName(enums)} can not be parsed`);
        return ret;
      }
      ret.push(val);
    }
    return ret;
  }

  /* Parses the value of a custom field entry to the enum value */
  protected parseCustomFieldValue(entry: BGGCatalogCustomDataEntry, enums: any) {
    let val = this.parseEnumValue(enums, entry.value);
    if (val == undefined) {
      console.error(`Custom Field Value ${formatToEnumString(entry.value)} for enum ${this.getEnumName(enums)} can not be parsed`);
      return undefined;
    }
    return val;
  }

  //TODO: should these all be methods on backup/other classes?

  /* Gets the value of a custom field */
  protected getFieldValue(backup: BGGCatalogBackup, fieldId: number, entityId: number, playerId?: number) {
    return backup.customData.find(d => d.fieldId == fieldId
      && d.entityId == entityId
      && (playerId == null || d.playerId == playerId)
    );
  }

  /* Searches the backup for the given custom field entry */
  protected findCustomField(backup: BGGCatalogBackup, gameId: number, name: string) {
    return backup.customFields.find(p =>
      p.selectedGames.split(",").map(g => Number(g)).includes(gameId)
      && p.name.toLowerCase() == name.toLowerCase()
    );
  }

  protected getPlayerRoleBGStats(score: BGStatsPlayerScoreEntry) {
    return score.role || score.teamRole || "";
  }

  protected parseFieldBGStats(role: string | undefined, enums: any, multi: boolean = false) {
    // try to find any entry in the roles that matches an entry in the enum
    let val = role?.split("\uff0f").map(r => this.parseEnumValue(enums, r)).filter(r => r != null);
    if (val == undefined || val.length == 0) {
      console.error(`Custom Field Value ${role} for enum ${this.getEnumName(enums)} can not be parsed`);
      return multi ? [] : undefined;
    }
    return multi ? val : val[0];
  }

  protected parseBasePlayBGGCatalog(backup: BGGCatalogBackup, play: BGGCatalogPlayEntry) {
    return {
      Id: String(play.id),
      Players: [],
      Duration: play.length,
      Won: backup.playersPlays.filter(p => p.playId == play.id).some(p => p.winner == 1),
      Notes: play.notes ?? "",
      Timestamp: play.playDate,
      Location: backup.locations.find(l => l.id == play.locationId)?.name,
    } as BaseGamePlay;
  }

  protected parseBasePlayBGStats(backup: BGStatsBackup, play: BGStatsPlayEntry) {
    return {
      Id: play.uuid,
      Players: [],
      Duration: play.durationMin,
      Won: play.playerScores.some(p => p.winner),
      Notes: play.comments ?? "",
      Timestamp: play.playDate,
      Location: backup.locations.find(l => l.id == play.locationRefId)?.name,
    } as BaseGamePlay;
  }

  protected abstract getEnumName(enums: any): string;

  /* Parses the backup to a parser specific game stats model */
  public abstract parseBGGCatalog(backup: BGGCatalogBackup): BaseGameStats;
  public abstract parseBGStats(backup: BGStatsBackup): BaseGameStats;
}
