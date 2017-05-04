import { Pipe,PipeTransform } from "@angular/core";
import { layoutPaths } from "../../../theme";
//自定义管道

@Pipe({name:"baProfilePicture"})
export class BaProfilePicture implements PipeTransform{
  transform(input:string,ext = "png"):string{
    return layoutPaths.images.profile + input + "." + ext;
  }
}
