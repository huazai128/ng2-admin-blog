import { Component } from "@angular/core";
import { SiteStatisticsService } from "./siteStatistics.service"

@Component({
  selector:"site-statistics",
  template:require("./siteStatistics.html"),
  styles:[require("./siteStatistics.scss")],
  providers:[SiteStatisticsService]

})
export class SiteStatistics{

  public charts:any;

  constructor(private _service:SiteStatisticsService){
    this.charts = this._service.getData();
  }

}
