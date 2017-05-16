import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  ViewEncapsulation
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms"; //查看表单控件 ;通过ControlValueAccessor向 [formControl]="content":传值
import { ModalDirective } from "ngx-bootstrap"; //http://valor-software.com/ngx-bootstrap/#/
import * as $ from "jquery";

const marked = require('marked');  //marked编辑器,编译成html
const hljs = require('highlight.js'); //代码高亮
const CodeMirror = require('codemirror'); //在线编辑器;http://www.hyjiannouncementacan.com/codemirror-config/
const { store } = require("./libs/store.js");  //缓存API

//<any> 在这里的作用是强制类型转换；编译器并不知晓 window 下面有哪些属性、方法。但强制转换成 any 类型之后，就不会报错了。


(<any>window).hljs = hljs;
(<any>window).marked = marked;
(<any>window).CodeMirror = CodeMirror;
(<any>window).store = store;//

//引用的插件
require('codemirror/mode/meta.js');
require('codemirror/mode/go/go.js');
require('codemirror/mode/gfm/gfm.js');
require('codemirror/mode/vue/vue.js');
require('codemirror/mode/css/css.js');
require('codemirror/mode/lua/lua.js');
require('codemirror/mode/php/php.js');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/jsx/jsx.js');
require('codemirror/mode/sql/sql.js');
require('codemirror/mode/pug/pug.js');
require('codemirror/mode/lua/lua.js');
require('codemirror/mode/sass/sass.js');
require('codemirror/mode/http/http.js');
require('codemirror/mode/perl/perl.js');
require('codemirror/mode/ruby/ruby.js');
require('codemirror/mode/nginx/nginx.js');
require('codemirror/mode/shell/shell.js');
require('codemirror/mode/clike/clike.js');
require('codemirror/mode/stylus/stylus.js');
require('codemirror/mode/python/python.js');
require('codemirror/mode/haskell/haskell.js');
require('codemirror/mode/markdown/markdown.js');
require('codemirror/mode/htmlmixed/htmlmixed.js');
require('codemirror/mode/javascript/javascript.js');

require('codemirror/addon/mode/overlay.js');
require('codemirror/addon/edit/closetag.js');
require('codemirror/addon/edit/continuelist.js');
require('codemirror/addon/edit/closebrackets.js');
require('codemirror/addon/scroll/annotatescrollbar.js');
require('codemirror/addon/selection/active-line.js');
require('codemirror/addon/selection/mark-selection.js');
// require('codemirror/addon/search/searchcursor.js');
// require('codemirror/addon/search/matchesonscrollbar.js')；
// require('codemirror/addon/search/searchcursor.js');
// require('codemirror/addon/search/match-highlighter.js');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/comment-fold.js');
require('codemirror/addon/fold/indent-fold.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/fold/markdown-fold.js');

//marked编辑器配置
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight(code, lang, callback) { //高亮
    return hljs.highlightAuto(code).value;
  }
});

@Component({
  selector:"markdown-editor",
  template:require("./baMarkdownEditor.html"),
  styles:[
    require("./baMarkdownEditor.scss"),
    require('highlight.js/styles/ocean.css'),
    require('codemirror/lib/codemirror.css'),
    require('codemirror/theme/base16-dark.css'),
    require('codemirror/addon/fold/foldgutter.css')
  ],
  providers: [{  // 配置
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BaMarkdownEditor),
    multi: true
  }],
  encapsulation: ViewEncapsulation.None
})

export class BaMarkdownEditor implements AfterViewInit,ControlValueAccessor{

  @ViewChild('bakModal') bakModal: ModalDirective;

  // 基本数据
  editor:any;
  content:any = '';
  markedHtml:any = '';
  editorElem:HTMLElement;

  previewMode:number = 0;
  fullscreen:any = false;

  // 传入配置
  @Input() config: Object;

  // 派发事件
  @Output() ready: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();

  // ...
  onModelChange: Function = () => {};
  onModelTouched: Function = () => {};

  public timer = null;

  // 注入Dom
  constructor(private elementRef: ElementRef) {}

  // 使用本地草稿
  useArticleBak() {
    this.content = store.get(location.pathname);
    this.editor.setValue(this.content);
    this.markedHtml = marked(this.content);
    this.bakModal.hide();
  }

