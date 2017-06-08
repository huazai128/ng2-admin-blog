import { Injectable } from "@angular/core";
import { Http,Headers,RequestOptions } from "@angular/http"
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { NotificationsService } from "angular2-notifications";
import { API_ROOT } from "src/config";

@Injectable()
export class ArticleService{

  private apiUrl = `${API_ROOT}/article`;

  private editSubject = new Subject();
  private editSubject$ = this.editSubject.asObservable();  //转成Observable

  constructor(private _notificationsService:NotificationsService,
              private _http:Http){}

  // 监听变化
  public editNext(isEdit:boolean):void{
    this.editSubject.next(isEdit);
  }
  // 订阅
  public editSubscribe():Observable<any>{
    return this.editSubject;
  }

  // 请求成功
  private handleSuccess(res:any):Promise<any>{
    let data = res.json();
    if(data.code){
      this._notificationsService.success(data.message,"请求数据成功");
      return Promise.resolve(data);
    }else{
      this._notificationsService.success(data.message,"请求数据成功");
      return Promise.reject(data);
    }
  }

  // 请求失败
  private handleError(error:any):Promise<any>{
    const errmsg = [500, 504].indexOf(error.status) > -1 ? error._body : JSON.parse(error._body).message;
    this._notificationsService.error("请求数据成功",errmsg);
    return Promise.reject(error);
  }

  // 保存article
  public saveArticle(data:any):Promise<any>{
    console.log(data);
    return this._http.post(this.apiUrl,data)
      .toPromise()
      .then(this.handleSuccess)
      .catch(this.handleError)
  }

  //

}
