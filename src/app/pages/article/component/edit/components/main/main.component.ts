import { Component,ViewEncapsulation,Input,Output,EventEmitter,SimpleChanges } from "@angular/core";
import { FormBuilder,FormGroup,AbstractControl,Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router"; //ActivatedRoute:获取当前路由信息
import { TagService } from "../../../tag/tag.servier";
import { ArticleService } from "../../edit.service";

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
  @Input() isSuccess:boolean;
  @Output() tagChange:EventEmitter<any> = new EventEmitter(); //自定义事件，并监听值得改变;
  @Output() titleChange:EventEmitter<any> = new EventEmitter();
  @Output() keywordsChange:EventEmitter<any> = new EventEmitter();
  @Output() descriptionChange:EventEmitter<any> = new EventEmitter();
  @Output() contentChange:EventEmitter<any> = new EventEmitter();

  // Article 表单
  public editForm:FormGroup;
  public _title:AbstractControl;
  public _keywords:AbstractControl;
  public _content:AbstractControl;
  public _description:AbstractControl;

  // 常规参数
  public tags:any = { data:[] }; // 用于存储tags 标签

  constructor(private _fb:FormBuilder,
              private _service:TagService,
              private _articleService:ArticleService){

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
    this.resetArticle();
  }

  // 获取Tags
  public getTags():void{
    this._service.getTags({ pre_page:100 })
      .then(({result}) => {
        this.tags = result;  //获取所有的tags
        // this.tags.data.forEach((tag) => {
        //   console.log(!tag.selected); // true
        // });
        // console.log(this.tags);
      })
      .catch((err) => {});
  }

  //点击添加文章所需的tag；
  public tagChangeHandle():void{
    // const selectedTag = []; //用于存储选中的tag
    // this.tags.data.forEach((tag) => {
    //   tag.selected && selectedTag.push(tag._id);
    // });
    const selectedTag = Array.from(this.tags.data.filter((tag) => tag.selected),(tag) => (<any>tag)._id);
    this.tagChange.emit(selectedTag);
  }

  // 监听title的改变
  public titleChangeHandle($event):void{
    this.titleChange.emit($event.target.value);
  }

  //监听 keywords
  public keywordsChangeHandle($event):void{
    this.keywordsChange.emit($event.target.value);
  }

  //监听 description
  public descriptionChangeHandle($event):void{
    this.descriptionChange.emit($event.target.value);
  }

  //监听 content
  public contentChangeHandle($event):void{
    this._content.setValue($event.content);
    if($event.content != null){
      console.log($event);
      this.contentChange.emit($event.content);
    }
  }

  //  用于监听Input的改变
  public ngOnChanges(changes:SimpleChanges){
    if(this.editForm.valid){
      console.log("===");
      this._articleService.editNext(this.editForm.valid);
    }
    if((<any>changes).tag){
      console.log(changes);
    }
  }

  // 选择标签
  public buildTagsCheck() {
    this.tags.data.forEach((tag) => {
      //Array.include(arr[i]) //判断一个值是否存在于数组中
      if(this.tag.include(tag._id)){

      }
    })
  }

  //重置表单
  private resetArticle():void{
    this._title.setValue(this.title);
    this._content.setValue(this.content);
    this._description.setValue(this.description);
    this._keywords.setValue(this.keywords);
  }



}
