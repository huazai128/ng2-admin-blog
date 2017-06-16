import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";

@Component({
  selector:"category-list",
  template:require("./list.html"),
  styles:[require("./list.scss")],
  encapsulation:ViewEncapsulation.None
})

export class CategoryList{

  @Input() categories:any; // 输入分类数据
  @Output() _editCategory = new EventEmitter(); // 编辑对象事件
  @Output() _delCategory = new EventEmitter(); // 删除对象事件
  @Output() _delCategories = new EventEmitter(); // 多个删除事件
  @Output() refreshList = new EventEmitter(); // 刷新

  public categoriesSelectAll:boolean = false; // 判断是否全选
  public selectedCategories = []; //用于存储选择删除的对象

  constructor(){}

  // 编辑category
  public baEditCategory(category):void{
    console.log(category);
    this._editCategory.emit(category);
  }

  // 点击删除
  public delCategory(category:any):void{
    this._delCategory.emit(category);
  }

  // 全选
  public baSelectedAll(value):void{
    if(!this.categories.data) return;
    this.selectedCategories = [];
    let _categories = this.categories.data;
    _categories.forEach((category) => {
      category.selected = value;
      category.selected && this.selectedCategories.push(category._id);
    });
  }

  // 点击全部删除
  public delCategories():void{
    console.log(this.selectedCategories);
    this._delCategories.emit(this.selectedCategories);
  }

  // 自定义选择
  public baSelected(value):void{
    this.selectedCategories = [];
    this.categories.data.forEach((category) => {
      category.selected && this.selectedCategories.push(category._id);
    });
    if(!this.selectedCategories.length) this.categoriesSelectAll = false;
    if(!!this.selectedCategories.length && this.selectedCategories.length == this.categories.data.length) this.categoriesSelectAll = true;
  }

  public ngOnChanges(change):void{

    console.log("===========")
  }
}
