import { Injectable } from "@angular/core";
import { Headers,Http } from "@angular/http";
import { tokenNotExpired } from "angular2-jwt";
import { NotificationsService } from "angular2-notifications";
import 'rxjs/add/operator/toPromise';
import { API_ROOT } from "src/config";

@Injectable()
export class LoginService{

  constructor(private authHttp:Http,
              private notificationsService:NotificationsService){}

  private apiUrl = `${API_ROOT}/auth`;

  // 获取数据成功
  private handleResponse = (res:any) => {
    const data = res.json();
    if(data.code){
      this.notificationsService.success("登陆提示",data.message);
      return Promise.resolve(data);
    }else{
      this.notificationsService.error(data.message, data.debug ? data.debug.message : data.message, { timeOut: 1000 });
      return Promise.reject(data);
    }
  };

  private handleError = (error:any) => {
    const errmsg = [500, 504].indexOf(error.status) > -1 ? error._body : JSON.parse(error._body).message;
    this.notificationsService.error('登陆失败', errmsg, { timeOut: 1000 });
    return Promise.reject(error);
  };

  // 登陆用户
  public getLogin(user):Promise<any>{
    return this.authHttp.post(this.apiUrl,user)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  };

  // 获取用户信息
  public getUser():Promise<any>{
    return this.authHttp.get(this.apiUrl)
      .toPromise()
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // 判断是否登陆
  loggedIn(){
    return tokenNotExpired();
  }


}
