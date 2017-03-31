[![Build Status](https://travis-ci.org/akveo/ng2-admin.svg?branch=master)](https://travis-ci.org/akveo/ng2-admin)
[![Join the chat at https://gitter.im/ng2-admin/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ng2-admin/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Dependency Status](https://david-dm.org/akveo/ng2-admin/status.svg)](https://david-dm.org/akveo/ng2-admin)

# Admin panel framework based on Angular 2, Bootstrap 4 and Webpack

Admin template made with :heart:  by [Akveo team](http://akveo.com/). Follow us on [Twitter](https://twitter.com/akveo_inc) to get latest news about this template first!

### 安装出现的问题

<p>安装ngc：npm install @angular/compiler-cli @angular/platform-server --save</p>
<p>安装amcharts3和ammap3命令:npm install amcharts/amcharts3和npm install amcharts/ammap必须在node配置好git环境(在node中输入git命令：没有显现git不是内部命令则正常)</p>
<p>bootstrap-loader安转引用会报错：配置详情：https://github.com/shakacode/bootstrap-loader,并配置.bootstraprc文件，并进行修
改，bootstrap：4.0.0-alpha.6不支持当前.bootstraprc配置；bootstrap-load导入会报错；
<span>bootstart:4.0.0-alpha.6<span>
    <span>不存在_animations 和_tags ;修改.bootstraprc文件也会报错，<span>
    <a href="https://github.com/shakacode/bootstrap-loader/issues/236">https://github.com/shakacode/bootstrap-loader/issues/236 </a>
</p>
    
<p>解决node install.js 安装出错的问题，在项目中增加.npmrc配置文件,在文件中添加一下内容:

    registry=https://registry.npm.taobao.org
    sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
    phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
    ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
<p>
<p>node-pre:不支持python3.0以上的版本，最好使用2.7.3版本   解决办法：npm install --python=python2.7 或 npm config set python python2.7</p>

### Demo

<a target="_blank" href="http://akveo.com/ng2-admin/"><img src="http://i.imgur.com/QK9AzHj.jpg" width="600" alt="Sky Blue"/></a>

<a target="_blank" href="http://akveo.com/ng2-admin/">Live Demo</a>

## Features
* TypeScript
* Webpack
* Responsive layout
* High resolution
* Bootstrap 4 CSS Framework
* Sass
* Angular 2
* jQuery
* Charts (Chartist, Chart.js)
* Maps (Google, Leaflet, amMap)
* and many more!

##License
[MIT](LICENSE.txt) license.

### From akveo

Enjoy :metal:
We're always happy to hear your feedback!
