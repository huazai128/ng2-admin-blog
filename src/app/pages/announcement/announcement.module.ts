import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule, BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { NgaModule } from "../../theme/nga.module";
import { rounting } from "./announcement.routing";

import { Announcement } from "./announcement.component";
import { AnnouncementService } from "./announcement.service";


@NgModule({
  imports:[
    CommonModule,
    NgaModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(), //分页
    BsDropdownModule.forRoot(), //拖拽
    ModalModule.forRoot(),  //弹窗
    rounting
  ],
  declarations:[
    Announcement
  ],
  providers:[
    AnnouncementService
  ]
})

export class AnnouncementModule{

}
