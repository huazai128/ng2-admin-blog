import { Routes,RouterModule } from "@angular/router";
import { Pages } from "./pages.component";

const routes:Routes = [
  { path: 'login', loadChildren:"app/pages/login/login.module#LoginModule"},
  { path:"",
    component:Pages,
    children:[
      {path:"",redirectTo:"dashboard",pathMatch:"full"},
      {path:"dashboard",loadChildren: "app/pages/dashboard/dashboard.module#DashBoardModule"},
      {path:"announcement",loadChildren:"app/pages/announcement/announcement.module#AnnouncementModule" },
      {path:"article",loadChildren:"app/pages/article/article.module#ArticleModule"},
      {path:"options",loadChildren:"app/pages/options/options.module#OptionsModule"}
    ]}
];

export const routing = RouterModule.forChild(routes);
