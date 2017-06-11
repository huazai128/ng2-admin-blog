import { Injectable } from "@angular/core";
import { Http,Headers,URLSearchParams,RequestOptions } from "@angular/http";  //http请求组件
import { NotificationsService } from "angular2-notifications";
import { API_ROOT } from "src/config";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TagService{
  //
  private apiUrl = `${API_ROOT}/tag`;

  constructor(private _notificationsService:NotificationsService,
              private _http:Http){
  }
  // 成功处理
  private handleReaponse = (response:any):Promise<any> => {
    const data = response.json();
    console.log(data);
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

  //添加
  public addTag(tagObj:any):Promise<any> {
    console.log(this.apiUrl);
    return this._http.post(`${this.apiUrl}`,tagObj)
      .toPromise()
      .then(this.handleReaponse)
      .catch(this.handleError);
  };

  //获取所有tags
  public getTags(get_option:any):Promise<any> {
    const options:URLSearchParams = new URLSearchParams();
    if(get_option){
      Object.keys(get_option).forEach(key => {
        options.set(key,get_option[key]);
      })
    }
    console.log(options);
    return this._http.get(this.apiUrl,{search:options}) //对象
      .toPromise()
      .then(this.handleReaponse)
      .catch(this.handleError);
  }

  //根据tag ID删除
  public deleteTag(_id:any):Promise<any>{
    return this._http.delete(`${this.apiUrl}/${_id}`)
      .toPromise()
      .then(this.handleReaponse)
      .catch(this.handleError);
  }

  // 根据tag ID修改
  public putTag(tag:any):Promise<any> {
    return this._http.put(`${this.apiUrl}/${tag._id}`,tag)
      .toPromise()
      .then(this.handleReaponse)
      .catch(this.handleError);
  }

  // 批量删除
  public delTags(tags:any):Promise<any>{
    return this._http.delete(`${this.apiUrl}`, new RequestOptions({ body: { tags }}))
      .toPromise()
      .then(this.handleReaponse)
      .catch(this.handleError);
  }
}
