import { Injectable } from "@angular/core";
import { Http,Headers,RequestOptions,URLSearchParams} from "@angular/http";
import { NotificationsService } from "angular2-notifications";
import { AuthHttp } from "angular2-jwt";

import { API_ROOT } from "src/config";

@Injectable()
export class ListService{

  private apiUrl = `${API_ROOT}/article`;

  constructor(private http:AuthHttp,
              private _notificationsService:NotificationsService){}

  // 处理成功
  private handleSuccess = (res:any):Promise<any> => {
    let data = res.json();
    if(data.code){
      this._notificationsService.success(data.message,"获取数据成功");
      return Promise.resolve(data);
    }else{
      this._notificationsService.error(data.message, data.debug ? data.debug.message : data.message);
      return Promise.reject(data);
    }
  };

  // 处理失败
  private handleError = (error:any): Promise<any> => {
    const errmsg = [500, 504].indexOf(error.status) > -1 ? error._body : JSON.parse(error._body).message;
    this._notificationsService.error("请求数据成功",errmsg);
    return Promise.reject(error);
  };

  // 获取articles
  public getArticles(get_params:any):Promise<any>{
    let params: URLSearchParams = new URLSearchParams();
    console.log(get_params);
    if (get_params) {
      Object.keys(get_params).forEach(k => {
        params.set(k, get_params[k])
      });
    }
    return this.http.get(this.apiUrl,{ search: params })
      .toPromise()
      .then(this.handleSuccess)
      .catch(this.handleError);
  };

  // 批量删除
  public deleteArticles(articles:any):Promise<any>{
    console.log(articles);
    return this.http
      .delete(this.apiUrl,new RequestOptions({body:{ articles }}))
      .toPromise()
      .then(this.handleSuccess)
      .catch(this.handleError)
  }

  // 批量操作更改；
  public moveArticle(articles:any,action:number):Promise<any>{
    return this.http
      .patch(this.apiUrl,{ articles,action: action})
      .toPromise()
      .then(this.handleSuccess)
      .catch(this.handleError);
  }


}

