import { Component,ViewEncapsulation } from "@angular/core";


@Component({
  selector:"article-extend",
  template:require("./extend.html"),
  styles:[require("./extend.scss")],
  encapsulation:ViewEncapsulation.None
})

export class ArticleExtend{

}
