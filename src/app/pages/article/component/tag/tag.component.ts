import { Component,ViewEncapsulation,ViewChild} from "@angular/core";
import { FormGroup,FormBuilder,AbstractControl,Validators } from "@angular/forms";//form表单严重
import { ModalDirective } from "ngx-bootstrap"; //
import { NotificationsService } from "angular2-notifications";
import { ArticleTagService } from './tag.service';

@Component({
  selector:"article-tag",
  template:require("./tag.html"),
  styles:[require("./tag.scss")],
  encapsulation:ViewEncapsulation.None
})

export class ArticleTag{

  @ViewChild("delModal") public _delModal:ModalDirective;

  // editForm
  public editForm:FormGroup;
  public name:AbstractControl;
  public slug:AbstractControl;
  public description:AbstractControl;
  public extends:AbstractControl;


  constructor(private _fb:FormBuilder,
              private _notificationsService:NotificationsService){
    this.editForm = this._fb.group({
      'name':['',Validators.compose([Validators.required])],
      'slug':['',Validators.compose([Validators.required])],
      'description':['',Validators.compose([Validators.required])],
      'extends': [[{ name: 'icon', value: 'icon-tag'}]]  //
    });

    this.name = this.editForm.controls['name'];
    this.slug = this.editForm.controls['slug'];
    this.description = this.editForm.controls['description'];
    this.extends = this.editForm.controls['extends'];
  }
}
