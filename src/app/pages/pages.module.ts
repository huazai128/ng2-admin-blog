import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgaModule } from "../theme/nga.module";

import { Pages } from "./pages.component";
import { routing } from "./pages.routing";

@NgModule({
  imports:[
    CommonModule,
    NgaModule,
    routing
  ],
  declarations:[
    Pages
  ]
})
export class PagesModule{

}

