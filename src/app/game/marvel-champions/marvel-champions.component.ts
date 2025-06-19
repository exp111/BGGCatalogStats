import {Component} from '@angular/core';
import {ChecklistComponent, ChecklistState} from "../../app-table/checklist.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "../../app-table/table.component";
import {
  Aspect,
  Difficulty,
  Hero,
  MarvelChampionsPlay,
  MarvelChampionsStats,
  Modular,
  Pack,
  PackContent,
  Scenario
} from "../../../model/marvel-champions";
import {BaseGameComponent} from "../base-game.component";
import {MCBackupReaderService} from "../../backup-reader/marvel-champions/mc-backup-reader.service";
import {formatDurationMinutes} from "../../util/helper";
import {MCFilterParams, MCFilterPipe, SortOrder, SortType} from "./mc-filter.pipe";
import {Enums, enumToNumberArray} from "../../util/enum-utils";
import {NgbAccordionModule, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GameStatsModalComponent} from "../../game-stats-modal/game-stats-modal.component";
import {CompletionBarComponent} from "../completion-bar/completion-bar.component";
import {StatService} from "../../../services/stat.service";
import {Router} from "@angular/router";
import {MarvelChampionsGameStatsModalComponent} from "../../game-stats-modal/game/mc-game-stats-modal.component";

@Component({
  selector: 'app-marvel-champions',
  imports: [
    ChecklistComponent,
    ReactiveFormsModule,
    TableComponent,
    FormsModule,
    MCFilterPipe,
    NgbAccordionModule,
    CompletionBarComponent
  ],
  templateUrl: './marvel-champions.component.html',
  styleUrl: './marvel-champions.component.scss'
})
export class MarvelChampionsComponent extends BaseGameComponent<MarvelChampionsStats, MarvelChampionsPlay> {
  static override Title = 'Marvel Champions Stats';

  mojoModulars: Modular[] = [Modular.Crime, Modular.Fantasy, Modular.Horror, Modular.SciFi, Modular.Sitcom, Modular.Western];

  filterParams: MCFilterParams = {
    onlyWon: false,
    hero: null,
    aspect: null,
    scenario: null,
    modular: null,
    difficulty: null,
    sortBy: null,
    sortOrder: SortOrder.Ascending
  };

  protected override enumBeautifiers = {
    [Hero.END]: this.beautifyHeroName,
    [Pack.END]: this.beautifyPackName,
    [Difficulty.END]: this.beautifyDifficultyName
  }

  private beautifyHeroName(e: number) {
    return {
      [Hero.SPdr]: "SP//dr"
    }[e] ?? null;
  }

  private beautifyPackName(e: number) {
    return {
      [Pack.SPdr]: "SP//dr"
    }[e] ?? null;
  }

  private beautifyDifficultyName(e: number) {
    return {
      [Difficulty.Standard2]: "Standard II",
      [Difficulty.Standard3]: "Standard III",
      [Difficulty.Expert2]: "Expert II",
      [Difficulty.Expert3]: "Expert III",
    }[e] ?? null;
  }

  constructor(protected backupService: MCBackupReaderService,
              statService: StatService,
              router: Router,
              protected modalService: NgbModal) {
    super(backupService, statService, router);
  }

  playHasPackContent(play: MarvelChampionsPlay, pack: number) {
    let content = PackContent[pack];
    // this ignores aspects + difficulty as they would always include core
    return (content.includes(play.Scenario)
      || play.Modulars.some(m => content.includes(m))
      || play.Players.some(p => content.includes(p.Hero))
    ) && this.playHasHero(play); // check for "only me"
  }

  packsEnumToNumberArray(e: any) {
    let endMarker = e["END"];
    // filter out the values
    return enumToNumberArray(e)
      .filter(v => v != endMarker) // ignore end marker
      .filter(v => !this.onlyOwned || (this.stats?.OwnedContent.includes(String(v)) ?? false)) // only show owned
      .filter(v => !this.onlyPlayed || (this.stats?.Plays.some(p => this.playHasPackContent(p, v)) ?? false)) as number[];
  }

