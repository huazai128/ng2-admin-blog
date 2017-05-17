import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";


import { NgaModule } from "../../theme/nga.module";
import { Dashboard } from "./dashboard.component";
import { routing } from "./dashboard.routing";
import { SiteStatistics } from "./siteStatistics";
import { ChartList } from "./chart"

@NgModule({
  imports:[
    CommonModule,
    NgaModule,
    routing
  ],
  declarations:[
    Dashboard,
    SiteStatistics,
    ChartList
  ],
  providers:[

  ]
})
//使用default的区别
export  class DashBoardModule{

}
