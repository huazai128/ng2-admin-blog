import { Component,ViewChild,HostListener,Input,ElementRef,ViewEncapsulation } from "@angular/core";

@Component({
  selector:"ba-back-top",
  template:`<i #baBackTop class="fa fa-angle-up back-top ba-back-top" title="Back to Top"></i>`,
  styles:[require("./baBackTop.scss")],
  encapsulation:ViewEncapsulation.None
})

export class BaBackTop{
  @Input() position:number = 400;
  @Input() showSpeed:number = 500;
  @Input() moveSpeed:number = 1000;

  @ViewChild("baBackTop") private _selector:ElementRef;

  ngOnInit(){
    console.log(this._selector.nativeElement);
  }

  @HostListener("click")
  public _onClick():boolean{
    $("html,body").animate({scrollTop:0},{duration:this.moveSpeed});
    return false;
  }

  @HostListener("window:scroll")
  public _onWindowScroll():void{
    let el = this._selector.nativeElement;
    window.scrollY > this.position ? jQuery(el).fadeIn(this.showSpeed) : jQuery(el).fadeOut(this.showSpeed)
  }
}
