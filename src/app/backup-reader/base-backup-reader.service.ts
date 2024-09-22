import {Injectable} from '@angular/core';
import {BGGCatalogBackup, CustomDataEntry, CustomFieldEntry, PlayEntry, PlayerPlayEntry} from "../../model/bgg-catalog";
import {BaseGameStats} from "../../model/base-game-stats";
import {formatToEnumString, getEnumValue} from "../enum-utils";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseBackupReaderService {
  constructor() {
    (window as any).backupReader = this;
  }

  /** Can contain enum normalizers that transform string names to their normalized enum value names.
   *  Allows support for localized or alternative enum value names.
   **/
  protected abstract enumNormalizers: { [end: number]: (e: string) => string };

  /* Parses a string to an enum value of the given enum. Normalizes the name if a normalizer is in {@link enumNormalizers} */
  protected parseEnumValue(enums: any, str: string) {
    let endVal = enums["END"];
    if (!endVal) {
      console.error(`Can't find 'END' value for ${enums}, value: ${str}`);
      endVal = -1;
    }
    let normalizer = this.enumNormalizers[endVal] ?? ((e: string) => e);
    return getEnumValue(enums, normalizer(formatToEnumString(str)))
  }

  private playFieldValueGetter = (backup: BGGCatalogBackup, field: CustomFieldEntry, play: PlayEntry) => this.getFieldValue(backup, field.id, play.id);
  private playerFieldValueGetter = (backup: BGGCatalogBackup, field: CustomFieldEntry, play: PlayerPlayEntry) => this.getFieldValue(backup, field.id, play.playId, play.id);

  /* Parses the value of a custom play field */
  protected parseCustomFieldValuePlay(backup: BGGCatalogBackup, play: PlayEntry, enums: any, field: CustomFieldEntry, multiField?: CustomFieldEntry) {
    return this.parseCustomFieldValueGeneric(this.playFieldValueGetter, backup, play, enums, field, multiField);
  }

  /* Parses the value of a custom player field */
  protected parseCustomFieldValuePlayer(backup: BGGCatalogBackup, play: PlayerPlayEntry, enums: any, field: CustomFieldEntry, multiField?: CustomFieldEntry) {
    return this.parseCustomFieldValueGeneric(this.playerFieldValueGetter, backup, play, enums, field, multiField);
  }

  private parseCustomFieldValueGeneric(getter: (_1: BGGCatalogBackup, _2: CustomFieldEntry, _3: any) => CustomDataEntry | undefined,
                                       backup: BGGCatalogBackup, play: PlayEntry | PlayerPlayEntry, enums: any, field: CustomFieldEntry, multiField?: CustomFieldEntry) {
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

  protected parseCustomFieldValues(entry: CustomDataEntry, enums: any) {
    let values = entry.value.split(",");
    let ret = [];
    for (let value of values) {
      let val = this.parseEnumValue(enums, value);
      if (val == undefined) {
        console.error(`Custom Field Value ${formatToEnumString(value)} can not be parsed`);
        return ret;
      }
      ret.push(val);
    }
    return ret;
  }

  /* Parses the value of a custom field entry to the enum value */
  protected parseCustomFieldValue(entry: CustomDataEntry, enums: any) {
    let val = this.parseEnumValue(enums, entry.value);
    if (val == undefined) {
      console.error(`Custom Field Value ${formatToEnumString(entry.value)} can not be parsed`);
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

  /* Parses the backup to a parser specific game stats model */
  public abstract parse(backup: BGGCatalogBackup): BaseGameStats;
}
