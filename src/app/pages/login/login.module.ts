import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NgaModule }     from '../../theme/nga.module';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";

import { routing } from "./login.routing";
import { LoginService } from "./login.server";
import { Login } from "./login.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule,
    routing
  ],
  declarations:[
    Login
  ],
  providers:[
    LoginService
  ]
})
export class LoginModule{

}





