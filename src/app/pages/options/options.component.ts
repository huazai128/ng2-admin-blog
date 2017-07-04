import { Component,ViewEncapsulation } from "@angular/core";
import { FormGroup,AbstractControl,FormBuilder,Validators } from "@angular/forms";
import { OptionsService } from "./options.service";
import { EqualPasswordsValidator,EmailValidator } from "../../theme/validate";

@Component({
  selector:"app-options",
  template: require("./options.html"),
  styles:[require("./options.scss")],
  encapsulation:ViewEncapsulation.None
})

export class OptionsComponent{

  // option 表单
  public optionsForm:FormGroup;
  public blacklist:FormGroup; //
  public title:AbstractControl;  // 标题
  public sub_title:AbstractControl; //  副标题
  public keywords:AbstractControl; // 关键字
  public email:AbstractControl; // email
  public description:AbstractControl; // 描述
  public site_icp:AbstractControl; // ICP 备案
  public ping_sites:AbstractControl; // SEO
  public site_url:AbstractControl; // 站点地址
  public ips:AbstractControl; // 黑名单-IP;
  public mails:AbstractControl; // 黑名单 email
  public keyword:AbstractControl; // 黑名单-关键字
  public _id:AbstractControl; // Id

  // auth 表单
  public authForm:FormGroup;
  public name:AbstractControl;  // 个人姓名
  public slogan:AbstractControl; // 个人签名
  public gravatar:AbstractControl; // 头像
  public old_password:AbstractControl; // 旧密码
  public new_password:AbstractControl; // 新密码
  public rel_password:AbstractControl; // 确认密码
  public passwords:FormGroup;

  constructor(private _fb:FormBuilder,
              private _optionService:OptionsService){
    // options
    this.optionsForm = this._fb.group({
      '_id':[null],
      'title':['',Validators.compose([Validators.required])],
      'sub_title':['',Validators.compose([Validators.required])],
      'keywords':[[]],
      'email':['',Validators.compose([Validators.required,Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")])],
      'description':['',Validators.compose([Validators.required])],
      'site_icp': [],
      'ping_sites':[[]],
      'site_url':['',[Validators.compose([Validators.required])]],
      'blacklist':this._fb.group({
        'ips':[[]],
        'mails':[[]],
        'keyword':[[]]
      })
    });
    this._id = this.optionsForm.controls['_id'];
    this.title = this.optionsForm.controls['title'];
    this.sub_title= this.optionsForm.controls['sub_title'];
    this.keywords= this.optionsForm.controls['keywords'];
    this.email= this.optionsForm.controls['email'];
    this.description= this.optionsForm.controls['description'];
    this.site_icp= this.optionsForm.controls['site_icp'];
    this.ping_sites= this.optionsForm.controls['ping_sites'];
    this.site_url= this.optionsForm.controls['site_url'];
    this.blacklist = <FormGroup>this.optionsForm.controls['blacklist'];
    this.ips= this.blacklist.controls['ips'];
    this.mails= this.blacklist.controls['mails'];
    this.keyword= this.blacklist.controls['keyword'];
    // auth
    this.authForm = this._fb.group({
      'name':['',Validators.compose([Validators.required])],
      'slogan':['',Validators.compose([Validators.required])],
      'gravatar':[],
      'old_password':['',Validators.compose([Validators.required,Validators.minLength(6)])],
      'passwords':this._fb.group({
        'new_password':['',Validators.compose([Validators.required,Validators.minLength(6)])],
        'rel_password':['',Validators.compose([Validators.required,Validators.minLength(6)])]
      },{validator:EqualPasswordsValidator.validate('new_password','rel_password')})
    });

    this.name = this.authForm.controls['name'];
    this.slogan = this.authForm.controls['slogan'];
    this.old_password = this.authForm.controls['old_password'];
    this.gravatar = this.authForm.controls['gravatar'];
    this.passwords = <FormGroup>this.authForm.controls['passwords'];
    this.new_password = this.passwords.controls['new_password'];
    this.rel_password = this.passwords.controls['rel_password'];
  }
  // 初始化加载
  ngOnInit(){
    this.getOptions();
    this.getAuth();
  }



  // 解析用户信息
  private handleAuthChange = (authPromise) => {
    authPromise.then(({result:auth}) => {
      this.authForm.reset(auth);
    })
      .catch((err) => {});
  }

  // 配置数据解析
  private handleOptionChange = (optionPromise) => {
    optionPromise.then(({result:option}) => {
      console.log(option);
      option.ping_sites.toString().replace(/,/g, '\n');
      option.blacklist.ips.toString().replace(/,/g, '\n');
      option.blacklist.mails.toString().replace(/,/g, '\n');
      option.blacklist.keyword.toString().replace(/,/g, '\n');
      this.optionsForm.reset(option);
    })
      .catch((err) => {}); //
  }

  // 编辑配置信息
  public editOptions(value):void{
    if(this.optionsForm.valid){
      this._optionService.putOption(value)
        .then((result) => {
          console.log(result)
        })
        .catch((err) => {});
    }
  }

  // 获取配置信息
  public getOptions(){
    this.handleOptionChange(this._optionService.getOptions());
  }

  // 获取auth信息
  public getAuth(){
    this.handleAuthChange(this._optionService.getAuth());
  }

  // 编辑auth
  public editAuth(auth){
    this.handleAuthChange(this._optionService.putAuth(auth));
  }

  //

}
