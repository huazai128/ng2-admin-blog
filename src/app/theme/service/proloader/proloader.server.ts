import { Injectable } from "@angular/core";

@Injectable()
export class ProloaderServer{

  private static _loaders:Array<Promise<any>> = [];

  public static registerLoader(method:Promise<any>):void{
    this._loaders.push(method)
  }

  public static clear():void{
    this._loaders = [];
  }

  public static load():Promise<any>{
    return new Promise((resolve,reject) => {
     this._executeAll(resolve);
    })
  }

  private static _executeAll(done:Function):void{
    setTimeout(() => {
      Promise.all(this._loaders).then((values) => {
        console.log(values);
        done.call(null,values)
      }).catch((err) => {
        console.log(err);
      })
    })
  }
}
