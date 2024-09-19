import {Routes} from '@angular/router';
import {MarvelChampionsComponent} from "./game/marvel-champions/marvel-champions.component";
import {StartComponent} from "./start/start.component";
import {TooManyBonesComponent} from "./game/too-many-bones/too-many-bones.component";
import {HelpPageComponent} from "./help-page/help-page.component";

export const routes: Routes = [
  {path: "marvelchampions", component: MarvelChampionsComponent, title: MarvelChampionsComponent.Title},
  {path: "toomanybones", component: TooManyBonesComponent, title: TooManyBonesComponent.Title},
  {path: "help", component: HelpPageComponent, title: HelpPageComponent.Title},
  {path: "**", component: StartComponent, title: StartComponent.Title},
];
