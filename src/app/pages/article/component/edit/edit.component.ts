import { Component,ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector:"ba-edit",
  template:require("./edit.html"),
  encapsulation:ViewEncapsulation.None
})

export class Edit{

  public codes:any; //数据的双向绑定
  //
  constructor( private _route:ActivatedRoute ){

  }
}
