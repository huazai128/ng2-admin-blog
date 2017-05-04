import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";


import { NgaModule } from "../../theme/nga.module";
import { Dashboard } from "./dashboard.component";
import { routing } from "./dashboard.routing";
import { SiteStatistics } from "./siteStatistics";

@NgModule({
  imports:[
    CommonModule,
    NgaModule,
    routing
  ],
  declarations:[
    Dashboard,
    SiteStatistics
  ],
  providers:[

  ]
})
//使用default的区别
export  class DashBoardModule{

}
