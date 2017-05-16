import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { NotificationsService } from 'angular2-notifications';
import 'rxjs/add/operator/toPromise';

import { API_ROOT } from 'src/config'


@Injectable()
export class AnnouncementService{

  private _apiUrl = `${API_ROOT}/announcement`;


  constructor(private http:Http,  //暂时使用Http代替请求；
              private _notificationsService:NotificationsService){
    console.log(this._apiUrl);
  }

  //请求成功
  private handleResponse = (response: any): Promise<any> => {
    const data = response.json();
    console.log(data);
    if(data.code) {
      this._notificationsService.success(data.message, '数据请求成功');
      return Promise.resolve(data);
    } else {
      this._notificationsService.error(data.message, data.debug ? data.debug.message : data.message);
      return Promise.reject(data);
    }
  };

  //请求失败
  private handleError = (error: any): Promise<any> => {
    const errmsg = [500, 504].indexOf(error.status) > -1 ? error._body : JSON.parse(error._body).message;
    this._notificationsService.error('请求失败', errmsg);
    return Promise.reject(error);
  };

  //获取所有公告信息,这里最好使用Subject对象，这样可以多方推送数据
  public getAnnouncements(get_params):Promise<any>{
    let params:URLSearchParams = new URLSearchParams();//URLSearchParams  http组件中查看详情
    //Object.keys(obj):遍历对象所有的Key返回一个数组，keys数组遍历，把k全部添加到params中
    if(get_params) Object.keys(get_params).forEach(k => { params.set(k, get_params[k])});
    //console.log(params);
    return this.http  //
      .get(this._apiUrl,{search:params})
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  //添加公告
  public addAnnouncement(announcement:any): Promise<any> {
    return this.http
      .post(this._apiUrl, announcement)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  //批量删除
  public delAnnouncements(items:any):Promise<any> {
    return this.http
      .delete(this._apiUrl,new RequestOptions({ body: { items }}))
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  //单条公告删除,根据Id删除
  public delAnnouncement(item:any):Promise<any> {
    return this.http
      .delete(`${this._apiUrl}/${item._id}`)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);

  }

  //修改公告
  public putAnnouncement(item:any):Promise<any>{
    console.log(item);
    return this.http
      .put(`${this._apiUrl}/${item._id}`,item)
      .toPromise()
      .then(this.handleResponse)
      .catch()
  }

  //提示
  public setNotifications(messages){
    this._notificationsService.error(messages.title,messages.content);
  }
}
