import { Routes,RouterModule } from "@angular/router";

import { Announcement } from "./announcement.component"

const routes:Routes = [
  {path:"",component:Announcement}
]


export const rounting = RouterModule.forChild(routes)
