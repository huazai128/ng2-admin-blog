import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule }           from '../../theme/nga.module';
import { PaginationModule, BsDropdownModule, ModalModule } from 'ngx-bootstrap';

import { routing } from "./article.routing"

import { Article } from "./article.component";
import { Category } from "./component/category";
import { CategoryAdd,CategoryList } from "./component/category/components"

import { List } from "./component/list";
import { ArticleTag } from "./component/tag";

import { Edit } from "./component/edit";
import {
  EditArticle,
  CategoryArticle,
  ArticleExtend,
  ArticleSubmit } from "./component/edit/components";


//数据服务
import { TagService } from "./component/tag/tag.server"


@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
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
    TagService
  ]
})


export class ArticleModule{

}
