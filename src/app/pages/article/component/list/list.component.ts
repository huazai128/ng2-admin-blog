import { Component,ViewEncapsulation } from "@angular/core";

@Component({
  selector:"list",
  template:require("./list.html"),
  styles:[require("./list.scss")],
  encapsulation:ViewEncapsulation.None
})

export class List{

}
