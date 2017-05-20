import { Component,ViewEncapsulation,Input } from "@angular/core"

@Component({
  selector:"ba-card",
  template:require("./baCard.html"),
  styles:[require("./baCard.scss")],
  encapsulation:ViewEncapsulation.None
})

export class BaCard{
  @Input() title:string;
  @Input() baCardClass:string;

  constructor(){

  }
  ngOnInit(){
    console.log(this.baCardClass);
  }
}
