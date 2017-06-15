import { Component,ViewEncapsulation,Input,Output,EventEmitter } from "@angular/core";
import { FormBuilder,AbstractControl,FormGroup,Validators } from "@angular/forms";
import { CategoryService } from "../../category.service";



@Component({
  selector:"category-add",
  template:require("./add.html"),
  styles:[require("./add.scss")],
  encapsulation:ViewEncapsulation.None
})

export class CategoryAdd{

  @Input() submitState:any;  // 编辑状态
  @Input() category;    // 单个对象
  @Input() categories;  // 集合对象
  @Output() categoryChange:EventEmitter<any> = new EventEmitter();  // 双向绑定
  @Output() submitStateChange:EventEmitter<any> = new EventEmitter();  // 双向绑定

  @Output() submitCategory:EventEmitter<any> = new EventEmitter(); // 提交事件

  // form表单验证
  public editForm:FormGroup;
  public name:AbstractControl;
  public slug:AbstractControl;
  public pid:AbstractControl;
  public description:AbstractControl;
  public extends:AbstractControl;

  constructor(private _fb:FormBuilder){
    this.editForm = this._fb.group({
      'name': ['', Validators.compose([Validators.required])],
      'slug': ['', Validators.compose([Validators.required])],
      'pid': ['', Validators.compose([])],
      'description': ['', Validators.compose([])],
      'extends':[[{key:"icon",value:"icon-category"}]]
    });
    this.name = this.editForm.controls['name'];
    this.slug = this.editForm.controls['slug'];
    this.pid = this.editForm.controls['pid'];
    this.description = this.editForm.controls['description'];
    this.extends = this.editForm.controls['extends'];
  }

  // 提交
  public onSubmit(category:Object):void{
    if(this.editForm.valid){
      this.submitCategory.emit(category);
    }
  }

  // 重置表单
  public resetForm():void{
    this.editForm.reset({
      name:"",
      slug:"",
      pid:"",
      description:"",
      extends:[{ name: 'icon', value: 'icon-category'}]
    });
    // 重置表单清除category
    if(this.category){
      this.category = null;
      this.categoryChange.emit(this.category);
    }
    this.submitState.ing = false;
    this.submitState.success = false;
    this.submitStateChange.emit(this.submitState);
  }

  //  点击编辑的时候也会触发ngOnChanges() 函数;
  public ngOnChanges(change){
    const submitOk = !!change.submitState && !change.submitState.currentValue.ing && change.submitState.currentValue.success;
    const category = !!change.category && !!change.category.currentValue;  // !! 强制类型转换
    if(submitOk) this.resetForm(); // 重置表单
    if(category){
      change.category.currentValue.pid = change.category.currentValue.pid || ''; //
      this.editForm.reset(change.category.currentValue); //
    }
  }

  //
}
