import { ModuleWithProviders } from "@angular/core";
import { Routes,RouterModule } from "@angular/router";

import { Login } from "./login.component";

const routes:Routes = [
  { path: '', component: Login }
]

export const routing:ModuleWithProviders = RouterModule.forChild(routes);

