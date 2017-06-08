import { Component, ViewEncapsulation, ViewChild } from "@angular/core";
import { FormGroup,AbstractControl,FormBuilder,Validators } from "@angular/forms";  //用于表单验证；
import { ModalDirective } from "ngx-bootstrap";  //modal弹出框模块
import { AnnouncementService } from "./announcement.service";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Subject } from 'rxjs/Subject';

const marked = require("marked");  //编辑器

@Component({
  selector:"ba-announcement",
  template: require("./announcement.html"),
  styles:[require("./announcement.scss")],
  encapsulation:ViewEncapsulation.None
})

export class Announcement{

  //获取元素
  @ViewChild("delModal") delModal:ModalDirective; //delModal

  //公告表单验证
  public editForm:FormGroup;
  public state:AbstractControl;
  public content:AbstractControl;
  //搜索表单控件
  public searchState:any = "all";
  public searchForm:FormGroup;
  public keyword:AbstractControl;
  //用于控制表单为修改还是添加
  public edit_announcement:any;
  //判断是否全选
  public selectAll:boolean = false;
  //用于存储选中的公告
  public selectedAnnouncements = [];
  //判断单条和多条数据删除
  public del_announcement:any;

  //分页参数配置
  public announcements = {
    data:[],
    pagination:{
      current_page:1,  //当前页码进行双向绑定
      total_page:0,
      pre_page:10,
      total:0
    }
  };

  //表单
  constructor(private _fb:FormBuilder,
              private _service:AnnouncementService,
              ){
    //公告
    this.editForm = this._fb.group({
      'content':["",Validators.compose([Validators.required])],
      'state':["1",Validators.compose([Validators.required])]
    });
    this.state = this.editForm.controls['state'];
    this.content = this.editForm.controls['content'];
    //搜索
    this.searchForm = this._fb.group({
      "keyword":["",Validators.compose([Validators.required])]
    });
    this.keyword = this.searchForm.controls['keyword'];
  }

  private searchTermStream = new Subject<string>();

  //初始化
  ngOnInit(){
    //marked解析配置
    marked.setOptions({  //设置
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });
    this.getAnnouncements();
    this.searchTermStream
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(() => {
        console.log("das");
        this.getAnnouncements();
      })

  }

  //解析内容
  public parseMarked(content):void{
    return marked(content); //解析cnetent
  }

  //重置表单;
  public resetForm():void{
    this.editForm.reset({
      content: ' ',
      state: '1'
    });
    this.edit_announcement = null; //
  }

  //获取所有公告
  public getAnnouncements(params: any = {}):void {
    // 是否搜索
    if(this.keyword.value) {
      params.keyword = this.keyword.value; //关键字
    }
    // 如果请求的是全部数据，则优化参数
    if(!Object.is(this.searchState, 'all')) {
      params.state = this.searchState
    }
    // 如果请求的是第一页，则设置翻页组件的当前页为第一页
    if(!params.page || Object.is(params.page, 1)) {
      this.announcements.pagination.current_page = 1;
    }
    //获取所有公告
    this._service.getAnnouncements(params)
      .then(_announcements => {
        this.announcements = _announcements.result;
      })
      .catch(error => {})
  }

  //表单提交事件
  public submitAnnouncement(values:Object):void {
    if (this.editForm.valid) {
      this.edit_announcement ? this.doPutAnnouncement(values) : this.addAnnouncement(values);
    }
  }

  //添加公告
  public addAnnouncement(announcement):void{
    this._service.addAnnouncement(announcement)
      .then(_announcement => {
        this.resetForm();
        this.getAnnouncements();
      })
      .catch(error => {});
  }

  //查询条件 state
  public switchState(state:any):void{
    if(state == undefined && Object.is(state,"all")) return;
    this.searchState = state;
    this.getAnnouncements();
  }

  //分页获取公告
  public pageChanged(ev):void{
    this.getAnnouncements({page : ev.page})
  }

  //刷新
  public refreshAnnouncements():void{
    this.getAnnouncements({page: this.announcements.pagination.current_page});
  }

  //清空搜索框
  public resetSearchForm():void{
    this.searchForm.reset({
      "keyword":""
    });
    this.getAnnouncements()
  }

  //根据keyword搜索公告
  public searchAnnouncement(value:Object):void{
    if(this.searchForm.valid){
      this.getAnnouncements();
    }
  }

  //根据键盘按钮搜索
  public search(value:string):void{
    this.keyword.setValue(value);
    this.searchTermStream.next(value);
  }

  //全选 //ngModelchang改变触发
  public batchSelectChange(is_select):void{
    //console.log(is_select);
    if(!this.announcements.data.length) return ; //判断是否存在数据
    this.selectedAnnouncements = [];
    this.announcements.data.forEach((item,index) => {
      item.selected = is_select;
      is_select && this.selectedAnnouncements.push(item._id);
    })
  }

  //随机选择多个删除
  public itemSelectChange():void{
    this.selectedAnnouncements = [];
    const announcements = this.announcements.data;
    announcements.forEach((item) => {
      //console.log(item);
      item.selected && this.selectedAnnouncements.push(item._id);//
    });
    //console.log(this.selectedAnnouncements.length);
    if(!this.selectedAnnouncements.length) { //这个不存在的时候
      this.selectAll = false;
    }
    if(!!this.selectedAnnouncements.length && this.selectedAnnouncements.length == announcements.length) this.selectAll = true;
  }

  //弹窗隐藏
  public canceldDelAnnouncementModal():void{
    this.del_announcement = null;
    this.delModal.hide();
  }

  //批量删除
  public delAnnouncementsModal():void{
    console.log(this.selectedAnnouncements);
    this.del_announcement = null;
    this.delModal.show(); //显示弹窗
  }

  //确认批量删除
  public doDelAnnouncements():void{
    this._service.delAnnouncements(this.selectedAnnouncements)
      .then((announcements) => {
        this.delModal.hide();
        this.selectAll = false;
        this.getAnnouncements({ page: this.announcements.pagination.current_page });
      })
      .catch((err) => {
        this.delModal.hide();
      })
  }

  //单条公告删除
  public delAnnouncement(item):void{
    console.log("单条数据");
    this.del_announcement = item;
    this.delModal.show();
  }

  //确认单条数据删除
  public doDelAnnouncement():void{
    this._service.delAnnouncement(this.del_announcement).then((result) => {
      this.delModal.hide();
      this.getAnnouncements({page: this.announcements.pagination.current_page});
    })
  }


  //修改公告
  public putAnnouncement(item:any):void{
    console.log(this.content);
    this.edit_announcement = item;
    console.log(item);
    this.editForm.reset(item);
  }

  //提交修改公告
  public doPutAnnouncement(announcement:any){
    //判断数据是否修改
    if(Object.is(this.edit_announcement.content,this.content.value)){
      const messages = {
        title:"数据一致",
        content:"请修改数据"
      };
      this._service.setNotifications(messages);
      return;
    }

    this._service.putAnnouncement(Object.assign(this.edit_announcement,announcement))
      .then(result => {
        this.getAnnouncements({ page: this.announcements.pagination.current_page });
        this.edit_announcement = null;
        this.resetForm();
      })
      .catch(err => {})
  }
}
