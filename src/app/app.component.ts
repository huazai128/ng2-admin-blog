import { Component, ViewContainerRef,ViewEncapsulation } from '@angular/core';
import { GlobalState } from './global.state';
import { Router } from "@angular/router";
import { BaThemeConfig } from './theme/theme.config';
import { BaThemeSpinnerServer,ProloaderServer,BaImageLoader } from "./theme/service";
// import { NotificationsService } from 'angular2-notifications';
import { tokenNotExpired } from 'angular2-jwt';
import { layoutPaths } from './theme/theme.constants';

import 'style-loader!./app.scss';  //样式的引入
import 'style-loader!./theme/initial.scss';

@Component({
  selector: 'app',
  encapsulation:ViewEncapsulation.None, //
  // styles:[require("normalize.css"),require("./app.scss")], //样式导入
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
  `
})

export class App {
  isMenuCollapsed: boolean = false;
  constructor(private _state: GlobalState,
              private _spinner:BaThemeSpinnerServer,
              private viewContainerRef: ViewContainerRef,
              private themeConfig: BaThemeConfig,
              private _router:Router,
              // private notifications:NotificationsService,
              private _imageLoader:BaImageLoader

  ) {
      this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
          this.isMenuCollapsed = isCollapsed;
      });
      //监听路由的变化
      this._router.events.subscribe((event) => { //events:是一个Observable
        console.log("路由发生变化了")
      })
  }

  //视图初始化后加载
  ngAfterViewInit():void{
    ProloaderServer.load().then((values) => {
      this._spinner.hide();
    })
  }

  private _loaderImages():void{
    ProloaderServer.registerLoader(this._imageLoader.loader(layoutPaths.images.root + 'sky-bg.jpg'))
  }
}
