import { Component,ViewEncapsulation,ViewChild} from "@angular/core";
import { FormGroup,FormBuilder,AbstractControl,Validators } from "@angular/forms";//form表单严重
import { ModalDirective } from "ngx-bootstrap"; //
import { NotificationsService } from "angular2-notifications";
import { ArticleTagService } from './tag.service';
import { TagService } from "./tag.server";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector:"article-tag",
  template:require("./tag.html"),
  styles:[require("./tag.scss")],
  encapsulation:ViewEncapsulation.None,
})

export class ArticleTag{

  @ViewChild("delModal") _delModal:ModalDirective;

  // editForm
  public editForm:FormGroup;
  public name:AbstractControl;
  public slug:AbstractControl;
  public description:AbstractControl;
  public extends:AbstractControl;

  // searchForm
  public searchForm:FormGroup;
  public keyword:AbstractControl;  //搜索关键字

  //参数
  public del_tag:any;  //用于存储删除tag信息
  public edit_tag:any; //用于存储编辑tag信息；
  public tags = { //tags数据和
    data: [],
    pagination:{
      current_page:1,
      total_page: 0, //
      pre_page:10, //限制查询的条数
      total:0
    }
  }; //获取所有的Tags
  public tagsSelectAll:boolean = false; // 全选判断
  public selectedTags = [];  //用于缓存多选tags

  private searchTermStream = new Subject<any>();

  constructor(private _fb:FormBuilder,
              private _notificationsService:NotificationsService,
              private _service:TagService){
    // tags提交表单验证
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

    // 搜索tags
    this.searchForm = this._fb.group({
      'keyword':['',Validators.compose([Validators.required])],
    });
    this.keyword = this.searchForm.controls['keyword'];
  }

  //初始化加载
  ngOnInit():void{
    // console.log(this.extends.value);
    this.getTags(); //初始化加载数据
    this.searchTermStream
      .debounceTime(400) //debounceTime(time);在time时间内触发事件，只接受一个
      .distinctUntilChanged()
      .subscribe(() => {
        console.log(this.keyword.value);
        this.getTags()
      })
  }

  //增加自定义扩展
  public addExtendItem():void{
    this.extends.setValue([...this.extends.value, {}])
  }

  //删除自定义扩展
  public delExtendItem(index):void{
    this.extends.value.splice(index,1);
  }

  //  全选 modelchange
  public batchSelectChange(value):void{
    console.log(value);//监听数据的双向绑定的变化
    const tags = this.tags.data;
    console.log(tags);
    tags.forEach( tag => {
      tag.selected = value;
      value && this.selectedTags.push(tag._id);
    })
  }

  // 随机选则
  public itemSelectChange():void{
    this.selectedTags = [];
    const tags = this.tags.data;
    tags.forEach(item => {
      item.selected && this.selectedTags.push(item._id);
    });
    if(!this.selectedTags.length){
      this.tagsSelectAll = false;
    }else if(!!this.selectedTags.length && this.selectedTags.length == tags.length){
      this.tagsSelectAll = true;
    }
  }

  //表单提交
  public submitTag(value:Object):void{
    if(this.editForm.value){
      //判断是否为编辑tag
      this.edit_tag ? this.doPutTag(value) :this.addTag(value);
    }
  }

  //获取Tags列表
  public getTags(params:any = {}):void{
    // 搜索词
    if(this.keyword.value){
      params.keyword = this.keyword.value;
    }

    // 如果请求的是第一页，则设置翻页组件的当前页为第一页
    if(!params.page || Object.is(params.page, 1)){
      this.tags.pagination.current_page = 1;
    }

    //如果没有指定页数，则为当前页数；
    if(!params.page){
      params.page = this.tags.pagination.current_page;
    }

    //限制查询tags的数量
    params.pre_page = this.tags.pagination.pre_page;

    //获取所有的Tags
    this._service.getTags(params)
      .then(tags => {
        console.log(tags);
        this.tags = tags.result;
      })
      .catch(err => {});
  }

  //删除当前tag
  public delTagModal(tag:any):void{
    this.del_tag = tag;
    this._delModal.show();
  }

  //确认删除
  public doDelTag():void {
    this._service.deleteTag(this.del_tag._id)
      .then(tag => {
        this._delModal.hide(); //弹出框隐藏
        this.del_tag = null; //消除tag
        this.getTags();//重新获取tags数据
      })
      .catch(err => {
        this._delModal.hide();  //删除失败
      })
  }

  //取消删除
  public canceldDelTagModal(){
    this._delModal.hide();
  }

  // tag表单提交
  public addTag(data:any):void{
    this._service.addTag(data).then((tag) => {
      this.resetEditForm(); //
      this.getTags();
    })
  }

  //重置tag表单
  private resetEditForm():void{
    this.editForm.reset({
      name:"",
      slug:"",
      description:"",
      extends:[{name:"icon",value:"icon-tag"}]
    });
    this.edit_tag = null;
  }

  //点击修改tag
  public putTag(tag:Object):void{
    this.edit_tag = tag; //临时缓存修改tag对象
    this.editForm.reset(tag); //重新设置
  }

  //提交修改tag
  public doPutTag(data:any){
    this._service.putTag(Object.assign(this.edit_tag,data)) //Object.assign()用于对象的合并;
      .then(tag => {
        this.resetEditForm(); //重置表单
        this.getTags({ page: this.tags.pagination.current_page }); //重新获取tags数据
        this.edit_tag = null; // 删除临时缓存tag对象
      })
      .catch(err => {});
  }

  // 刷新
  public refreshTags():void{
    this.getTags();
  }

  // 清空关键字
  public resetSearchForm():void {
    this.searchForm.reset({
      keyword:""
    });
    this.getTags();
  }

  // 搜索
  public searchTags(data:any):void{
    if(this.searchForm.value){
      console.log(this.keyword.value);
      this.getTags();
    }
  }

  // 批量删除操作
  public delTagsModal():void{
    this.edit_tag = null; //用于存储单个tag对象删除
    this._delModal.show();
  }

  // 确认批量删除
  public doDelTags():void{
    if(this.selectedTags.length > 1){
      this._service.delTags(this.selectedTags)
        .then( result => {
          this._delModal.hide();
          this.selectedTags = [];
          this.getTags();
          console.log(result);
        })
        .catch(err => {})
    }
  }

  // 搜索监听变化
  public search(value:any){
    this.keyword.setValue(value);
    this.searchTermStream.next(value);
  }
}
