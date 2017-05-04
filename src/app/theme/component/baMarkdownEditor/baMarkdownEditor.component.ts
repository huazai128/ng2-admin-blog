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
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap";

const marked = require('marked');
const hljs = require('highlight.js');
const CodeMirror = require('codemirror');

(<any>window).hljs = hljs;
(<any>window).marked = marked;
(<any>window).CodeMirror = CodeMirror;

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
  highlight(code, lang, callback) {
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
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BaMarkdownEditor),
    multi: true
  }],
  encapsulation: ViewEncapsulation.None
})

export class BaMarkdownEditor implements AfterViewInit{

  @ViewChild("bakModal") bakModal:ModalDirective;  //

  //传入父组件数据
  @Input() public title:string;
  @Input() public config:Object;

  //传出事件
  @Output() public ready = new EventEmitter<any>();
  @Output() public change = new EventEmitter<any>();

  //基本数据
  public editor:any;
  public content:any = "";
  public markedHtml:any = "";
  public editorElem:HTMLElement;
  public timer = null;  //

  //这两个函数的作用
  onModalChange:Function = () => {};
  onModalTouched:Function = () => {};


  constructor(private _el:ElementRef){}

  ngOnInit(){
    console.log(this._el);//指向那个Element
  }

  ngAfterViewInit():void{

  }
}
