import "./app.loader.ts";
import { Component, ViewContainerRef,ViewEncapsulation } from '@angular/core';
import { GlobalState } from './global.state';
import { Router } from "@angular/router";
import { BaThemeConfig } from './theme/theme.config';
import { BaThemeSpinnerServer,ProloaderServer,BaImageLoader } from "./theme/service";
import { NotificationsService } from 'angular2-notifications';
import { tokenNotExpired } from 'angular2-jwt';
import { layoutPaths } from './theme/theme.constants';
import { AppState } from "./app.service";

import 'style-loader!./app.scss';  //样式的引入
import 'style-loader!./theme/initial.scss';


@Component({
  selector: 'app',
  encapsulation:ViewEncapsulation.None, //
  // styles:[require("normalize.css"),require("./app.scss")], //样式导入
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <simple-notifications [options]="notificationsOptions"></simple-notifications>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
  `,
  providers:[AppState]
})

export class App {

  public isMenuCollapsed: boolean = false;
  public optionIsInited: boolean = false;

  constructor(private _state: GlobalState,
              private _spinner:BaThemeSpinnerServer,
              private viewContainerRef: ViewContainerRef,
              private themeConfig: BaThemeConfig,
              private _router:Router,
              private notifications:NotificationsService,
              private _imageLoader:BaImageLoader,
              private _appState:AppState) {

    // 全局
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
        this.isMenuCollapsed = isCollapsed;
    });

    //监听路由的变化
    this._router.events.subscribe((event) => { //events:是一个Observable
      const url = this._router.url;
      if(!Object.is(url,'/') && !Object.is(url,"/login")){
        this.routerCheck();
      }
    });

    this._loaderImages();
  }

  // 通知配置
  public notificationsOptions = {
    position: ['top', 'right'],
    timeOut: 500,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 5,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: false
  };

  // 程序初始化，关闭加载状态
  public ngAfterViewInit(): void {
    ProloaderServer.load().then((values) => {
      this._spinner.hide();
    });
  }

  // 图片加载
  private _loaderImages():void{
    ProloaderServer.registerLoader(this._imageLoader.loader(layoutPaths.images.root + 'sky-bg.jpg'))
  }

  // 判断是否登陆
  public loggedIn(){
    return tokenNotExpired(); // 允许您检查本地存储中是否存在未过期的JWT
  }

  // 路由检查
  private routerCheck():void{
    console.log(this.loggedIn());
    if(!this.loggedIn()){ // 验证token是否过期
      setTimeout(() => {
        this.notifications.error('长的太丑了，不见！！！', '...', { timeOut: 1000 });
        this._router.navigate(['/login']); // 倒入到登陆页面
      },0)
    }else if(!this.optionIsInited){
      this.initAppOptions();
    }
  }

  // 获取用户信息
  public initAppOptions():void{
    this._router.navigate(['/dashboard']);
    this.optionIsInited = true;
    console.log("允许访问");
  }

  // 初始化
  public ngOnInit():void{
    console.log(localStorage.getItem("id_token"));
    this.routerCheck();
  }
}
