import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";
import { FormBuilder,FormGroup,AbstractControl,Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TagService } from "../../../tag/tag.server";

@Component({
  selector:"edit-article",
  template:require("./main.html"),
  styles:[require("./main.scss")],
  encapsulation:ViewEncapsulation.None
})

export class EditArticle{

  // Input;
  @Input() tag;
  @Input() title;
  @Input() content;
  @Input() keywords;
  @Input() description;
  @Output() tagChange:EventEmitter<any> = new EventEmitter();
  @Output() titleChange:EventEmitter<any> = new EventEmitter();
  @Output() keywordsChange:EventEmitter<any> = new EventEmitter();
  @Output() descriptionChange:EventEmitter<any> = new EventEmitter();

  // Article 表单
  public editForm:FormGroup;
  public _title:AbstractControl;
  public _keywords:AbstractControl;
  public _content:AbstractControl;
  public _description:AbstractControl;

  // 常规参数
  public tags:any = { data:[] }; // 用于存储tags 标签

  constructor(private _fb:FormBuilder,
              private _service:TagService){

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

  //初始化
  public ngOnInit():void{
    this.getTags();
  }

  // 获取
  public getTags():void{
    this._service.getTags({ pre_page:100 })
      .then(({result}) => {
        // console.log(result);
        this.tags = result;
        console.log(this.tags);
      })
      .catch((err) => {});
  }

  //
}
