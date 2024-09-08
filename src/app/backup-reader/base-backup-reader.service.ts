import {Injectable} from '@angular/core';
import {BGGCatalogBackup} from "../../model/bgg-catalog";
import {BaseGameStats} from "../../model/base-game-stats";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseBackupReaderService {
  constructor() {
    (window as any).backupReader = this;
  }

  //TODO: should these all be methods on backup/other classes?
  protected getFieldValue(backup: BGGCatalogBackup, fieldId: number, entityId: number, playerId?: number) {
    return backup.customData.find(d => d.fieldId == fieldId
      && d.entityId == entityId
      && (playerId == null || d.playerId == playerId)
    );
  }

  protected findCustomField(backup: BGGCatalogBackup, gameId: number, name: string) {
    return backup.customFields.find(p =>
      p.selectedGames.split(",").map(g => Number(g)).includes(gameId)
      && p.name.toLowerCase() == name.toLowerCase()
    );
  }

  public abstract parse(backup: BGGCatalogBackup): BaseGameStats;
}
