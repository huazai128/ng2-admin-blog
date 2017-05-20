import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";
import { FormBuilder,AbstractControl,FormGroup,Validators } from "@angular/forms"



@Component({
  selector:"category-add",
  template:require("./add.html"),
  styles:[require("./add.scss")],
  encapsulation:ViewEncapsulation.None
})

export class CategoryAdd{
  public editForm:FormGroup;
  public name:AbstractControl;
  public slug:AbstractControl;
  public pid:AbstractControl;
  public description:AbstractControl;


  constructor(private _fb:FormBuilder){
    this.editForm = this._fb.group({
      'name': ['', Validators.compose([Validators.required])],
      'slug': ['', Validators.compose([Validators.required])],
      'pid': ['', Validators.compose([])],
      'description': ['', Validators.compose([])],
    })
    this.name = this.editForm.controls['name'];
    this.slug = this.editForm.controls['slug'];
    this.pid = this.editForm.controls['pid'];
    this.description = this.editForm.controls['description'];
  }

}
