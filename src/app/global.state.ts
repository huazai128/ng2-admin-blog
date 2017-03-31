import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';  //相当于一个事件发射器，是唯一能够向多个Observer广播值( value )的唯一手段，有点类似于EventListen
/**
 * 状态服务
 */
@Injectable()
export class GlobalState {
  private _data = new Subject<Object>();   //是Rx中一种比较特殊的Observable观察者对象，可以向多方推送数据；而Observable不具备；泛型为Object表示继承Subject也行，_date是一个对象
  private _dataStream$ = this._data.asObservable();
  private _subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>(); //继承Map特性,可以使用set、get方法设置key和value来获取值设置的值
  constructor() {
    this._dataStream$.subscribe((data) => this._onEvent(data)); //订阅
  }
  //用于数据变化通知
  notifyDataChanged(event, value) {
    let current = this._data[event];
    if (current !== value) {
      this._data[event] = value;

      this._data.next({
        event: event,
        data: this._data[event]
      });
    }
  }

  //用于订阅
  subscribe(event: string, callback: Function) {
    let subscribers = this._subscriptions.get(event) || [];//具有Map的特性可以使用get、set方法
    subscribers.push(callback);
    this._subscriptions.set(event, subscribers);//设置Key
  }

  //监听事件的触发
  _onEvent(data: any) {
    let subscribers = this._subscriptions.get(data['event']) || [];
    subscribers.forEach((callback) => {
      callback.call(null, data['data']);
    });
  }
}
