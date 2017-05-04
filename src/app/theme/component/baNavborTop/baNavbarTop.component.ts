import { Component,ViewEncapsulation  } from "@angular/core";
import { Router } from "@angular/router";

import { GlobalState } from "../../../global.state";
import { AppState } from "../../../app.service";

@Component({
  selector:"ba-navbar-top",
  template:require("./baNavbarTop.html"),
  styles:[require("./baNavbarTop.scss")],
  encapsulation:ViewEncapsulation.None
})
export class BaNavbarTop{

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;

  constructor(private _router:Router,private _state:AppState,private _gs:GlobalState){
    this._gs.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    })
  }

  //点击是否展示sidebar
  public toggleMenu(){
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._gs.notifyDataChanged("menu.isCollapsed",this.isMenuCollapsed);
    return false;
  }

  //监听滚动条的变化
  public scrolledChanged(event){
    this.isScrolled = event
  }
}