  // 关闭草稿弹窗
  cancelBakModal() {
    this.editor.setValue(this.content);
    this.markedHtml = marked(this.content);
    this.bakModal.hide();
  }

  // 视图加载完成后执行初始化
  ngAfterViewInit() {
    if(this.editor) return false;
    this.editorElem = this.elementRef.nativeElement.children[0].children[1].children[0].children[0];
    this.editor = CodeMirror.fromTextArea(this.editorElem, Object.assign({
      // 语言模式 github markdown扩展
      mode: 'gfm',
      // 行号
      lineNumbers: true,
      // 自动验证错误
      matchBrackets: true,
      // 是否换行
      lineWrapping: false,
      // 点击高亮正行
      styleActiveLine: true,
      // 配色
      theme: 'base16-dark',
      // 自动补全括号
      autoCloseBrackets: true,
      // 自动闭合标签
      autoCloseTags: true,
      // 自动高亮所有选中单词
      // styleSelectedText: true,
      // highlightSelectionMatches: { showToken: /w/, annotateScrollbar: true },
      // 展开折叠
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      // 回车键自动补全上一步格式
      extraKeys: {
        "Enter": "newlineAndIndentContinueMarkdownList"
      }
    }, this.config));
    this.editor.on('blur', cm => {
      this.onModelTouched();
    });
    this.editor.on('change', cm => {
      const content = cm.getValue();
      if(!Object.is(content, this.content)) {
        this.content = content;
        this.change.emit({
          editor: this.editor,
          content: this.content
        });
        this.onModelChange(this.content);
        if(this.previewMode != 0) {
          this.parseMarked();
        }
      }
      // 自动保存草稿
      if (!!this.timer) clearTimeout(this.timer);
      if(!Object.is(content, store.get(location.pathname))) {
        this.timer = setTimeout(() => {
          store.set(location.pathname, content)
        }, 1600);
      };
    });
    // 如果是发布页面，有本地存储，则直接读取存储
    if(Object.is('/article/post', location.pathname) || Object.is('/announcement', location.pathname)) {
      let bak = store.get(location.pathname);
      if(!!bak) {
        this.content = bak;
        this.editor.setValue(this.content);
        this.markedHtml = marked(this.content);
      }
    } else {
      // 如果是编辑页面，没有弹窗，则设置
      setTimeout(() => {
        if(!this.bakModal.isShown) {
          this.editor.setValue(this.content);
          this.markedHtml = marked(this.content);
        }
      }, 1000)
    }

    /*
     const dropZone = this.elementRef.nativeElement.children[0].children[1];
     dropZone.addEventListener('drop', event => {
     event.preventDefault();
     event.stopPropagation();
     let reader = new FileReader();
     reader.onload = e => {
     console.log(e);
     // this.editor.setValue(e.target.result);
     };
     reader.readAsText(event.dataTransfer.files[0]);
     }, false);
     */
  }

  // 解析markeddown
  parseMarked() {
    this.markedHtml = marked(this.content);
  }

  // 写数据
  writeValue(currentValue: any) {
    const bak = store.get(location.pathname);
    if (!Object.is(currentValue, undefined) && !Object.is(currentValue, this.content)) {
      // 如果是公告页就啥也不干
      if(Object.is(location.pathname, '/announcement')) {
        this.content = currentValue;
        this.editor.setValue(this.content);
        return false;
      }
      if (!!bak && !Object.is(currentValue, bak)) {
        this.bakModal.show();
      }
      this.content = currentValue;
    } else if (!!bak) {
      this.content = bak;
    }
  }

  // 保存文件
  saveFile(code, name) {
    const blob = new Blob([code], { type: 'text/plain' });
    if ((<any>window).saveAs) {
      (<any>window).saveAs(blob, name);
    } else if ((<any>navigator).saveBlob){
      (<any>navigator).saveBlob(blob, name);
    } else {
      const url = URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.setAttribute("href",url);
      link.setAttribute("download",name);
      let event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, true, (<any>window), 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      link.dispatchEvent(event);
    }
  }

  // 保存为markdown
  saveAsMarkdown(){
    this.saveFile(this.content, "untitled.md");
  }

