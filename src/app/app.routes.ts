import {Routes} from '@angular/router';
import {MarvelchampionsComponent} from "./marvelchampions/marvelchampions.component";
import {StartComponent} from "./start/start.component";

export const routes: Routes = [
  {path: "marvelchampions", component: MarvelchampionsComponent, title: MarvelchampionsComponent.Title},
  {path: "**", component: StartComponent, title: StartComponent.Title},
];
