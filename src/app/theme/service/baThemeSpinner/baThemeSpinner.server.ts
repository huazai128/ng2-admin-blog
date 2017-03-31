import { Injectable } from "@angular/core";

@Injectable()
export class BaThemeSpinnerServer{
  private _selector:string = "preloader";
  private el:HTMLElement;

  constructor(){
    this.el = document.getElementById(this._selector);
  }

  public show():void{
    this.el.style["display"] = "block";
  }

  public hide(delay:number = 0):void{
    setTimeout(() => {
      this.el.style['display'] = "none"
    },delay)
  }
}
