import { Routes,RouterModule } from "@angular/router";

import { Article } from "./article.component";
import { Category } from "./component/category";
import { List } from "./component/list";
import { Edit } from "./component/edit";
import { ArticleTag } from "./component/tag";

const routes:Routes = [
  { path:"",
    component:Article,
    children:[
      {path:"",redirectTo:"list",pathMatch:"full"},
      {path:"category",component:Category},
      {path:"list",component:List},
      {path:"post",component:Edit},
      {path:"tag",component:ArticleTag},
      {path:"edit/:_id",component:Edit}
  ]}
];

export const routing = RouterModule.forChild(routes);
