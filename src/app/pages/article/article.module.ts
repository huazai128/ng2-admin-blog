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


import { Edit } from "./component/edit";
import {
  EditArticle,
  CategoryArticle,
  ArticleExtend,
  ArticleSubmit } from "./component/edit/components";



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
    CategoryList
  ],
  providers:[

  ]
})


export class ArticleModule{

}
