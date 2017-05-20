import { Component,ViewEncapsulation } from "@angular/core";

@Component({
  selector:"category-list",
  template:require("./list.html"),
  styles:[require("./list.scss")],
  encapsulation:ViewEncapsulation.None
})

export class CategoryList{
  public categoriesSelectAll:boolean = false;
}
