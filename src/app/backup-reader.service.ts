import {Injectable} from '@angular/core';
import {BGGCollectionBackup, CustomFieldEntry, PlayerPlayEntry} from "../model/bggcollection";
import {
  Aspects,
  Difficulty,
  Heroes,
  MarvelChampionsPlay,
  MarvelChampionsPlayer,
  MarvelChampionsStats,
  Modulars,
  Scenarios
} from "../model/marvelchampions";
import {formatToEnumString} from "./enumUtils";

@Injectable({
  providedIn: 'root'
})
export class BackupReaderService {

  constructor() {
    (window as any).backupReader = this;
  }

  private normalizeAspectName(str: string) {
    return {
      "Gerechtigkeit": "Justice",
      "F\xfchrung": "Leadership",
      "Pool": "Deadpool",
      "Schutz": "Protection"
    }[str] ?? str;
  }

  private normalizeModularName(str: string) {
    return {
      "Bombenbedrohung": "BombThreat",
      "UnterBeschuss": "UnderAttack",
      "HydrasLegionen": "LegionsOfHydra"
    }[str] ?? str;
  }

  //TODO: these should all be methods on backup/other classes?
  private getFieldValue(backup: BGGCollectionBackup, fieldId: number, entityId: number, playerId?: number) {
    return backup.customData.find(d => d.fieldId == fieldId
      && d.entityId == entityId
      && (playerId == null || d.playerId == playerId)
    );
  }

  private marvelChampionsPlayer(entry: PlayerPlayEntry, backup: BGGCollectionBackup, heroField: CustomFieldEntry, aspectField: CustomFieldEntry) {
    let ret = {} as MarvelChampionsPlayer;
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
    let hero = this.getFieldValue(backup, heroField.id, entry.playId, entry.id);
    if (!hero) {
      console.error(`Hero field with id ${heroField.id} not found`);
      console.log(backup.plays.find(p => p.id == entry.playId));
      console.log(entry);
      return ret;
    }
    ret.Hero = Heroes[formatToEnumString(hero.value) as keyof typeof Heroes];
    if (ret.Hero == undefined) {
      console.error(`Hero Value ${formatToEnumString(hero.value)} can not be parsed`);
      return ret;
    }
    // find aspect
    let aspect = this.getFieldValue(backup, aspectField.id, entry.playId, entry.id);
    if (!aspect) {
      console.error(`Aspect field with id ${heroField.id} not found`);
      console.log(backup.plays.find(p => p.id == entry.playId));
      console.log(entry);
      return ret;
    }
    ret.Aspect = Aspects[this.normalizeAspectName(formatToEnumString(aspect.value)) as keyof typeof Aspects];
    if (ret.Aspect == undefined) {
      console.error(`Aspect Value ${this.normalizeAspectName(formatToEnumString(aspect.value))} can not be parsed`);
      return ret;
    }
    return ret;
  }

  private findCustomField(backup: BGGCollectionBackup, gameId: number, name: string) {
    return backup.customFields.find(p =>
      p.selectedGames.split(",").map(g => Number(g)).includes(gameId)
      && p.name.toLowerCase() == name.toLowerCase()
    );
  }

  public marvelChampions(backup: BGGCollectionBackup) {
    let ret = {
      Plays: [],
      OwnedPacks: []
    } as MarvelChampionsStats;
    let plays = [];
    // get game id
    let game = backup.games.find(g => g.name == "Marvel Champions: The Card Game");
    if (!game) {
      console.error("Game not found");
      return ret;
    }
    let owned = backup.games.filter(g => g.name.startsWith("Marvel Champions: The Card Game"));
    ret.OwnedPacks = owned.map(g => g.name);
    let gameId = game.id;
    // get custom data fields
    let aspectField = this.findCustomField(backup, gameId, "Aspect");
    let heroField = this.findCustomField(backup, gameId, "Hero");
    let scenarioField = this.findCustomField(backup, gameId, "Villain");
    let modularField = this.findCustomField(backup, gameId, "Modular");
    let difficultyField = this.findCustomField(backup, gameId, "Difficulty");
    if (!aspectField || !heroField || !scenarioField || !modularField || !difficultyField) {
      console.error("Cant find custom fields");
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
        Players: [] as MarvelChampionsPlayer[],
      } as MarvelChampionsPlay;
      // players
      let players = backup.playersPlays.filter(p => p.playId == play.id);
      for (let player of players) {
        obj.Players.push(this.marvelChampionsPlayer(player, backup, heroField, aspectField));
      }
      // scenario
      let scenario = this.getFieldValue(backup, scenarioField.id, play.id);
      if (!scenario) {
        console.error(`Scenario with id ${scenarioField.id} not found`);
        console.log(play);
        return ret;
      }
      obj.Scenario = Scenarios[formatToEnumString(scenario.value) as keyof typeof Scenarios];
      if (obj.Scenario == undefined) {
        console.error(`Scenario Value ${formatToEnumString(scenario.value)} can not be parsed`);
        return ret;
      }
      // modular
      let modular = this.getFieldValue(backup, modularField.id, play.id);
      if (!modular) {
        console.error(`Modular with id ${modularField.id} not found`);
        return ret;
      }
      obj.Modular = Modulars[this.normalizeModularName(formatToEnumString(modular.value)) as keyof typeof Modulars];
      if (obj.Modular == undefined) {
        console.error(`Modular Value ${this.normalizeModularName(formatToEnumString(modular.value))} can not be parsed`);
        return ret;
      }
      // difficulty
      let difficulty = this.getFieldValue(backup, difficultyField.id, play.id);
      if (!difficulty) {
        console.error(`Difficulty with id ${difficultyField.id} not found`);
        return ret;
      }
      obj.Difficulty = Difficulty[formatToEnumString(difficulty.value) as keyof typeof Difficulty];
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
