import {Component, ViewEncapsulation, SimpleChanges} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormGroup,AbstractControl,Validators,FormBuilder} from "@angular/forms";
import { ArticleService } from "./edit.service";

@Component({
  selector:"ba-edit",
  template:require("./edit.html"),
  encapsulation:ViewEncapsulation.None
})

export class Edit{

  public article_id:any = null; //用于存储编辑文章信息

  public article = {
    title: '',
    keywords: [],
    description: '',
    content: '',
    thumb: '',
    state: '1',
    public: '1',
    password: '',
    tag: [],
    category: [],
    extends: []
  };

  public contForm:FormGroup;
  public cont:AbstractControl;

  constructor(private _fb:FormBuilder,
              private _service:ArticleService,
              private _route:ActivatedRoute){
    this.contForm = this._fb.group({
      'cont':['',Validators.compose([Validators.required])]
    });
    this.cont = this.contForm.controls['cont'];
  }

  // 提交文章
  public submitArticle(event) {
    console.log(this.article);
    const { title, content } = this.article;
    if(title && content) {
      this._service[(<any>this.article)._id ? 'putArticle' : 'addArticle'](this.article)
        .then(article => {
          console.log("保存成功");
        })
        .catch(error => {})
    }
  }

  // 获取文章信息
  public getArticle(_id: string) {
    this._service.getArticle(_id)
      .then(article => {
        this.article = article.result;
      })
      .catch(error => {})
  }

  // 初始化
  ngOnInit() {
    // 如果是修改，则请求文章数据
    this._route.params.subscribe(({ _id }) => {
      this.article_id = _id;
      if(_id) this.getArticle(_id);
    });
  }
}
