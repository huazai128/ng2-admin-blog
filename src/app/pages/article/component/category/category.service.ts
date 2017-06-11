import { Injectable } from "@angular/core";
import { Http,Headers,RequestOptions } from "@angular/http";
import { NotificationsService } from "angular2-notifications";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';


import { API_ROOT } from "src/config";

@Injectable()
export class CategoryService{

  private apiUrl = `{ API_ROOT }/category`;

  constructor(private _http:Http,
              private _notificationsService:NotificationsService){}

  // 处理成功
  private handleSuccess = (res:any):Promise<any> => {
    let data = res.join();
    if(data.code){
      this._notificationsService.success(data.message,"数据请求成功");
      return Promise.reject(data);
    }else{
      this._notificationsService.error(data.message,"数据请求失败");
      return Promise.reject(data)
    }
  };

  // 处理失败
  private handleError = (err:any):Promise<any> => {
    const errmsg = [504,500].indexOf(err.status) > -1 ? err._body : JSON.parse(err._body).message;
    this._notificationsService.error(errmsg,"数据请求失败");
    return Promise.reject(err);
  }


  // 保存category
  public addCategory(category:any):Promise<any> {
    return this._http.post(this.apiUrl,category)
      .toPromise()
      .then(this.handleSuccess)
      .catch(this.handleError);

  }

}
