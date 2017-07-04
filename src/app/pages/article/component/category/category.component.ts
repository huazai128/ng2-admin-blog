import { Component,ViewEncapsulation,Input,Output,EventEmitter,ViewChild } from "@angular/core";
import { CategoryService } from "./category.service";
import { ModalDirective } from "ngx-bootstrap";
import { Observable } from "rxjs/Observable"

@Component({
  selector:"category",
  templateUrl:"./category.html",
  encapsulation:ViewEncapsulation.None
})

export class Category{

  @ViewChild("delModal") _delModal:ModalDirective;

  // 编辑category
  public editCategory:any; // 存储单个分类
  public categories = { data: [] }; // 存储所有分类
  public delCategory:any; // 存储删除对象
  public delCategories:any;  // 存储删除多个对象
  public addCategoryState = { ing: false, success:false}; //编辑状态

  constructor(private _service:CategoryService){}

  ngOnInit():void{
    this.getCategories();
  }

  // 确认修改表单按钮
  public _doPutCategory(category):void{
    this.addCategoryState = { ing: true,success:false};
    console.log(this.editCategory);
    this._service.putCategory(Object.assign(this.editCategory,category))
      .then((category) => {
        this.editCategory = null;
        this.addCategoryState = { ing : false, success: !!category.code};
        this.getCategories(); //重新获取；
      })
      .catch((err) => {
        this.addCategoryState = { ing: false,success:false};
      });
  }

  // 确认新增表单
  public _addCategory($event):void{
    this.addCategoryState = {ing: true,success:false };
    this._service.addCategory($event)
      .then(result => {
        this.getCategories();
        this.addCategoryState = { ing: false, success: !!result.code}
      })
      .catch((err) => {});
  }

  // 获取分类
  public getCategories(params:any = {}):void{
    this._service.getCagetories(params)
      .then((categories) => {
        console.log(categories.result);
        this.categories = categories.result;
        this._categoryLevelBuild();
      })
      .catch(err => {});
  }

  // 点击编辑获取要编辑的对象
  public _editCategory(category):void{
    console.log(category);
    this.editCategory = category;
  }

  // 点击删除单个对象
  public _delCategory(category):void{
    this._delModal.show();
    this.delCategory = category;
  }

  // 确认删除单个对象
  public _doDelCategory():void{
    console.log(this.delCategory._id);
    this._service.deleteCategory(this.delCategory._id)
      .then((reslut) => {
        this._delModal.hide();
        this.delCategory = null;
        this.getCategories();
      })
      .catch((err) => {
      this._delModal.hide()
      })
  }

  // 多个删除
  public _delCategories(categories):void{
    this._delModal.show();
    this.delCategories = categories;
    this.delCategory = null;
    console.log(this.delCategories);
  }

  // 确认多个删除
  public _doDelCategories():void{
    this._service.deleteCategories(this.delCategories)
      .then((reslut) => {
        this.delCategories = null;
        this._delModal.hide();
        this.getCategories();
      })
      .catch((err) => {
        this._delModal.hide();
      })
  }

  // 取消删除
  public _canceldDelCategory():void{
    this.delCategory = null;
    this._delModal.hide();// 弹窗隐藏
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
          if(c.children && c.children.length) levelBuildOptions(c.children,level+1);
        })
      }
      levelBuildOptions(cates,0);
      return newCategories;
    }
    const _cates = categories.filter(c => toDoDeletes.indexOf(c) == -1); // 过滤所有的不存在子category
    console.log(_cates);
    // 过滤掉不存在pid的
    this.categories.data = levelBuildRun(_cates)
  }

}