  protected override playedCheck(val: number) {
    if (!this.stats) {
      return true;
    }
    return this.stats.Plays.some(p => p.Scenario == val
      || p.Difficulty == val
      || p.Modulars.includes(val)
      || this.playHasHero(p, val)
      || this.playHasHero(p, undefined, val));
  }

  ownedPackCheck(val: number) {
    return this.stats?.OwnedContent.some(p => p == String(val)) ?? false;
  }

  playHasHero(play: MarvelChampionsPlay, hero?: Hero, aspect?: Aspect) {
    return play.Players.some(p => (hero == undefined || p.Hero == hero)
      && (!this.onlyMe || p.IsMe)
      && (aspect == undefined || p.Aspects?.includes(aspect)));
  }

  getRate(totalPlays: number, plays: number) {
    let rate = 0;
    if (plays > 0) {
      rate = plays / totalPlays * 100;
    }
    return `${rate.toFixed(1)}% (${plays}/${totalPlays})`;
  }

  protected override getPlays(stats: MarvelChampionsStats) {
    return stats.Plays.filter(p => this.playHasHero(p)); // check if play is valid (ie contains "me")
  }

  getAveragePlaytime(plays: MarvelChampionsPlay[], onlyWon: boolean | null = null) {
    let filtered = plays;
    switch (onlyWon) {
      case false:
        filtered = plays.filter(p => !p.Won);
        break;
      case true:
        filtered = plays.filter(p => p.Won);
        break;
    }
    let count = filtered.length;
    return count > 0 ? this.getPlaytime(filtered) / count : 0;
  }

  heroPlayrateGetter(_: string, hero: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    return this.getRate(plays.length, heroPlays.length);
  }

  aspectPlayrateGetter(_: string, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    return this.getRate(plays.length, aspectPlays.length);
  }

