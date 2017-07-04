import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { NgaModule } from "../../theme/nga.module";
import { OptionsComponent } from "./options.component";

import { routing } from "./options.routing"
import { OptionsService } from "./options.service";

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule,
    routing
  ],
  declarations:[
    OptionsComponent
  ],
  providers:[
    OptionsService
  ]
})

export class OptionsModule{

}
