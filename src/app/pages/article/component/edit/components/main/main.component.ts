import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";
import { FormBuilder,FormGroup,AbstractControl,Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector:"edit-article",
  template:require("./main.html"),
  styles:[require("./main.scss")],
  encapsulation:ViewEncapsulation.None
})

export class EditArticle{

  public editForm:FormGroup;
  public _title:AbstractControl;
  public _keywords:AbstractControl;
  public _content:AbstractControl;
  public _description:AbstractControl;

  constructor(private _fb:FormBuilder){

    this.editForm = this._fb.group({
      "_title":["",Validators.compose([Validators.required])],
      "_keywords":[[],Validators.compose([Validators.required])],
      "_content":[[],Validators.compose([Validators.required])],
      "_description":["",Validators.compose([Validators.required])],
    });

    this._title = this.editForm.controls["_title"];
    this._keywords = this.editForm.controls["_keywords"];
    this._content = this.editForm.controls["_content"];
    this._description = this.editForm.controls["_description"];
  }



}
