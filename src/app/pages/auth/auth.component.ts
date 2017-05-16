import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector:"auth",
  encapsulation:ViewEncapsulation.None,
  template:require("./auth.html"),
  styles:[require("./auth.scss")]
})


export class AuthComponent{
  constructor(){}
}
