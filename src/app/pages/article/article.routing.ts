import { Routes,RouterModule } from "@angular/router";

import { Article } from "./article.component";
import { Category } from "./component/category";
import { List } from "./component/list";
import { Edit } from "./component/edit";

const routes:Routes = [
  { path:"",
    component:Article,
    children:[
      {path:"",redirectTo:"list",pathMatch:"full"},
      {path:"category",component:Category},
      {path:"list",component:List},
      {path:"post",component:Edit}
  ]}
];

export const routing = RouterModule.forChild(routes);
