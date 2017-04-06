import { NgModule, ModuleWithProviders }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {BaThemeConfig} from './theme.config';

//指令
import {BaThemeConfigProvider} from './theme.configProvider';

//组件
import {
  BaNavbarTop
} from "./component";

//服务
import {
  ProloaderServer,
  BaThemeSpinnerServer,
  BaImageLoader
} from "./service";

//服务
const NGA_SERVICE = [
  ProloaderServer,
  BaThemeSpinnerServer,
  BaImageLoader
];

//组件
const NGA_COMPONENT = [
  BaNavbarTop
];




@NgModule({
  declarations: [
    ...NGA_COMPONENT
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ...NGA_COMPONENT
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
        ...NGA_SERVICE
      ],
    };
  }
}
