import { Component,ViewEncapsulation } from "@angular/core"

@Component({
  selector:"ba-article",
  template:`<router-outlet></router-outlet>`,
  encapsulation:ViewEncapsulation.None
})

export class Article {
  constructor(){}
}
