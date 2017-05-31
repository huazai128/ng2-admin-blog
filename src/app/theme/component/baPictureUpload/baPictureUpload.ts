import { Component,forwardRef,ViewChild,Input,Output,EventEmitter,ElementRef,Renderer,OnChanges } from "@angular/core";  //forwardRef:允许引用尚未定义的引用。
import { NG_VALUE_ACCESSOR,ControlValueAccessor } from "@angular/forms";
import { NotificationsService } from "angular2-notifications";
import { API_ROOT, STATIC_URL } from 'src/config';
import "./baPictureUpload.load.ts";

@Component({
  selector:"ba-picture",
  template:require("./baPictureUpload.html"),
  styles:[require("./baPictureUpload.scss")],
  //实现数据双向绑定
  providers:[{
    provide:NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BaPicture),
    multi:true
  }]
})

export class BaPicture implements ControlValueAccessor{

  @ViewChild("fileUpload") public _fileUpload:ElementRef; //

  // 输入
  @Input() canDelete:boolean = true; // 是否显示关闭
  @Input() defaultPicture:string = 'assets/img/theme/no-photo.png';  //默认img
  @Input() uploaderOptions:any = {}; // 上传配置
  @Input() uploaderSizeLimit:number = 3000000;  //限制上传大小

  // 输出事件
  @Output() pictureChange:EventEmitter<any> = new EventEmitter();
  @Output() onUpload:EventEmitter<any> = new EventEmitter(); //上传事件
  @Output() onUploadCompleted:EventEmitter<any> = new EventEmitter(); //上传完成事件

  // 定义参数
  private qiniuUploader:any; //
  private uploadProgress:number = 0; //上传进度
  public uploadInProgress:boolean = false;  //判断是否上传
  public picture:string = "";  //上传图片路径

  //
  public onModelChange:Function = () => {};  //监听图片的改变
  public onModelTouched:Function = () => {}; //

  constructor(private _notificationsService:NotificationsService,private _renderer:Renderer){}

  // 初始化配置qiniu
  ngOnInit(){
    // qiniu的配置
    this.qiniuUploader = Qiniu.uploader(Object.assign({ //Object.assign(obj1,obj2) 对象的合并和浅合并
      // 设置一次只能选择一个文件
      multi_selection: false,  //配置上传数量
      // 上传模式,依次退化
      runtimes: 'html5 ,html4',
      // 上传选择的点选按钮，required
      browse_button: 'uploadFileBtn',
      // Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
      uptoken_url: `${API_ROOT}/qiniu`,//
      // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
      unique_names: false,
      // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
      save_key: false,
      // bucket 域名，下载资源时用到，required
      domain: 'http://upload.qiniu.com/', //域名
      // 设置上传文件的时候是否每次都重新获取新的token
      get_new_uptoken: false,
      // 最大文件体积限制
      max_file_size: '10mb',
      // 上传失败最大重试次数
      max_retries: 3,
      // 开启可拖曳上传
      dragdrop: false,
      // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
      // drop_element: 'container',
      // 分块上传时，每片的体积
      chunk_size: '4mb',
      // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
      auto_start: true,
      log_level: -1,
      // 回调函数
      init: {
        // 文件添加进队列后,处理相关的事情
        'FilesAdded'(up, files) {
          // console.log('文件添加进队列', files);
        },
        // 每个文件上传前,处理相关的事情
        'BeforeUpload': (up, file) => {
          // console.log('文件上传前', this);
          this._notificationsService.info('开始上传', '文件正在上传', { timeOut: 850 });
        },
        // 每个文件上传时,处理相关的事情
        'UploadProgress': (up, file) => {
          console.log('文件上传时', file);
          this.uploadInProgress = true;
          this.uploadProgress = file.percent;  //上传进度
        },
        // 每个文件上传成功后,处理相关的事情
        'FileUploaded': (up, file, info) => {
          console.log('文件上传成功后', file);
          this.uploadInProgress = false; //上传成功  关闭上传
          const data = `${STATIC_URL}/${JSON.parse(info).key}`;  //?
          console.log(data);
          this.onUploadCompleted.emit(data);

          this.changePictureFromURL(data); //用于监听改变
          this._notificationsService.success('上传成功', '图片上传成功', { timeOut: 850 });
        },
        // 上传出错时,处理相关的事情
        'Error': (up, err, errTip) => {
          this.uploadInProgress = false; //上传失败  关闭上传
          this._notificationsService.error('上传失败', JSON.parse(err.response).error, { timeOut: 850 });
        },
        // 队列文件处理完毕后,处理相关的事情
        'UploadComplete': () => {
          this.uploadInProgress = false;
          // console.log('文件全部上传完毕');
        },
        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数，该配置必须要在 unique_names: false , save_key: false 时才生效
        'Key'(up, file) {
          return `nodepress/image/${file.name}`;
        }
      }
    },this.uploaderOptions))
  }

  //触发上传按钮,
  public onFiles():any{  //监听文件的变化，一旦变化就会触发
    //获取上传图片文件
    const file = this._fileUpload.nativeElement.files[0]; //获取上传文件的路径
    console.log(file); //
    if(!file) return false;  //判断上传文件是否存在

    // 限制文件上传大小，不上传
    if(file.size > this.uploaderSizeLimit){
      this._notificationsService.error("上传失败","文件不合法！",{timeOut: 500});
      return false;
    }

    //判断图片是否小于10kb，true则使用base64上传
    if(file.size <= 10000){
      //使用base64上传
      let reader = new FileReader();// 将图片装换成base64
      //文件成功读取操作
      reader.onload = (event) => {
        const imgBase64 = (<any>event).target.result; //图片base64的路径
        this.emitPicture(imgBase64);
        console.log(imgBase64);
        console.log((<any>event).target.result);
      };
      reader.readAsDataURL(file); // 将文件读取为DataURL
      return false;
    }
    //否则添加上传列队，执行七牛上传
    this.qiniuUploader.addFile(file);
  }

  //点击自定义上传图片按钮触发input的click方法
  public bringFileSelector(){
    this.onModelTouched();
    //引用元素本身的方法
    this._renderer.invokeElementMethod(this._fileUpload.nativeElement,"click"); //触发input图片框
    return false;
  }

  //更新和传递图片
  public emitPicture(picture:string):any{
    this.picture = picture;
    this.onModelChange(picture);
    this.pictureChange.emit(picture);  //自定义事件发射
  }

  //删除上传图片
  public removePicture():any{
    this.onModelTouched();
    this.emitPicture(""); //
    return false;
  }

  //根据url读取一张图片
  private changePictureFromURL(url:string):any{
    const image = new Image();
    //上传成功
    image.onload = (event) => {
      this.emitPicture(url);
    };
    //上传失败
    image.onerror = (err) => {
      this._notificationsService.error("预览失败","七牛问题！",{timeOut:800});
      this.emitPicture(url);
    };
    image.src = url;
  }

  // 根据base64读取一张图片
  private changePictureFromDataURL(file:File):any{
    const reader = new FileReader(); //读取base64的图片
    //监听 图片读取
    reader.addEventListener("load",(event:Event) => {
      this.picture = (<any>event.target).result;
    },false);
    reader.readAsDataURL(file);
  }

  // 写入值。用于数据的双向绑定[(ngModel)]
  writeValue(value:any){
    this.picture = value;
    console.log(value);//用于获取双向绑定的值；
  }

  registerOnChange(fn:Function){
    console.log("=====");
    this.onModelChange = fn;
  }

  registerOnTouched(fn:Function){
    console.log(fn);
    this.onModelTouched = fn;
  }
}

