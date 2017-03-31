import { Routes,RouterModule } from "@angular/router";
import { Pages } from "./pages.component";

const routes:Routes = [
  { path: 'login', loadChildren:"app/pages/login/login.module#LoginModule" },
  { path:"pages",component:Pages,children:[

  ]}
];

export const routing = RouterModule.forChild(routes);
