import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";
import { ArticleService } from "../../edit.service";

@Component({
  selector:"article-submit",
  template:require("./submit.html"),
  styles:[require("./submit.scss")],
  encapsulation:ViewEncapsulation.None
})

export class ArticleSubmit{

  public isEdit:boolean = false; //默认为false
  @Input() isArticle:boolean;
  @Input() state:any;
  @Input() publices:any;
  @Input() password:any;
  @Output() stateChange:EventEmitter<any> = new EventEmitter(); //不new会包错误
  @Output() publicesChange:EventEmitter<any> = new EventEmitter();
  @Output() passwordChange:EventEmitter<any> =  new EventEmitter();
  @Output() submitArticle = new EventEmitter<any>(); //<any>表示世界可以接受任何类型的数据；

  constructor(private _service:ArticleService){}

  public ngOnInit():void{
    this._service.editSubscribe().subscribe((result) => {
      this.isEdit = result;
    })
  }
}
