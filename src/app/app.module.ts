import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule,Http,RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { provideAuth,AUTH_PROVIDERS } from 'angular2-jwt'; //使用AuthToken是要配置；用于验证用户用户是否存在、是否有效、是否过期
import { SimpleNotificationsModule } from 'angular2-notifications'; //信息提示
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

import { ENV_PROVIDERS } from './environment';
import { routing } from './app.routing';

import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from "./pages/pages.module";


const APP_PROVIDERS = [
  AppState,
  GlobalState
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    NgaModule.forRoot(),
    PagesModule,
    routing
  ],
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS,
    AUTH_PROVIDERS,
    provideAuth({ // 配置选项
      headerName: 'Authorization', // 标题名称
      headerPrefix: 'Bearer', // 标题前缀
      tokenName: 'id_token', // 令牌名称
      tokenGetter() { return localStorage.getItem('id_token')}, // 获取令牌
      globalHeaders: [{'Content-Type': 'application/json'}], // 格式限制
      noJwtError: false,
      noTokenScheme: false
    })
  ]
})

export class AppModule {

  constructor(public appRef: ApplicationRef, public appState: AppState) {}

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    this.appState._state = store.state;
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    const state = this.appState._state;
    store.state = state;
    store.disposeOldHosts = createNewHosts(cmpLocation);
    store.restoreInputValues = createInputTransfer();
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
