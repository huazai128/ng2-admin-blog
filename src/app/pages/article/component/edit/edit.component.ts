import { Component,ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector:"ba-edit",
  template:require("./edit.html"),
  encapsulation:ViewEncapsulation.None
})

export class Edit{

  public article_id = null; //用于存储编辑文章信息
  public isArticle:boolean = false; //判断文章验证通过提交

  public article = { //用于文章信息
    title:"",// 文章标题
    keywords:[], //关键字
    description:"", //文章描述
    content:"", //文章内容
    thumb:"", //缩略图
    state:"1", //发表状态
    public:"1", //是否公开
    password:"",// 密码访问
    tag:[], //文章所包含的标签
    category:[], //类型
    extends:[] //扩展
  };

  //ActivatedRoute: 获取当前路由信息
  constructor( private _route:ActivatedRoute ){

  }

  //自定义事件
  public submitArticle(){
    console.log(this.article);
  }

  //
  ngOnInit():void{
    console.log(this.article.title);
  }
}
