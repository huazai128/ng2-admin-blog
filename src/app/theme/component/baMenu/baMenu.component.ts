import { Component,Input,Output,EventEmitter,ViewEncapsulation } from "@angular/core";
import { Routes,Router,NavigationEnd } from "@angular/router"; //NavigationEnd:表示当导航成功结束时触发的事件
import { Subscription } from "rxjs/Rx"; //Subscription:是一个代表可以终止资源的对象

import { AppState } from "../../../app.service";
import { GlobalState } from "../../../global.state";
import { BaMenuService } from "./baMenu.service";


@Component({
  selector:"ba-menu",
  template:require("./baMenu.html"),
  styles:[require("./baMenu.scss")],
  encapsulation:ViewEncapsulation.None,
  providers:[BaMenuService]
})

export class BaMenu{
  //Input():用于获取父组件数据；Output():数组事件
  @Input() public menuRouter:Routes = [];
  @Input() public menuHeight:number;
  @Input() public sidebarCollapsed:boolean = false;
  @Output() menuExpand = new EventEmitter<any>();

  public menuItems:any[];   //
  public showHoverElem:boolean; //显示鼠标滑到当前下的样式
  public hoverElemHeight:number;//显示鼠标滑到当前下的样式高度
  public hoverElemTop:number;   //top的高度
  protected _onRouteChange:Subscription; //router的改变
  public outOfArea:number = -200; //默认top为－200

  constructor(
    private router:Router,
    private _service:BaMenuService,
    private _state:GlobalState,
    private _appState:AppState
  ){
    //events：是一个Observable()对象
    this._onRouteChange = this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        if(this.menuItems){
          this.selectMenuAndNotify();
        }else{
          //为什么要使用setTimeout
          setTimeout(() => this.selectMenuAndNotify());
        }
      }
    })
  }

  //初始化
  ngOnInit(){
    this.menuItems = this._service.convertRoutesToMenus(this.menuRouter);
    console.log(this.menuHeight);
  }

  //组件销毁
  public ngOnDestroy():void{
    this._onRouteChange.unsubscribe();  //
  }

  public selectMenuAndNotify():void{
    //判断routes数据是否存在
    if(this.menuItems){
      this.menuItems = this._service.selectMenuItem(this.menuItems); //对routes数据处理一下
      //用户通知路由的改变 并保存当前路由数据
      this._state.notifyDataChanged('menu.activeLink', this._service.getCurrentItem());//
    }
  }

  //自定义事件
  public hoverItem($event):void{ //通过子组件事件传递数据到父组件
    console.log($event);//自组件事件特性
    this.showHoverElem = true;
    this.hoverElemHeight = $event.currentTarget.clientHeight;
    this.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - 45;
    console.log(this.hoverElemTop);
  }

  //自定义事件
  public toggleSubMenu($event):boolean{
    //
    let submenu = jQuery($event.currentTarget).next();
    if(this.sidebarCollapsed){
      this.menuExpand.emit(null); //
      if(!$event.item.expanded){
        $event.item.expanded = true;
      }
    }else{
      $event.item.expanded = !$event.item.expanded;
      submenu.slideToggle();
    }
    return false;
  }
}
