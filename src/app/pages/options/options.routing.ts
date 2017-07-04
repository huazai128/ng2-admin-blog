import { Routes,RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { OptionsComponent } from "./options.component";

const routes:Routes = [
  {path:"",component:OptionsComponent}
]

export const routing:ModuleWithProviders = RouterModule.forChild(routes);
