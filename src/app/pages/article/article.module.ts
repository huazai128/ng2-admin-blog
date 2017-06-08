import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from "../../theme/nga.module";
import { PaginationModule, BsDropdownModule, ModalModule } from 'ngx-bootstrap';

import { routing } from "./article.routing"
import { Article } from "./article.component";
import { Category } from "./component/category";
import { CategoryAdd,CategoryList } from "./component/category/components"
import { List } from "./component/list";
import { ArticleTag } from "./component/tag";
import { Edit } from "./component/edit";

import { CategoryArticle } from "./component/edit/components/category";
import { ArticleExtend } from "./component/edit/components/extend";
import { EditArticle } from "./component/edit/components/main";
import {ArticleSubmit } from "./component/edit/components/submit";

//数据服务
import { TagService } from "./component/tag/tag.server";
import { ArticleService } from "./component/edit";




@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    NgaModule,
    routing
  ],
  declarations:[
    Article,
    Category,
    List,
    Edit,
    EditArticle,
    CategoryArticle,
    ArticleExtend,
    ArticleSubmit,
    CategoryAdd,
    CategoryList,
    ArticleTag
  ],
  providers:[
    TagService,
    ArticleService
  ]
})

export class ArticleModule{

}
