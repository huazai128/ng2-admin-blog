import { NgModule, ModuleWithProviders }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {BaThemeConfig} from './theme.config';

//指令
import {BaThemeConfigProvider} from './theme.configProvider';

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
]






@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [

  ]
})
export class NgaModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: NgaModule,
      providers: [
        BaThemeConfigProvider,
        BaThemeConfig,
        ...NGA_SERVICE
      ],
    };
  }
}
