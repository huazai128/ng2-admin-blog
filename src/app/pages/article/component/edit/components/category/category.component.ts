import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";
import { CategoryService }  from "../../../category/category.service";


@Component({
  selector:"article-category",
  template:require("./category.html"),
  styles:[require("./category.scss")],
  encapsulation:ViewEncapsulation.None
})

export class CategoryArticle{

  public categories  = { data:[] }; //存储categories;

  @Input() category:any; // 用于存储选中的category._id；是一个数组；
  @Output() categoryChange:EventEmitter<any> = new EventEmitter();

  constructor(private _service:CategoryService){};

  // 分类级别；根据level的数量创建一个level长度的数组；
  public categoryLevelMark = (level) => Array.from({length: level} , () => "");

  // 初始化
  public ngOnInit():void{
    //console.log(this.category);
    this.getCategories();
  }

  // 更新数据
  ngOnChanges(change){
    console.log(this.category);
    if(change.category) {
      this._categoryLevelBuild();
    }
  }

  // 选中category
  public itemSelectChange(checked,category):void{
    const index = this.category.indexOf(category._id);
    const hasCate = !Object.is(index,-1);
    if(checked){
      if(!hasCate){
        this.category.push(category._id);
      }
    }else{
      if(hasCate){
        this.category.splice(index,1);
      }
    }
    this.categoryChange.emit(this.category);
  }

  // 分类级别递归排序
  private _categoryLevelBuild = () => {
    let categories = this.categories.data;
    console.log(categories);
    let toDoDeletes = [];
    // 有几种情况处理，判断当category是否存在父pid；或者是判断当前category被其他category当作父category
    categories.forEach((cate) => {
      console.log(!!cate.pid,cate.pid); // !!强制类型转换，存在为true，不存在为false；
      // 判断当前cate是否存在pid；并排除当前cate.pid所引用的父类；
      cate.upnin = (!!cate.pid && !categories.find(c => Object.is(c._id,cate.pid)));// true: 当前制作别的category父类；false: 排除所有cate.pid为false的进入
      // let flag = Object.is(c.pid,cate._id);
      // console.log(flag);
      // return flag
      // }));
      categories.forEach((c) => { // 过滤不存在父类
        //
        if(Object.is(cate.pid,c._id)){
          c.children = c.children || [];
          c.children.push(cate); // 在父categories中添加children属性
          toDoDeletes.push(cate);
        }
      })
    });

    // 数据的扁平化
    const levelBuildRun = (cates) => {
      let newCategories = [];
      const levelBuildOptions = (cates,level) => {
        cates.forEach((c) => {
          c.level = level; // 级别
          newCategories.push(c);
          c.checked = this.category.indexOf(c._id) > -1;
          if(c.children && c.children.length) levelBuildOptions(c.children,level+1);
        })
      };
      levelBuildOptions(cates,0);
      return newCategories;
    };
    const _cates = categories.filter(c => toDoDeletes.indexOf(c) == -1); // 过滤所有的不存在子category
    console.log(_cates);
    // 过滤掉不存在pid的
    this.categories.data = levelBuildRun(_cates)
  };

  // 获取分类
  public getCategories(params:any = {}):void{
    this._service.getCagetories(params)
      .then(({result}) => {
        console.log(result);
        this.categories.data = result.data;
        this._categoryLevelBuild();
      })
      .catch(() => {});
  }

  //

}