  // 按键listen
  keyDownListen(event) {

    // 退出全屏
    if(Object.is(event.keyCode, 27)) {
      this.fullscreen = false;
    }

    // 全屏
    if(Object.is(event.keyCode, 122)) {
      this.fullscreen = !this.fullscreen;
    }

    // 保存
    if(event.keyCode == 83 && (event.ctrlKey || event.metaKey || event.shiftKey)){
      this.saveAsMarkdown();
      event.preventDefault();
      return false;
    }
  }

  // 插入内容
  updateCodeMirror(data) {
    const codemirror = this.editor;
    codemirror.replaceSelection(data);
    const startPoint = codemirror.getCursor('start');
    const endPoint = codemirror.getCursor('end');
    codemirror.setSelection(startPoint, endPoint);
    codemirror.focus();
    /*
     let doc = codemirror.getDoc();
     let cursor = doc.getCursor(); // gets the line number in the cursor position
     let line = doc.getLine(cursor.line); // get the line contents
     let pos = { // create a new object to avoid mutation of the original selection
     line: cursor.line,
     ch: line.length - 1 // set the character position to the end of the line
     }
     doc.replaceRange('\n' + data + '\n', pos); // adds a new line
     */
  }

  // 替换光标选中项内容
  replaceSelection(cm, active, start, end) {
    let text;
    let startPoint = cm.getCursor('start');
    let endPoint = cm.getCursor('end');
    if (active) {
      text = cm.getLine(startPoint.line);
      start = text.slice(0, startPoint.ch);
      end = text.slice(startPoint.ch);
      cm.setLine(startPoint.line, start + end);
    } else {
      text = cm.getSelection();
      cm.replaceSelection(start + text + end);
      startPoint.ch += start.length;
      endPoint.ch += start.length;
    }
    cm.setSelection(startPoint, endPoint);
    cm.focus();
  }

  // 分析编辑器当前的光标位置
  getState(cm, pos) {
    pos = pos || cm.getCursor('start');
    let stat = cm.getTokenAt(pos);
    if (!stat.type || !stat.type.split) return {};
    let types = stat.type.split(' ');
    let ret = {}, data, text;
    for (let i = 0; i < types.length; i++) {
      data = types[i];
      if (data === 'strong') {
        (<any>ret).bold = true;
      } else if (data === 'letiable-2') {
        text = cm.getLine(pos.line);
        if (/^\s*\d+\.\s/.test(text)) {
          ret['ordered-list'] = true;
        } else {
          ret['unordered-list'] = true;
        }
      } else if (data === 'atom') {
        (<any>ret).quote = true;
      } else if (data === 'em') {
        (<any>ret).italic = true;
      }
    }
    return ret;
  }

  // 粗体
  toggleBold() {
    const codemirror = this.editor;
    const stat = this.getState(codemirror, codemirror.getCursor());

    let text;
    let start = '**';
    let end = '**';

    let startPoint = codemirror.getCursor('start');
    let endPoint = codemirror.getCursor('end');
    if ((<any>stat).bold) {
      /*
       text = codemirror.getLine(startPoint.line);
       start = text.slice(0, startPoint.ch);
       end = text.slice(startPoint.ch);

       start = start.replace(/^(.*)?(\*|\_){2}(\S+.*)?$/, '$1$3');
       end = end.replace(/^(.*\S+)?(\*|\_){2}(\s+.*)?$/, '$1$3');
       startPoint.ch -= 2;
       endPoint.ch -= 2;
       // console.log('text', text, 'start', start, 'end', end, startPoint, endPoint);
       // codemirror.setLine(startPoint.line, start + end);
       // codemirror.replaceRange(end, endPoint);
       */
    } else {
      text = codemirror.getSelection();
      codemirror.replaceSelection(start + text + end);

      startPoint.ch += 2;
      endPoint.ch += 2;
    }
    codemirror.setSelection(startPoint, endPoint);
    codemirror.focus();
  }

