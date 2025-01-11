import {Injectable} from '@angular/core';
import {BGGCatalogBackup, BGGCatalogCustomFieldEntry, BGGCatalogPlayerPlayEntry} from "../../../model/bgg-catalog";
import {
  Aspect,
  Difficulty,
  Hero,
  MarvelChampionsPlay,
  MarvelChampionsPlayer,
  MarvelChampionsStats,
  MC_GAME_ID,
  Modular,
  PackContent,
  Scenario
} from "../../../model/marvel-champions";
import {BaseBackupReaderService} from "../base-backup-reader.service";
import {BGStatsBackup, BGStatsPlayerScoreEntry} from "../../../model/bg-stats";

@Injectable({
  providedIn: 'root'
})
export class MCBackupReaderService extends BaseBackupReaderService {
  protected override BaseGameBGGID = MC_GAME_ID;
  public override GameContent = PackContent;

  protected override enumNormalizers = {
    [Difficulty.END]: this.normalizeDifficultyName,
    [Scenario.END]: this.normalizeScenarioName,
    [Aspect.END]: this.normalizeAspectName,
    [Modular.END]: this.normalizeModularName
  }

  private normalizeDifficultyName(str: string) {
    return {
      "Standart": "Standard", // set is called "Standard" in german too, but to accept typos
      "Experte": "Expert",
    }[str] ?? str;
  }

  private normalizeScenarioName(str: string) {
    return {
      "RiskantesGesch\xe4ft": "RiskyBusiness",
      "MutagenFormel": "MutagenFormula",
    }[str] ?? str;
  }

  private normalizeAspectName(str: string) {
    return {
      "Gerechtigkeit": "Justice",
      "F\xfchrung": "Leadership",
      "Schutz": "Protection"
    }[str] ?? str;
  }

  private normalizeModularName(str: string) {
    return {
      "Bombenbedrohung": "BombThreat",
      "UnterBeschuss": "UnderAttack",
      "HydrasLegionen": "LegionsOfHydra",
      "HydraAngriff": "HydraAssault",
      "Waffenmeister": "WeaponMaster",
      "HydraPatrouille": "HydraPatrol",
      "ExperimentelleWaffen": "ExperimentalWeapons",
      "StadtImChaos": "CityInChaos",
      "Bodenst\xe4ndig": "DownToEarth",
      "GoblinAusr\xfcstung": "GoblinGear",
      "Guerillataktik": "GuerrillaTactics",
      "Pers\xf6nlicherAlbtraum": "PersonalNightmare",
      "SinistrerAngriff": "SinisterAssault",
      "SymbiotischeSt\xe4rke": "SymbioticStrength",
      "Fl\xfcsterndeParanoia": "WhispersOfParanoia",
      "GoblinTricks": "GoblinGimmicks",
      "StechendesChaos": "AMessOfThings",
      "Energieentzug": "PowerDrain",
      "Ablenkungsman\xf6ver": "RunningInterference"
    }[str] ?? str;
  }

  private parsePlayerBGGCatalog(entry: BGGCatalogPlayerPlayEntry, backup: BGGCatalogBackup, heroField: BGGCatalogCustomFieldEntry, aspectField: BGGCatalogCustomFieldEntry, aspectsField: BGGCatalogCustomFieldEntry) {
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
    ret.Hero = this.parseCustomFieldValuePlayer(backup, entry, Hero, heroField);
    // find aspect
    ret.Aspects = this.parseCustomFieldValuePlayer(backup, entry, Aspect, aspectField, aspectsField);
    return ret;
  }

  private parsePlayerBGStats(score: BGStatsPlayerScoreEntry, backup: BGStatsBackup) {
    let ret = {} as MarvelChampionsPlayer;
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
    // find hero
    ret.Hero = this.parseFieldBGStats(role, Hero);
    // find aspect
    ret.Aspects = this.parseFieldBGStats(role, Aspect, true);
    return ret;
  }

  public override parseBGGCatalog(backup: BGGCatalogBackup) {
    let ret = {
      Plays: [],
      OwnedContent: []
    } as MarvelChampionsStats;
    let plays = [];
    // get game id
    let game = this.findBaseGame(backup);
    if (!game) {
      return ret;
    }
    ret.OwnedContent = this.getOwnedContent(backup);
    let gameId = game.id;
    // get custom data fields
    let aspectField = this.findCustomField(backup, gameId, "Aspect");
    let aspectsField = this.findCustomField(backup, gameId, "Aspects");
    let heroField = this.findCustomField(backup, gameId, "Hero");
    let scenarioField = this.findCustomField(backup, gameId, "Scenario");
    let modularField = this.findCustomField(backup, gameId, "Modular");
    let modularsField = this.findCustomField(backup, gameId, "Modulars");
    let difficultyField = this.findCustomField(backup, gameId, "Difficulty");
    if ([aspectField, aspectsField, heroField, scenarioField, modularField, modularsField, difficultyField].some(f => !f)) {
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
        Id: String(play.id),
        Duration: play.length,
        Notes: play.notes,
        Players: [] as MarvelChampionsPlayer[],
        Timestamp: play.playDate
      } as MarvelChampionsPlay;
      // players
      let players = backup.playersPlays.filter(p => p.playId == play.id);
      for (let player of players) {
        obj.Players.push(this.parsePlayerBGGCatalog(player, backup, heroField!, aspectField!, aspectsField!));
      }
      // scenario
      obj.Scenario = this.parseCustomFieldValuePlay(backup, play, Scenario, scenarioField!);
      // modular
      obj.Modulars = this.parseCustomFieldValuePlay(backup, play, Modular, modularField!, modularsField);
      // difficulty
      obj.Difficulty = this.parseCustomFieldValuePlay(backup, play, Difficulty, difficultyField!);
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
    } as MarvelChampionsStats;
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
        Id: play.uuid,
        Duration: play.durationMin,
        Notes: "", //TODO: notes
        Players: play.playerScores.map(score => this.parsePlayerBGStats(score, backup)),
        Timestamp: play.playDate
      } as MarvelChampionsPlay;
      // scenario
      obj.Scenario = this.parseFieldBGStats(play.board, Scenario);
      // modular
      obj.Modulars = this.parseFieldBGStats(play.board, Modular, true);
      // difficulty
      obj.Difficulty = this.parseFieldBGStats(play.board, Difficulty);
      obj.Won = play.playerScores.some(p => p.winner)
      plays.push(obj);
    }
    ret.Plays = plays;
    return ret;
  }
}
