import { Injectable,EventEmitter } from '@angular/core';
import { Subject } from "rxjs/Subject"; //是一个特殊的可观者对象，可以多路推送数据
import { Observable } from "rxjs/Rx";   //可观察者对象


export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppState {
  //
  private stateChange = new Subject();
  state$ = this.stateChange.asObservable();

  _state: InternalStateType = {
    adminInfo: {
      gravatar: 'assets/img/app/profile/Andrey.png',
      name: '管理员',
      slogan: '博客管理后台'
    }
  };

  constructor() {
  }

  // already return a clone of the current state
  get state() {
    return this._state = this._clone(this._state);
  }

  // never allow mutation
  set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }


  get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }


  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify(object));
  }
}
