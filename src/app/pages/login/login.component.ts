import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup,FormBuilder,AbstractControl,Validators } from "@angular/forms";//form表单严重
import { LoginService } from "./login.server";

@Component({
  selector:"app-login",
  encapsulation:ViewEncapsulation.None,
  template:require("./login.html"),
  styles:[require("./login.scss")]
})
export class Login{

  public loginForm:FormGroup;
  public username:AbstractControl;
  public password:AbstractControl;

  constructor(private _service:LoginService,
              private _fb:FormBuilder,
              private router:Router){
    this.loginForm = this._fb.group({
      'username':['',Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(26)])],
      'password':['',Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(26)])]
    });
    this. username = this.loginForm.controls["username"];
    this.password = this.loginForm.controls['password'];
  }

  // 登陆
  public login(value:any){
    if(this.loginForm.valid){
      this._service.getLogin(this.loginForm.value)
        .then(({result}) => {
        console.log(result);
          if(result.token){
            localStorage.setItem("id_token",result.token);
            console.log(this._service.loggedIn());
            this.router.navigate(['/']);
          }
        })
        .catch((err) => {})
    }
  }

  // 获取用户信息
  public getUser():void{
    this._service.getUser().then((result) => {
      console.log(result);
    })
    .catch(() => {})
  }

  ngOnInit(){
    //this.getUser();
  }
}
