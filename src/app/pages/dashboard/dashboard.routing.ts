import { Routes,RouterModule } from "@angular/router";
import { Dashboard } from "./dashboard.component"

const routes:Routes = [
  {path:"",component:Dashboard}
]

export const routing = RouterModule.forChild(routes);
