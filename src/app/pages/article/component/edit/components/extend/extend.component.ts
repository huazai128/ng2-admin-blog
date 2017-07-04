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

  constructor(){}

  // 视图初始化
  public ngOnInit():void{
    //console.log(this.extends);
  }

  // 视图初始化后调用
  public ngAfterViewInit():void{
    //console.log(this.extends);
  }

  // 监听changes
  public ngOnChanges(change):void{
    //console.log(this.extends);
    console.log(change);
  }

  // 增加扩展
  public addExtends():void{
    this.extends = Array.from([...this.extends,{}]);
  }

  // 删除扩展
  public delExtendItem(i:Number):void{
    this.extends= this.extends.splice(i,1);
  }

  // 监听ngModel值的变化;
  public emitExtendData():void{
    this.extendsChange.emit(this.extends);
  }




}
