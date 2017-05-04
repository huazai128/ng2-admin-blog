import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";

@Component({
  selector:"ba-menu-item",
  template:require("./baMenuItem.html"),
  styles:[require("./baMenuItem.scss")],
  encapsulation:ViewEncapsulation.None
})

export class BaMenuItem{
  @Input() menuItem:any;  //每一个router数据
  @Input() child:boolean = false;

  @Output() itemHover = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();

  //鼠标进入触发
  public onHoverItem($event):void{
    this.itemHover.emit($event); //把当前$event传递给父组件;
  }

  //点击事件
  public onToggleSubMenu($event,item):boolean{
    $event.item = item;
    this.toggleSubMenu.emit($event);
    return false;
  }

}
