import { Component,ViewEncapsulation,Input,Output,EventEmitter,ViewChild } from "@angular/core";
import { CategoryService } from "./category.service";
import { ModalDirective } from "ngx-bootstrap";

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

  // 自定义事件
  public submitCategory(data:any):void{

  }

  // 确认修改表单按钮
  public _doPutCategory(category):void{
    this.addCategoryState = { ing: true,success:false};
    console.log(this.editCategory);
    this._service.putCategory(Object.assign(this.editCategory,category))
      .then((category) => {
        this.editCategory = null;
        this.getCategories(); //重新获取；
      })
      .catch((err) => {});
  }

  // 确认新增表单
  public _addCategory($event):void{
    this._service.addCategory($event)
      .then(result => {
        console.log(result);
      })
      .catch((err) => {});
  }

  // 获取表单
  public getCategories(params:any = {}):void{
    this._service.getCagetories(params)
      .then((categories) => {
        console.log(categories.result);
        this.categories = categories.result;
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
      .catch((err) => {})
  }

  // 多个删除
  public _delCategories(categories):void{
    this.categories = categories;
  }

  // 确认多个删除
  public _doDelCategories():void{

  }


  // 取消删除
  public _canceldDelCategory():void{
    this._delModal.hide();// 弹窗隐藏
  }



}
