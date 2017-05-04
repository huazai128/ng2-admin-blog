//面包屑效果
import { Component,ViewEncapsulation } from "@angular/core";

import { GlobalState } from "../../../global.state";

@Component({
  selector:"ba-content-top",
  template:require("./baContentTop.html"),
  styles:[require("./baContentTop.scss")],
  encapsulation:ViewEncapsulation.None
})

export class BaContentTop{
  public activePageTitle:string = "";
  constructor(private _state:GlobalState){
    //订阅
    this._state.subscribe("menu.activeLink",(activeLink) => {
      if(activeLink){
        this.activePageTitle = activeLink.title;
      }
    })
  }

}
