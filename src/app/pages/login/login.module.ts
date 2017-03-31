import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NgaModule }     from '../../theme/nga.module';
import { routing } from "./login.routing";

import { Login } from "./login.component";


@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing
  ],
  declarations:[
    Login
  ],
  providers:[

  ]
})
export class LoginModule{

}





