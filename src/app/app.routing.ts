import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { App } from "./app.component";

export const routes: Routes = [
  { path: '', redirectTo:"dashboard",pathMatch:"full"},
  { path: '**', redirectTo:"dashboard"},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes/*, { useHash: true }*/);
