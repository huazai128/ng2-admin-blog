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
  @Input() isArticle:boolean;  //
  @Input() state:any;
  @Input() publices:any;  // 公开程度
  @Input() password:any;  // 密码
  @Output() stateChange:EventEmitter<any> = new EventEmitter(); //不new会包错误
  @Output() publicesChange:EventEmitter<any> = new EventEmitter();
  @Output() passwordChange:EventEmitter<any> =  new EventEmitter();
  @Output() submitArticle = new EventEmitter<any>(); //<any>表示世界可以接受任何类型的数据；

  constructor(private _service:ArticleService){}

  // 初始化
  public ngOnInit():void{

    this._service.editSubscribe().subscribe((result) => {
      this.isEdit = result;
    })
  }

  // 监听改变
  public ngOnChanges(change):void{
    console.log(change);
  }


}
