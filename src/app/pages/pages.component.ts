import { Component } from "@angular/core";

@Component({
  selector:"app-pages",
  template:`
    <ba-sidebar></ba-sidebar>
    <ba-navbar-top></ba-navbar-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class="al-footer-right">Created with <i class="ion-heart"></i></div>
      <div class="al-footer-main clearfix">
        <div class="al-copy">&copy; <a href="https://github.com/huazai128">NodePress</a> 2017</div>
        <ul class="al-share clearfix" *ngIf="false">
          <li><i class="socicon socicon-facebook"></i></li>
          <li><i class="socicon socicon-twitter"></i></li>
          <li><i class="socicon socicon-google"></i></li>
          <li><i class="socicon socicon-github"></i></li>
        </ul>
      </div>
    </footer>
    <ba-back-top [position]="200"></ba-back-top>
  `
})

export class Pages{

}
