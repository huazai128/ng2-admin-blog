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
    this._service.putCategory(category)
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
  public putCategory($event):void{
    this.editCategory = $event;
  }

  // 删除单个对象
  public _delCategory($event):void{

  }

}
