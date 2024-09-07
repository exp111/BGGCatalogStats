import {Routes} from '@angular/router';
import {MarvelChampionsComponent} from "./marvelchampions/marvel-champions.component";
import {StartComponent} from "./start/start.component";

export const routes: Routes = [
  {path: "marvelchampions", component: MarvelChampionsComponent, title: MarvelChampionsComponent.Title},
  {path: "**", component: StartComponent, title: StartComponent.Title},
];
