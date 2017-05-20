import { Component,ViewEncapsulation } from "@angular/core";

@Component({
  selector:"article-tag",
  template:require("./tag.html"),
  styles:[require("./tag.scss")],
  encapsulation:ViewEncapsulation.None
})

export class ArticleTag{

}
