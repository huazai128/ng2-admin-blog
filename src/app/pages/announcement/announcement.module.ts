import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule, BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { NgaModule } from "../../theme/nga.module";
import { rounting } from "./announcement.routing"

import { Announcement } from "./announcement.component";

@NgModule({
  imports:[
    CommonModule,
    NgaModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    rounting
  ],
  declarations:[
    Announcement
  ],
  providers:[

  ]
})

export class AnnouncementModule{

}
