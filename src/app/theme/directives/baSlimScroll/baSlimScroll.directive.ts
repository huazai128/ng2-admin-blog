import { Directive,Input,Output,ElementRef,EventEmitter } from "@angular/core";
import "jquery-slimscroll"

@Directive({
  selector:"[baSlimScroll]" //
})
export class BaSlimScroll{
  @Input() public baSlimScrollOptions :Object;

  constructor(private _el:ElementRef){}

  ngOnChanges(change){
    this._scroll();
  }

  private _scroll(){
    this._init();
  }

  private _init(){
    jQuery(this._el.nativeElement).slimScroll(this.baSlimScrollOptions);

  }

  private _destroy(){
    jQuery(this._el.nativeElement).slimScroll({destroy:true})
  }
}
