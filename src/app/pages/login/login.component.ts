import { Component, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector:"app-login",
  encapsulation:ViewEncapsulation.None,
  template:require("./login.html"),
  styles:[require("./login.scss")]
})
export class Login{

}
