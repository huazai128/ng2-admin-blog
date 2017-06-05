import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";


@Component({
  selector:"article-submit",
  template:require("./submit.html"),
  styles:[require("./submit.scss")],
  encapsulation:ViewEncapsulation.None
})

export class ArticleSubmit{

  @Input() isEdit:boolean = false; //默认为false
  @Input() isArticle:boolean;
  @Input() state:any;
  @Input() publices:any;
  @Input() password:any;
  @Output() stateChange:EventEmitter<any> = new EventEmitter(); //不new会包错误
  @Output() publicesChange:EventEmitter<any> = new EventEmitter();
  @Output() passwordChange:EventEmitter<any> =  new EventEmitter();
  @Output() submitArticle = new EventEmitter<any>(); //自定义事件

  constructor(){}

  public publish(){
    this.submitArticle.emit();  //发射
  }

  public ngOnInit():void{
    console.log(this.isArticle);
  }
}
