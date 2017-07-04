import {Injectable} from "@angular/core";
import { AuthHttp } from "angular2-jwt";
import { RequestOptions,Headers,Http,URLSearchParams } from "@angular/http";
import { NotificationsService } from "angular2-notifications";
import { API_ROOT } from "src/config";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class OptionsService{

  private authUrl = `${API_ROOT}/auth`;
  private optionUrl = `${API_ROOT}/option`;

  constructor(private authHttp:AuthHttp,
              private _notificationsService:NotificationsService){}

//请求成功
  private handleResponse = (response: any): Promise<any> => {
    const data = response.json();
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


  // 获取配置信息
  public getOptions():Promise<any>{
    return this.authHttp.get(this.optionUrl)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // 编辑或保存配置信息
  public putOption(option:any):Promise<any>{
    return this.authHttp.put(this.optionUrl,option)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);

  }

  // 获取auth信息
  public getAuth():Promise<any>{
    console.log(this.authUrl);
    return this.authHttp.get(this.authUrl)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // 编辑auth信息
  public putAuth(auth:any):Promise<any>{
    console.log(auth);
    return this.authHttp.put(this.authUrl,auth)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

}
