import { Injectable } from "@angular/core";

@Injectable()
export class BaImageLoader{
  public loader(src):Promise<any>{
    return new Promise((resolve,reject) => {
      let image = new Image();
      image.onload = function () {
        resolve('Image with src ' + src + ' loaded successfully.');
      }
      image.src = src;
    })
  }
}
