import { Component,ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormGroup,AbstractControl,Validators,FormBuilder} from "@angular/forms";
import { ArticleService } from "./edit.service";

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

  public contForm:FormGroup;
  public cont:AbstractControl;

  constructor(private _fb:FormBuilder,private _service:ArticleService){
    this.contForm = this._fb.group({
      'cont':['',Validators.compose([Validators.required])]
    });
    this.cont = this.contForm.controls['cont'];
  }

  //自定义事件
  public submitArticle(){
    this._service.saveArticle(this.article);
  }

  //
  ngOnInit():void{
    console.log(this.article.title);
  }
}
