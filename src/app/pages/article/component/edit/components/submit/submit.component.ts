import { Component,ViewEncapsulation } from "@angular/core";


@Component({
  selector:"article-submit",
  template:require("./submit.html"),
  styles:[require("./submit.scss")],
  encapsulation:ViewEncapsulation.None
})

export class ArticleSubmit{

}
