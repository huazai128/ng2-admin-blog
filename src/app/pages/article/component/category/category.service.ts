import { Injectable } from "@angular/core";
import { Http,Headers,RequestOptions,URLSearchParams } from "@angular/http";
import { NotificationsService } from "angular2-notifications";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { API_ROOT } from "src/config";

@Injectable()
export class CategoryService{

  private apiUrl = `${API_ROOT}/category`;

  constructor(private _http:Http,
              private _notificationsService:NotificationsService){}

  // 成功处理
  private handleResponse = (response:any):Promise<any> => {
    const data = response.json();
    if(data.code){
      this._notificationsService.success(data.message,"请求成功");
      return Promise.resolve(data);
    }else{
      this._notificationsService.error(data.message,"请求失败");
      return Promise.reject(data)
    }
  };

  //失败处理
  private handleError = (error:any):Promise<any> => {
    console.log(error);
    const errmsg = [500,504].indexOf(error.status) > -1 ? error._body : JSON.parse(error._body).message;
    this._notificationsService.error("请求失败",errmsg);
    return Promise.reject(error);
  };


  // 保存category
  public addCategory(category:any):Promise<any> {
    console.log(category);
    return this._http.post(this.apiUrl,category)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // 获取所有分类
  public getCagetories(get_params:any):Promise<any>{
    const options:URLSearchParams = new URLSearchParams();
    Object.keys(get_params).forEach((key) => {
      options.set(key,get_params[key]);
    });
    options.set("per_page","100");
    return this._http.get(this.apiUrl,{search:options})
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // 修改分类
  public putCategory(category):Promise<any>{
    console.log(category);
    return this._http.put(`${this.apiUrl}/${category._id}`,category)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // 单个删除
  public deleteCategory(_id):Promise<any>{
    return this._http.delete(`${this.apiUrl}/${_id}`)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // 删除多个
  public deleteCategories(data):Promise<any>{
    console.log(data);
    return this._http.delete(this.apiUrl,new RequestOptions({body: data}))
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

}
