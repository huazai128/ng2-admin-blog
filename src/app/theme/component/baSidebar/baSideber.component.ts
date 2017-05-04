import { Component,ElementRef,HostListener,ViewEncapsulation } from "@angular/core";
import { GlobalState } from "../../../global.state";
import { MENU } from "../../../../app/app.menu";
import { layoutSizes } from "../../../theme";
import * as _ from "lodash";


@Component({
  selector:"ba-sidebar",
  template:require("./baSidebar.html"),
  styles:[require("./baSidebar.scss")],
  encapsulation:ViewEncapsulation.None
})

export class BaSidebar{
  //路由数据
  public routes = _.cloneDeep(MENU); //深度clone
  //menu高度
  public menuHeight:number;

  //menu是否折叠
  public isMenuCollapsed:boolean = false;
  public isMenuShouldCollapsed:boolean = false;

  constructor(private _elementRef:ElementRef, private _state:GlobalState) {
    //订阅
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }
  //初始化调用
  public ngOnInit():void {
    if (this._shouldMenuCollapse()) {
      this.menuCollapse();
    }
  }
  //视图加载之后调用
  public ngAfterViewInit():void {
    setTimeout(() => this.updateSidebarHeight());
  }

  //监听浏览器的变化
  @HostListener('window:resize')
  public onWindowResize():void {
    var isMenuShouldCollapsed = this._shouldMenuCollapse();
    if (this.isMenuShouldCollapsed !== isMenuShouldCollapsed) {
      //当浏览器宽度小于1200
      this.menuCollapseStateChange(isMenuShouldCollapsed);
    }
    this.isMenuShouldCollapsed = isMenuShouldCollapsed;
    this.updateSidebarHeight();
  }

  //自定义事件
  public menuExpand():void {
    this.menuCollapseStateChange(false);
  }

  public menuCollapse():void {
    this.menuCollapseStateChange(true);
  }
  //当浏览器宽度小于1200触发
  public menuCollapseStateChange(isCollapsed:boolean):void {
    this.isMenuCollapsed = isCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
  }
  public updateSidebarHeight():void {
    //sideber的高度
    this.menuHeight = this._elementRef.nativeElement.childNodes[0].clientHeight - 215
    console.log(this.menuHeight);
  }

  private _shouldMenuCollapse():boolean {
    //判断浏览器窗口是否小于1200
    return window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
  }

}