  // 斜体
  toggleItalic() {
    const codemirror = this.editor;
    const stat = this.getState(codemirror, codemirror.getCursor());

    let text;
    let start = '*';
    let end = '*';

    let startPoint = codemirror.getCursor('start');
    let endPoint = codemirror.getCursor('end');
    if ((<any>stat).italic) {
      /*
       text = codemirror.getLine(startPoint.line);
       start = text.slice(0, startPoint.ch);
       end = text.slice(startPoint.ch);

       start = start.replace(/^(.*)?(\*|\_)(\S+.*)?$/, '$1$3');
       end = end.replace(/^(.*\S+)?(\*|\_)(\s+.*)?$/, '$1$3');
       startPoint.ch -= 1;
       endPoint.ch -= 1;
       // codemirror.setLine(startPoint.line, start + end);
       */
    } else {
      text = codemirror.getSelection();
      codemirror.replaceSelection(start + text + end);

      startPoint.ch += 1;
      endPoint.ch += 1;
    }
    codemirror.setSelection(startPoint, endPoint);
    codemirror.focus();
  }

  // 插入链接
  drawLink() {
    const codemirror = this.editor;
    const position = codemirror.getCursor();
    const stat = this.getState(codemirror, position);
    this.replaceSelection(codemirror, (<any>stat).link, '[', '](https://)');
  }

  // 插入图片
  drawImage() {
    const codemirror = this.editor;
    const position = codemirror.getCursor();
    const stat = this.getState(codemirror, position);
    this.replaceSelection(codemirror, (<any>stat).image, '![](', ')');
  }

  // 插入引用
  drawQuote() {
    const codemirror = this.editor;
    const position = codemirror.getCursor();
    const stat = this.getState(codemirror, position);
    this.replaceSelection(codemirror, (<any>stat).quote, '> ', '\n');
  }

  // 插入代码
  drawCode() {
    const codemirror = this.editor;
    const position = codemirror.getCursor();
    const stat = this.getState(codemirror, position);
    this.replaceSelection(codemirror, (<any>stat).code, '```\n', '\n```');
  }

  // 插入h3标题
  drawH3Title(data) {
    const codemirror = this.editor;
    const position = codemirror.getCursor();
    const stat = this.getState(codemirror, position);
    this.replaceSelection(codemirror, (<any>stat).h3, '### ', '\n');
    // this.updateCodeMirror(data);
  }

  // 撤销
  undo() {
    const codemirror = this.editor;
    codemirror.undo();
    codemirror.focus();
  }

  // 回退
  redo() {
    const codemirror = this.editor;
    codemirror.redo();
    codemirror.focus();
  }

