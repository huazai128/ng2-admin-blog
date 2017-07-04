import { Injectable } from "@angular/core";
import { Http,Headers,RequestOptions } from "@angular/http"
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { NotificationsService } from "angular2-notifications";
import { API_ROOT } from "src/config";
import { AuthHttp } from "angular2-jwt"

@Injectable()
export class ArticleService{

  private apiUrl = `${API_ROOT}/article`;

  private editSubject = new Subject();
  private editSubject$ = this.editSubject.asObservable();  //转成Observable

  constructor(private _notificationsService:NotificationsService,
              private _http:AuthHttp){}

  // 监听变化
  public editNext(isEdit:boolean):void{
    this.editSubject.next(isEdit);
  }

  // 订阅
  public editSubscribe():Observable<any>{
    return this.editSubject;
  }

  // 请求成功
  private handleSuccess = (res:any):Promise<any> => {
    let data = res.json();
    console.log(data);
    if(data.code){
      this._notificationsService.success(data.message,"请求数据成功");
      return Promise.resolve(data);
    }else{
      this._notificationsService.error(data.message, data.debug ? data.debug.message : data.message);
      return Promise.reject(data);
    }
  };

  // 请求失败
  private handleError = (error:any):Promise<any> => {
    console.log(error);
    const errmsg = [500, 504].indexOf(error.status) > -1 ? error._body : JSON.parse(error._body).message;
    this._notificationsService.error("请求数据成功",errmsg);
    return Promise.reject(error);
  };

  // 发布文章
  public addArticle(article:any):Promise<any>{
    console.log(this.apiUrl);
    return this._http.post(this.apiUrl,article)
      .toPromise()
      .then(this.handleSuccess)
      .catch(this.handleError)
  }

  // 根据id获取文章信息
  public getArticle(id):Promise<any>{
    console.log(id);
    return this._http.get(`${this.apiUrl}/${id}`)
      .toPromise()
      .then(this.handleSuccess)
      .catch(this.handleError)
  }

  // 根据id修改文章
  public putArticle(article:any):Promise<any>{
    return this._http.put(`${this.apiUrl}/${article._id}`,article)
      .toPromise()
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

}
