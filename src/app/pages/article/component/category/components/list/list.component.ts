import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";

@Component({
  selector:"category-list",
  template:require("./list.html"),
  styles:[require("./list.scss")],
  encapsulation:ViewEncapsulation.None
})

export class CategoryList{

  @Input() categories:any; // 输入 分类数据
  @Output() _editCategory = new EventEmitter(); // 编辑对象事件
  @Output() _delCategory = new EventEmitter(); // 删除对象事件
  @Output() _delCategories = new EventEmitter(); // 多个删除事件

  public categoriesSelectAll:boolean = false; // 判断是否全选
  public selectedCagetories = []; //用于存储选择对象

  constructor(){}

  // 编辑category
  public baEditCategory(category):void{
    this._editCategory.emit(category);
  }

  // 点击删除
  public delCategory(category:any):void{
    this._delCategory.emit(category);
  }

  // 全选
  public baSelectedAll($event:Boolean):void{

  }
}
