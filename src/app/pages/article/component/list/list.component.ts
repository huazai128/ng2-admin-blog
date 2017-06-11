import { Component,ViewEncapsulation } from "@angular/core";
import { FormGroup,AbstractControl,FormBuilder,Validators } from "@angular/forms";
import { ListService } from "./list.service";
import { TagService } from "../tag/tag.servier"

@Component({
  selector:"list",
  template:require("./list.html"),
  styles:[require("./list.scss")],
  encapsulation:ViewEncapsulation.None,
  providers:[ListService]
})

export class List{

  // 搜索form
  public keywordForm:FormGroup;
  public keywords:AbstractControl;

  public selectAll:boolean = false;  //全选
  public selectArticle:boolean = false;

  // 查询参数配置
  public getParams:any = { //
    state:"all",  // 选择文章发布状态
    category:"all", // 选择分类
    public:"all", // 选择状态
    tag:"all" // 选择标签
  }

  // 初始化数据
  public categories = { data:[] };  // 存储分类
  public tags = { data:[] };  //  存储tag

  // 文章集合对象
  public articles = {
    data:[],
    pagination:{
      total: 0, // 文章总数
      current_page: 1, // 当前页码
      pre_page: 10, // 限制查询 条数
      total_page: 0  // 总的页数
    }
  };

  //

  // 构造函数
  constructor(private _serviceList:ListService,
              private _fb:FormBuilder,private _tagService:TagService){

    this.keywordForm = this._fb.group({
      'keywords':['',Validators.compose([Validators.required])]
    });
    this.keywords = this.keywordForm.controls['keywords'];
  }

  // 初始化
  public ngOnInit():void{
    this.getArticles(); //初始化查询
    this.getTags();
  }

  // 获取lists列表
  public getArticles(params: any = {}): void {
    // 如果没有搜索词，则清空搜索框
    if(this.keywords.value) {
      params.keyword = this.keywords.value;
    }
    // 如果请求的是全部数据，则优化参数
    Object.keys(this.getParams).forEach(key => {
      if(!Object.is(this.getParams[key], 'all')) {
        console.log(this.getParams[key]);
        params[key] = this.getParams[key];
      }
    });
    // 如果请求的是第一页，则设置翻页组件的当前页为第一页
    if(!params.page || Object.is(params.page, 1)) {
      this.articles.pagination.current_page = 1;
    }
    // 请求文章
    this._serviceList.getArticles(params)
      .then(articles => {
        this.articles = articles.result;
      })
      .catch(error => {});
  }

  // 更改查询状态
  public switchState(value:any):void {
    console.log(value);
    console.log(this.getParams.state);
    if(value == undefined && Object.is(value,(<any>this.getParams).state)) return;
    this.getParams.state = value;
    this.getArticles();
  }

  // 获取Tags
  public getTags():void{
    // 默认查询都是{};
    this._tagService.getTags({})
      .then((tags) => {
        this.tags = tags.result;
      })
      .catch((err) => {});
  }

  //

  //  单个点击选中
  public batchSelectChange($event){

  }
}
