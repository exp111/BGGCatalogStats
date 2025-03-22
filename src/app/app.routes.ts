import {Routes} from '@angular/router';
import {MarvelChampionsComponent} from "./game/marvel-champions/marvel-champions.component";
import {StartComponent} from "./start/start.component";
import {TooManyBonesComponent} from "./game/too-many-bones/too-many-bones.component";
import {HelpPageComponent} from "./help-page/help-page.component";
import {MakeExampleComponent} from "./make-example/make-example.component";
import {ConverterComponent} from "./converter/converter.component";
import {ViewerComponent} from "./game/viewer/viewer.component";

export const routes: Routes = [
  {path: "marvelchampions", component: MarvelChampionsComponent, title: MarvelChampionsComponent.Title},
  {path: "toomanybones", component: TooManyBonesComponent, title: TooManyBonesComponent.Title},
  {path: "viewer", component: ViewerComponent, title: ViewerComponent.Title},
  {path: "converter", component: ConverterComponent, title: "Converter"},
  {path: "help", component: HelpPageComponent, title: HelpPageComponent.Title},
  {path: "make-example", component: MakeExampleComponent, title: MakeExampleComponent.Title},
  {path: "**", component: StartComponent, title: StartComponent.Title},
];
