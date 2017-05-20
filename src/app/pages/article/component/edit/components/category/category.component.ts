import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";


@Component({
  selector:"article-category",
  template:require("./category.html"),
  styles:[require("./category.scss")],
  encapsulation:ViewEncapsulation.None
})

export class CategoryArticle{

}