  // 注册事件
  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  // 注册事件
  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
}
// export class BaMarkdownEditor implements AfterViewInit,ControlValueAccessor{
//
//
//
//   @ViewChild("bakModal") public bakModal:ModalDirective;  //弹出框指令，使用bakModal包含操作Modal的属性
//
//   //传入父组件数据
//   @Input() public title:string;
//   @Input() public config:Object;  //编辑器配置
//
//   //传出事件
//   @Output() public ready:EventEmitter<any> = new EventEmitter<any>();
//   @Output() public change:EventEmitter<any> = new EventEmitter<any>();
//
//   //基本数据
//   public editor:any;  //
//   public content:any = "";  //编辑器的泪融
//   public markedHtml:any = "";
//   public editorElem:HTMLElement;  //
//   public timer = null;  //是一个对象类型
//
//   private previewMode:Number = 0;
//   private fullscreen:any = false;
//
//   //这两个函数的作用:是为后期操作Modal弹窗
//   onModelChange:Function = () => {};
//   onModelTouched:Function = () => {};
//
//   constructor(private _el:ElementRef){
//     console.log(this.editorElem);//
//   } //this._el:指向当前组件
//
//   // 使用本地草稿
//   useArticleBak(){
//     this.content = store.get(location.pathname);
//     this.editor.setValue(this.content); //给编辑器设置内容
//     this.markedHtml = marked(this.content);
//     this.bakModal.hide();
//   }
//
//   //关闭草稿弹窗
//   cancelBakModal() {
//     this.editor.setValue(this.content);
//     this.markedHtml = marked(this.content);
//     this.bakModal.hide();
//   }
//
//   //试图初始化加载完成之后触发;
//   ngAfterViewInit(){
//     //this.bakModal.show();
//     if(this.editor) return false;
//     this.editorElem = this._el.nativeElement.children[0].children[1].children[0].children[0];
//
//     //fromTextArea(el,options);
//     this.editor = CodeMirror.fromTextArea(this.editorElem,Object.assign({  //Object.assign：用于对象的合并
//       //语言模式
//       mode:"gfm",
//       //是否显示行号
//       lineNumbers: true,
//       //自动验证错误
//       matchBrackets:true,
//       //是否换行
//       lineWrapping:false,
//       // 点击高亮正行
//       styleActiveLine: true,
//       // 配色
//       theme: 'base16-dark',
//       // 自动补全括号
//       autoCloseBrackets: true,
//       // 自动闭合标签
//       autoCloseTags: true,
//       // 自动高亮所有选中单词
//       // styleSelectedText: true,
//       // highlightSelectionMatches: { showToken: /w/, annotateScrollbar: true },
//       // 展开折叠
//       foldGutter: true,
//       gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
//       // 回车键自动补全上一步格式
//       extraKeys: {
//         "Enter": "newlineAndIndentContinueMarkdownList"
//       }
//     },this.config));
//
//     //失去焦点触发
//     this.editor.on("blur",ev => {
//       this.onModelTouched();
//     });
//
//     //监听textarea的值变化
//     this.editor.on('change', cm => {
//       const content = cm.getValue();
//       if(!Object.is(content, this.content)) {
//         this.content = content;
//         this.change.emit({ //触发EventEmitter自定义事件
//           editor: this.editor,
//           content: this.content
//         });
//         this.onModelChange(this.content);
//         if(this.previewMode != 0) {
//           this.parseMarked();
//         }
//       }
//       // 自动保存草稿
//       if(!!this.timer) clearTimeout(this.timer);
//       console.log(store); //为啥获取不到
//       if(!Object.is(content, store.get(location.pathname))) {
//         this.timer = setTimeout(() => {
//           console.log("缓存");
//           store.set(location.pathname, content)
//         }, 1600);
//       }
//     });
//
//     //如果发布页面，由本地存储，直接读取存储数据
//     if(Object.is('/article/post',location.pathname || Object.is('/announcement', location.pathname))){
//       let bak = store.get(location.pathname); //根据key获取缓存数据
//       if(!!bak){ //!!:把bak转换成boolean类型；
//         this.content = bak;
//         this.editor.setValue(this.content);  //给编辑器设置内容
//         this.markedHtml = marked(this.content);  //把内容解析成HTML
//       }
//     }else{
//       setTimeout(() => {  //异步,防止请求等待
//         console.log(this.bakModal.isShown);//用于判断弹窗是否显示 返回boolean
//
//         if(!this.bakModal.isShown){
//           this.editor.setValue(this.content);
//           this.markedHtml = marked(this.content);
//         }
//       },1000)
//     }
//   }
//
//   //解析markeddown格式的文档内容
//   parseMarked(){
//     this.markedHtml = marked(this.content);  //使用marked解析
//   }
//
//   //向控制元素写入一个新值。是ControlValueAccessor提供接口；是为了向组件引用的地方传递表单值；
//   writeValue(currentValue:any){  //初始化触发
//     //根据路由不同设置获取不同路由下缓存数据
//     const bak = store.get(location.pathname); //获取缓存
//     //判断当前值是否为空并且缓存的值和当前值是否一致
//     if(!Object.is(currentValue,undefined) && !Object.is(this.content,currentValue)){
//       //如果是公告页面就不任何事情
//       if(Object.is("/announcements",location.pathname)){
//         this.content = currentValue;
//         this.editor.setValue(this.content); //setValue():设置编辑器内容
//         return false;
//       }
//       //!!强制转换为boolean类型
//       if(!!bak && Object.is(currentValue,bak)){ //判断bak内容是否有数据并且判断当前值和缓存是否一致
//         this.bakModal.show(); //Modal弹窗显示
//       }
//       this.content = currentValue;//
//     }else if(!!bak){ //此时的内容为空
//       this.content = bak;
//     }
//   }
//
//   //保存文件
//   saveFile(code, name) {
//     const blob = new Blob([code], { type: 'text/plain' });
//     if ((<any>window).saveAs) {
//       (<any>window).saveAs(blob, name);
//     } else if ((<any>navigator).saveBlob){
//       (<any>navigator).saveBlob(blob, name);
//     } else {
//       const url = URL.createObjectURL(blob);
//       let link = document.createElement("a");
//       link.setAttribute("href",url);
//       link.setAttribute("download",name);
//       let event = document.createEvent('MouseEvents');
//       event.initMouseEvent('click', true, true, (<any>window), 1, 0, 0, 0, 0, false, false, false, false, 0, null);
//       link.dispatchEvent(event);
//     }
//   }
//
//   //保存为markeddown
//   saveAsMarkdown(){ //保存
//     this.saveFile(this.content,"untitled.md");
//   }
//
//   //键盘keyup事件
//   keyDownListen(ev){
//
//     //退出全屏
//     if(Object.is(ev.keyCode,27)){
//       this.fullscreen = false;
//     }
//
//     //全屏
//     if(Object.is(ev.keyCode,122)){
//       this.fullscreen = !this.fullscreen;
//     }
//
//     //保存
//     if(ev.keyCode == 83 && (ev.ctrlKey || ev.metaKey || ev.shiftKey)){
//       this.saveAsMarkdown(); //保存
//       ev.preventDefault(); //阻止事件默认动作
//       return false;
//     }
//   }
//
//   //插入内容
//   updateCodeMirror(data){
//     console.log("3333");
//     const codemirror = this.editor; //
//     codemirror.replaceSelection(data);  //用给定的字符串替换选择。默认情况下，新选择将在插入的文本之后结束
//     const startPoint = codemirror.getCursor("start"); //指示要返回的选择的结尾
//     console.log(startPoint);
//     const endPoint = codemirror.getCursor("end");
//     codemirror.setSelection(startPoint,endPoint); //返回一个包含每个选择的字符串的数组，表示选择的内容。
//     codemirror.focus();  //聚焦
//   }
//
//
//   /**
//    * 替换光标选中的内容
//    * @param cm     编辑器对象
//    * @param active
//    * @param start
//    * @param end
//    */
//   replaceSelection(cm,active,start,end){
//     let text;
//     let startPoint = cm.getCursor("start"); //获取光标开始的位置
//     let endPoint = cm.getCursor("end"); //获取光标结束
//     if(active){
//       text = cm.getLine(startPoint.line);//获取行数内容
//       start = text.slice(0,startPoint.ch);
//       end = text.slice(startPoint.ch);//slice(start,end);
//       cm.setLine(startPoint.line, start + end);//
//     }else{
//       text = cm.getSelection(); //获取选中的内容
//       cm.replaceSelection(start + text + end); //替换选中的内容
//       startPoint.ch += start.length;
//       endPoint.ch += start.length;
//     }
//     cm.setSelection(startPoint,endPoint);
//     cm.focus();//
//   }
//
//   /**
//    * 获取编辑器当前光标的位置
//    * @param cm  编辑器对象
//    * @param pos //获取编辑器光标的位置
//    * @returns {{}}
//    */
//   getState(cm,pos){
//     pos = pos || cm.getCursor("start"); //获取光标开始位置
//     let stat = cm.getTokenAt(pos);//检索在给定位置（{line, ch}对象）之前发现的当前模式的令牌信息
//     if(!stat.type || !stat.type.split) return {};
//     let types = stat.type.split(" "); //以空格切割，返回数组
//     let ret = {},data,text;
//     for (let i = 0; i < types.length; i++) {
//       data = types[i];
//       if (data === 'strong') {
//         (<any>ret).bold = true;
//       } else if (data === 'letiable-2') {
//         text = cm.getLine(pos.line);
//         if (/^\s*\d+\.\s/.test(text)) {
//           ret['ordered-list'] = true;
//         } else {
//           ret['unordered-list'] = true;
//         }
//       } else if (data === 'atom') {
//         (<any>ret).quote = true;
//       } else if (data === 'em') {
//         (<any>ret).italic = true;
//       }
//     }
//     return ret;
//   }
//
//   //字体加粗
//   toggleBold(){
//     const codemirror = this.editor;
//     const stat = this.getState(codemirror, codemirror.getCursor());
//     let text;
//     let start = "**";  //光标选中开始位置
//     let end = "**";    // 光标选中结束位置
//     let startPoint = codemirror.getCursor("start");
//     let endPoint = codemirror.getCursor("end");
//     //console.log(startPoint);  //获取光标开始的位置；返回一个对象 Pos {line: 0, ch: 0, sticky: "after", xRel: 1}
//     //console.log(endPoint);  // 获取光标结束的位置；返回一个对象
//     if((<any>stat).bold){
//       text = codemirror.getLine(startPoint.line); //
//       console.log(text);
//       start = text.slice(0, startPoint.ch);
//       end = text.slice(startPoint.ch);
//
//       start = start.replace(/^(.*)?(\*|\_){2}(\S+.*)?$/, '$1$3');
//       end = end.replace(/^(.*\S+)?(\*|\_){2}(\s+.*)?$/, '$1$3');
//       startPoint.ch -= 2;
//       endPoint.ch -= 2;
//       // console.log('text', text, 'start', start, 'end', end, startPoint, endPoint);
//       // codemirror.setLine(startPoint.line, start + end);
//       // codemirror.replaceRange(end, endPoint);
//     }else{
//       text = codemirror.getSelection(); //获取选中的内容；
//       codemirror.replaceSelection(start + text + end ); //替换选中的内容replaceSelection()
//
//       startPoint.ch += 2;
//       endPoint.ch +=2;
//     }
//     codemirror.setSelection(startPoint,endPoint); //根据选中的内容
//     codemirror.focus();
//   }
//
//   // 斜体
//   toggleItalic() {
//     const codemirror = this.editor;
//     const stat = this.getState(codemirror, codemirror.getCursor());
//
//     let text;
//     let start = '*';
//     let end = '*';
//
//     let startPoint = codemirror.getCursor('start');
//     let endPoint = codemirror.getCursor('end');
//     if ((<any>stat).italic) {
//        text = codemirror.getLine(startPoint.line);
//        start = text.slice(0, startPoint.ch);
//        end = text.slice(startPoint.ch);
//
//        start = start.replace(/^(.*)?(\*|\_)(\S+.*)?$/, '$1$3');
//        end = end.replace(/^(.*\S+)?(\*|\_)(\s+.*)?$/, '$1$3');
//        startPoint.ch -= 1;
//        endPoint.ch -= 1;
//        // codemirror.setLine(startPoint.line, start + end);
//     } else {
//       text = codemirror.getSelection();
//       codemirror.replaceSelection(start + text + end);
//
//       startPoint.ch += 1;
//       endPoint.ch += 1;
//     }
//     codemirror.setSelection(startPoint, endPoint);
//     codemirror.focus();
//   }
//
//   //插入连接
//   drawLink(){
//     const codemirror = this.editor;
//     const position = codemirror.getCursor(); //获取光标的位置;
//     const stat = this.getState(codemirror,position);
//     this.replaceSelection(codemirror, (<any>stat).link, '[', '](https://)'); //替换
//   }
//
//   //插入图片
//   drawImage() {
//     const codemirror = this.editor;
//     const position = codemirror.getCursor();
//     const stat = this.getState(codemirror, position);
//     this.replaceSelection(codemirror, (<any>stat).image, '![](', ')');
//   }
//
//   //插入引用
//   drawQuote(){
//     const codemirror = this.editor;
//     const position = codemirror.getCursor();
//     const stat = this.getState(codemirror, position);
//     this.replaceSelection(codemirror, (<any>stat).quote, '> ', '\n');
//   }
//
//   //插入代码
//   drawCode(){
//     const codemirror = this.editor;
//     const position = codemirror.getCursor();
//     const stat = this.getState(codemirror, position);
//     this.replaceSelection(codemirror, (<any>stat).code, '```\n', '\n```');
//   }
//
//   // 插入h3标题
//   drawH3Title(data) {
//     const codemirror = this.editor;
//     const position = codemirror.getCursor();
//     const stat = this.getState(codemirror, position);
//     this.replaceSelection(codemirror, (<any>stat).h3, '### ', '\n');
//     // this.updateCodeMirror(data);
//   }
//
//   // 撤销
//   undo() {
//     const codemirror = this.editor;
//     codemirror.undo();
//     codemirror.focus();
//   }
//
//   // 回退
//   redo() {
//     const codemirror = this.editor;
//     codemirror.redo();
//     codemirror.focus();
//   }
//
//   //ControlValueAccessor提供的API； 初始化触发
//   registerOnChange(fn: Function): void {
//     this.onModelChange = fn;
//   }
//
//   // 注册事件
//   registerOnTouched(fn: Function): void {
//     this.onModelTouched = fn;
//   }
//
//
// }
