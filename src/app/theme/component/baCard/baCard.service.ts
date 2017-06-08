import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";  //是一个特殊的subscribe
import { BaMetrics } from "./baMetries";

@Injectable()
export class BaCardService{
  private image:HTMLImageElement; //是否就有image的属性
  private imageLoadSubject:Subject<void>;

  ngOnInit(){
    console.log(this.image);
  }

  public init(){
    this._genBgImage();
    this._genImageLoadSubject();
  }

  //加载bg
  public bodyBgLoad():Subject<void>{
    return this.imageLoadSubject;
  }

  //bgImages赋值
  public getBodyBgImageSizes():BaMetrics{
    let eleW = document.documentElement.clientWidth;
    let eleH = document.documentElement.clientHeight; //获取浏览器的宽高
    //判断浏览器是否小于640
    if(eleW <= 640)return;
    let imgRatio = (this.image.height / this.image.width); //图片的宽高比
    let containerRatio = (eleW / eleH);  //浏览器的宽高比
    let finalHeight,finalWidth;
    if(containerRatio > imgRatio){
      finalHeight = eleH;
      finalWidth = (eleW / imgRatio);
    }else{
      finalWidth = eleW;
      finalHeight = (eleH * imgRatio);
    }
    return { width: finalWidth, height: finalHeight, positionX: (eleW - finalWidth)/2, positionY: (eleH - finalHeight)/2};
  }

  //获取图片
  private _genBgImage():void{
    this.image = new Image();
    let computedStyle = getComputedStyle(document.body.querySelector("main"),":before");//用语获取css样式
    console.log(computedStyle);
    //获取样式图片
    this.image.src = computedStyle.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2')
  }

  //
  public _genImageLoadSubject():void{
    this.imageLoadSubject = new Subject<void>(); //是image具有Subject属性
    this.image.onerror = (err) => {
      this.imageLoadSubject.complete();  //完成
    };
    this.image.onload = () => {
      this.imageLoadSubject.next(null);  //next()：传值
      this.imageLoadSubject.complete();  //结束
    }
  }
}