  scenarioPlayrateGetter(_: string, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario);
    return this.getRate(plays.length, scenarioPlays.length);
  }

  packPlayrateGetter(_: string, pack: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let packPlays = plays.filter(p => this.playHasPackContent(p, pack));
    return this.getRate(plays.length, packPlays.length);
  }

  heroWinrateGetter(_: string, hero: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    let wins = this.getWins(heroPlays);
    return this.getRate(heroPlays.length, wins);
  }

  aspectWinrateGetter(_: string, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    let wins = this.getWins(aspectPlays);
    return this.getRate(aspectPlays.length, wins);
  }

  scenarioWinrateGetter(_: string, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario);
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  scenarioHeroWinrateGetter(scenario: number, hero: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  heroAspectWinrateGetter(hero: number, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => this.playHasHero(p, hero, aspect));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  scenarioAspectWinrateGetter(scenario: number, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, undefined, aspect));
    let wins = this.getWins(scenarioPlays);
    return this.getRate(scenarioPlays.length, wins);
  }

  heroPlaytimeGetter(_: string, hero: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    return formatDurationMinutes(this.getPlaytime(heroPlays));
  }

  aspectPlaytimeGetter(_: string, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    return formatDurationMinutes(this.getPlaytime(aspectPlays));
  }

  scenarioPlaytimeGetter(_: string, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p));
    return formatDurationMinutes(this.getPlaytime(scenarioPlays));
  }

  modularPlaytimeGetter(_: string, modular: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let modularPlays = plays.filter(p => p.Modulars.includes(modular) && this.playHasHero(p));
    return formatDurationMinutes(this.getPlaytime(modularPlays));
  }

  playerCountPlaytimeGetter(_: string, count: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let countPlays = plays.filter(p => p.Players.length == count);
    return formatDurationMinutes(this.getPlaytime(countPlays));
  }

  packPlaytimeGetter(_: string, pack: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let packPlays = plays.filter(p => this.playHasPackContent(p, pack));
    return formatDurationMinutes(this.getPlaytime(packPlays));
  }

  heroScenarioPlaytimeGetter(hero: number, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroScenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero));
    return formatDurationMinutes(this.getPlaytime(heroScenarioPlays));
  }

  avgHeroPlaytimeGetter(_: string, hero: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroPlays = plays.filter(p => this.playHasHero(p, hero));
    return formatDurationMinutes(this.getAveragePlaytime(heroPlays));
  }

  avgAspectPlaytimeGetter(_: string, aspect: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let aspectPlays = plays.filter(p => this.playHasHero(p, undefined, aspect));
    return formatDurationMinutes(this.getAveragePlaytime(aspectPlays));
  }

  avgScenarioPlaytimeGetter(_: string, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let scenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p));
    return formatDurationMinutes(this.getAveragePlaytime(scenarioPlays));
  }

  avgModularPlaytimeGetter(_: string, modular: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let modularPlays = plays.filter(p => p.Modulars.includes(modular) && this.playHasHero(p));
    return formatDurationMinutes(this.getAveragePlaytime(modularPlays));
  }

  avgPlayerCountPlaytimeGetter(_: string, count: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let countPlays = plays.filter(p => p.Players.length == count && this.playHasHero(p));
    return formatDurationMinutes(this.getAveragePlaytime(countPlays));
  }

  avgHeroScenarioPlaytimeGetter(hero: number, scenario: number) {
    if (!this.stats) {
      return "";
    }
    let plays = this.getPlays(this.stats);
    let heroScenarioPlays = plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero));
    return formatDurationMinutes(this.getAveragePlaytime(heroScenarioPlays));
  }

  heroAspectWonGetter(hero: number, aspect: number) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    return this.playsToChecklist(plays.filter(p => this.playHasHero(p, hero, aspect)));
  }

  scenarioHeroWonGetter(scenario: number, hero: number) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    return this.playsToChecklist(plays.filter(p => p.Scenario == scenario && this.playHasHero(p, hero)));
  }

  scenarioAspectWonGetter(scenario: number, aspect: number) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    return this.playsToChecklist(plays.filter(p => p.Scenario == scenario && this.playHasHero(p, undefined, aspect)));
  }

  scenarioModularWonGetter(scenario: number, modular: number) {
    if (!this.stats) {
      return false;
    }
    let plays = this.getPlays(this.stats);
    return this.playsToChecklist(plays.filter(p => p.Scenario == scenario && p.Modulars.includes(modular)));
  }

  scenarioDifficultyWonGetter(scenario: number, difficulty: number) {
    if (!this.stats) {
      return ChecklistState.Empty;
    }
    let plays = this.getPlays(this.stats);
    return this.playsToChecklist(plays.filter(p => p.Scenario == scenario && p.Difficulty == difficulty));
  }

  packPlayedGetter(_: number, pack: number) {
    if (!this.stats) {
      return ChecklistState.Empty;
    }
    return this.packPlayedCheck(pack) ? ChecklistState.Check : ChecklistState.Empty;
  }

  formatEnumList(enums: any, entries: any[]) {
    return entries ? entries.map(a => this.beautifyEnum(enums, a)).join(", ") : this.beautifyEnum(null, null); // else just return the default value
  }

  onStatsClicked() {
    let modal = this.modalService.open(MarvelChampionsGameStatsModalComponent, {centered: true});
    (modal.componentInstance as MarvelChampionsGameStatsModalComponent).setData(this.stats!);
  }

  isSelectLocked(select: HTMLSelectElement) {
    return select.disabled;
  }

  setRandomValue(...selects: HTMLSelectElement[]) {
    for (let select of selects) {
      // skip any selects which are locked (disabled item)
      if (this.isSelectLocked(select)) {
        continue;
      }
      let length = select.options.length;
      // skip first item (placeholder)
      let rand = Math.floor(Math.random() * (length - 1)) + 1;
      select.selectedIndex = rand >= length ? 0 : rand;
    }
  }

  // get possible values, either the selected value if locked or any in the enum
  getPossibleEnumValues(select: HTMLSelectElement, e: Enums) {
    return this.isSelectLocked(select) ? [Number(select.selectedOptions[0].value)] : this.enumToNumberArray(e);
  }

  unplayedHeroAspect(heroSelect: HTMLSelectElement, aspectSelect: HTMLSelectElement) {
    let plays = this.getPlays(this.stats!);
    let heroes = this.getPossibleEnumValues(heroSelect, Hero);
    let aspects = this.getPossibleEnumValues(aspectSelect, Aspect);
    let entries = [];
    for (let hero of heroes) {
      for (let aspect of aspects) {
        // not yet played
        if (!plays.some(p => this.playHasHero(p, hero, aspect))) {
          entries.push([hero, aspect]);
        }
      }
    }
    let entry = entries[Math.floor(Math.random() * entries.length)];
    heroSelect.value = entry[0].toString();
    aspectSelect.value = entry[1].toString();
  }

  unplayedHeroScenario(heroSelect: HTMLSelectElement, scenarioSelect: HTMLSelectElement) {
    let plays = this.getPlays(this.stats!);
    let heroes = this.getPossibleEnumValues(heroSelect, Hero);
    let scenarios = this.getPossibleEnumValues(scenarioSelect, Scenario);
    let entries = [];
    for (let hero of heroes) {
      for (let scenario of scenarios) {
        // not yet played
        if (!plays.some(p => p.Scenario == scenario && this.playHasHero(p, hero))) {
          entries.push([hero, scenario]);
        }
      }
    }
    let entry = entries[Math.floor(Math.random() * entries.length)];
    heroSelect.value = entry[0].toString();
    scenarioSelect.value = entry[1].toString();
  }

  unplayedScenarioModular(scenarioSelect: HTMLSelectElement, modularSelect: HTMLSelectElement) {
    let plays = this.getPlays(this.stats!);
    let scenarios = this.getPossibleEnumValues(scenarioSelect, Scenario);
    let modulars = this.getPossibleEnumValues(modularSelect, Modular);
    let entries = [];
    for (let scenario of scenarios) {
      for (let modular of modulars) {
        // not yet played
        if (!plays.some(p => p.Scenario == scenario && p.Modulars.includes(modular))) {
          entries.push([scenario, modular]);
        }
      }
    }
    let entry = entries[Math.floor(Math.random() * entries.length)];
    scenarioSelect.value = entry[0].toString();
    modularSelect.value = entry[1].toString();
  }

  unplayedAll(heroSelect: HTMLSelectElement, aspectSelect: HTMLSelectElement, scenarioSelect: HTMLSelectElement, modularSelect: HTMLSelectElement) {
    let plays = this.getPlays(this.stats!);
    let heroes = this.getPossibleEnumValues(heroSelect, Hero);
    let aspects = this.getPossibleEnumValues(aspectSelect, Aspect);
    let scenarios = this.getPossibleEnumValues(scenarioSelect, Scenario);
    let modulars = this.getPossibleEnumValues(modularSelect, Modular);
    let entries = [];
    for (let hero of heroes) {
      for (let aspect of aspects) {
        for (let scenario of scenarios) {
          for (let modular of modulars) {
            // not yet played
            if (!plays.some(p => p.Scenario == scenario && p.Modulars.includes(modular) && this.playHasHero(p, hero, aspect))) {
              entries.push([hero, aspect, scenario, modular]);
            }
          }
        }
      }
    }
    let entry = entries[Math.floor(Math.random() * entries.length)];
    heroSelect.value = entry[0].toString();
    aspectSelect.value = entry[1].toString();
    scenarioSelect.value = entry[2].toString();
    modularSelect.value = entry[3].toString();
  }

  getPercentage(e: Enums, check: (v: any) => boolean) {
    let values = enumToNumberArray(e).filter(v => v != e["END"]);
    let count = 0;
    for (let v of values) {
      if (check(v)) {
        count++;
      }
    }
    return count / values.length;
  }

  getPlayedPercentage(e: Enums, check = this.playedCheck.bind(this)) {
    return this.getPercentage(e, check);
  }

  getOwnedPercentage(e: Enums, check = this.ownedCheck.bind(this)) {
    return this.getPercentage(e, check);
  }

  packPlayedCheck(val: number) {
    if (!this.stats) {
      return true;
    }
    return this.stats.Plays.some(p => this.playHasPackContent(p, val));
  }

  protected readonly Hero = Hero;
  protected readonly Aspect = Aspect;
  protected readonly Scenario = Scenario;
  protected readonly Modular = Modular;
  protected readonly Difficulty = Difficulty;
  protected readonly formatDurationMinutes = formatDurationMinutes;
  protected readonly SortOrder = SortOrder;
  protected readonly SortType = SortType;
  protected readonly Packs = Pack;
}
