import {Component, ViewEncapsulation, SimpleChanges,ViewChild} from "@angular/core";
import { FormGroup,AbstractControl,FormBuilder,Validators } from "@angular/forms";
import { ListService } from "./list.service";
import { TagService } from "../tag/tag.servier";
import { CategoryService } from "../category/category.service";
import { ModalDirective } from "ngx-bootstrap";

@Component({
  selector:"list",
  template:require("./list.html"),
  styles:[require("./list.scss")],
  encapsulation:ViewEncapsulation.None,
  providers:[ListService]
})

export class List{

  @ViewChild("delModal") _delModel:ModalDirective;

  // 搜索form
  public keywordForm:FormGroup;
  public keywords:AbstractControl;

  // 查询参数配置
  public getParams:any = { //
    state:"all",  // 选择文章发布状态
    category:"all", // 选择分类
    public:"all", // 选择状态
    tag:"all" // 选择标签
  }

  // 初始化数据
  public selectAll:boolean = false;  //全选
  public categories = { data:[] };  // 存储分类
  public tags = { data:[] };  //  存储tag
  public selectArticles:any = []; // 存储选中的article._id;
  public del_article:any;  // 存储删除对象
  public articles = { // 文章集合对象
    data:[],
    pagination:{
      total: 0, // 文章总数
      current_page: 1, // 当前页码
      pre_page: 10, // 限制查询 条数
      total_page: 0  // 总的页数
    }
  };

  // 构造函数
  constructor(private _serviceList:ListService,
              private _fb:FormBuilder,
              private _tagService:TagService,
              private _categoryService:CategoryService){
    this.keywordForm = this._fb.group({
      'keywords':['',Validators.compose([Validators.required])]
    });
    this.keywords = this.keywordForm.controls['keywords'];
  }

  // 初始化
  public ngOnInit():void{
    this.getArticles(); //初始化查询
    this.getTags();
    this.getCategories();
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
        console.log(articles);
        this.articles = articles.result;
      })
      .catch(error => {});
  }

  // 更改查询状态
  public switchState(value:any):void {
    // console.log(value);
    // console.log(this.getParams.state);
    if(value == undefined && Object.is(value,(<any>this.getParams).state)) return;
    this.getParams.state = value;
    this.getArticles();
  }

  // 获取Tags
  private getTags():void{
    // 默认查询都是{};
    this._tagService.getTags({})
      .then((tags) => {
        this.tags = tags.result;
      })
      .catch((err) => {});
  }

  // 获取所有的分类
  private getCategories():void{
    let options = {};
    this._categoryService.getCagetories(options)
      .then((categories) => {
        this.categories = categories.result;
        // console.log(this.categories.data);
      })
      .catch((err) => {});
  }

  // 分类级别
  public categoryLevelMark = (level) => Array.from({length:level},() => "");

  // 刷新根据当前页码进行刷新
  public refreshArticles():void{
    console.log(this.articles.pagination.current_page);
    this.getArticles({page:this.articles.pagination.current_page});
  }

  // 搜索
  public searchSubmit(value):void{
    console.log(value);
    if(this.keywordForm.valid){
      //console.log(this.keywords.value);
      this.getArticles();
    }
  }

  // 清除搜索
  public resetGetParams():void{
    if(this.keywordForm.valid){
      this.keywords.setValue("");
      this.getArticles();
    }
  }

  // 监听哪些组件可以在onChanges发生变化
  public ngOnChanges(change:SimpleChanges):void{
    console.log(change);
    console.log("change ===================================")
  }

  // 分页查询
  public pageChanged(data):void{
    this.getArticles({page:data.page});
  }

  // 全选
  public batchSelectChange(ev):void{
    if(!this.articles.data.length) return;
    this.selectArticles = []; // 用于存储已选中的对像；
    this.articles.data.forEach((article) => {
      article.selected = this.selectAll;
      this.selectArticles.push(article._id);
    });
  }

  // 自由选择
  public selectedArticle(ev):void{
    console.log(ev);
    this.selectArticles = [];
    this.articles.data.forEach((article) => {
      article.selected && this.selectArticles.push(article._id);
    });
    if(!this.selectArticles.length){
      this.selectAll = false;
    }else if(!!this.selectArticles.length && (this.selectArticles.length == this.articles.data.length)){
      this.selectAll = true;
    }
  }

  // 快速发布
  public moveToPublished(articles):void{
    const action:number = 1;
    this._serviceList.moveArticle(articles,action)
      .then((reslut) => {
        this.selectArticles = [];
        this.getArticles(); // 重新获取articles；
      })
      .catch((err) => {});
  }

  // 移至草稿
  public moveToDraft(articles):void{
    const active:number = 2;
    console.log(articles);
    this._serviceList.moveArticle(articles,active)
      .then((result) => {
        this.selectArticles = [];
        this.getArticles(); // 重新获取articles；
      })
      .catch((err) => {})
  }

  // 移至回收站
  public moveToRecycle(articles):void{
    const active:number = 3;
    this._serviceList.moveArticle(articles,active)
      .then((result) => {
        this.selectArticles = [];
        this.getArticles(); // 重新获取articles；
      })
      .catch((err) => {})
  }

  // 点击删除
  public delArticleModal(data):void{
    this._delModel.show();
    this.del_article = data;
  }

  // 取消删除
  public canceldDelTagModal():void{
    this._delModel.hide();
    this.del_article = null;
  }

  // 确认删除
  public delArticle():void{
    const articles = this.del_article || this.selectArticles;
    this._serviceList.deleteArticles(articles)
      .then((result) => {
        this._delModel.hide();
        this.del_article = null;
        this.getArticles({page:this.articles.pagination.current_page});
      })
      .catch(() => {
        this._delModel.hide();
      })
  }
}
