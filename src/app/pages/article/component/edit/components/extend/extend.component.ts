import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";


@Component({
  selector:"article-extend",
  template:require("./extend.html"),
  styles:[require("./extend.scss")],
  encapsulation:ViewEncapsulation.None
})

export class ArticleExtend{

  @Input() extends:any;
  @Output() extendsChange:EventEmitter<any> = new EventEmitter();
}
