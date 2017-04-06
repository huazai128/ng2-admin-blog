import { Component,ViewEncapsulation  } from "@angular/core";


@Component({
  selector:"ba-navbar-top",
  template:require("./baNavbarTop.html"),
  styles:[require("./baNavbarTop.scss")],
  encapsulation:ViewEncapsulation.None
})
export class BaNavbarTop{

}
