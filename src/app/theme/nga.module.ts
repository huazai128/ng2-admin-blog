import { NgModule, ModuleWithProviders }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule } from "ngx-bootstrap";  //引入ModalModule;

import {BaThemeConfig} from './theme.config';

//指令
import {BaThemeConfigProvider} from './theme.configProvider';

//组件
import {
  BaNavbarTop,
  BaMsgCenter,
  BaSidebar,
  BaMenu,
  BaMenuItem,
  BaBackTop,
  BaContentTop,
  BaCard,
  BaMarkdownEditor,
  BaCheckbox,
  EChartsComponent,
  BaPicture
} from "./component";

//服务
import {
  ProloaderServer,
  BaThemeSpinnerServer,
  BaImageLoader
} from "./service";

//管道
import { BaProfilePicture } from "./pipes";

//指令
import { BaSlimScroll } from "./directives";

const NGA_DIRECTIVES = [
  BaSlimScroll
];
//服务
const NGA_SERVICE = [
  ProloaderServer,
  BaThemeSpinnerServer,
  BaImageLoader
];

// 验证
import { EmailValidator,EqualPasswordsValidator } from "./validate";

//组件
const NGA_COMPONENT = [
  BaNavbarTop,
  BaMsgCenter,
  BaSidebar,
  BaMenu,
  BaMenuItem,
  BaBackTop,
  BaContentTop,
  BaCard,
  BaMarkdownEditor,
  BaCheckbox,
  EChartsComponent,
  BaPicture
];

//管道
const NGA_PIPES = [
  BaProfilePicture
];


// 验证
const NGA_VALIDATORS = [
  EmailValidator,
  EqualPasswordsValidator
]


@NgModule({
  declarations: [
    ...NGA_COMPONENT,
    ...NGA_PIPES,
    ...NGA_DIRECTIVES
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule
  ],
  exports: [
    ...NGA_COMPONENT,
    ...NGA_PIPES,
    ...NGA_DIRECTIVES
  ]
})


export class NgaModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: NgaModule,
      //服务
      providers: [
        BaThemeConfigProvider,
        BaThemeConfig,
        ...NGA_VALIDATORS,
        ...NGA_SERVICE
      ],
    };
  }
}
