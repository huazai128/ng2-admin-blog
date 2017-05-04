import {Component, ViewEncapsulation, ViewChild} from "@angular/core";
import { FormGroup,AbstractControl,FormBuilder,Validators } from "@angular/forms";  //用于表单验证；
import { ModalDirective } from "ngx-bootstrap";
const marked = require("marked");

@Component({
  selector:"ba-announcement",
  template: require("./announcement.html"),
  styles:[require("./announcement.scss")],
  encapsulation:ViewEncapsulation.None
})

export class Announcement{

  @ViewChild("delModal") delModal:ModalDirective;

  //表单验证
  public editForm:FormGroup;
  public state:AbstractControl;
  public content:AbstractControl;

  constructor(private _fb:FormBuilder){
    this.editForm = this._fb.group({
      'content':["",Validators.compose([Validators.required])],
      'state':["1",Validators.compose([Validators.required])]
    });
    this.state = this.editForm.controls['state'];
    this.content = this.editForm.controls['content'];
  }

  //初始化
  ngOnInit(){

  }

  //表单提交事件
  submitAnnouncement(value){
    console.log(value);
    if(this.editForm.valid){

    }
  }
}
