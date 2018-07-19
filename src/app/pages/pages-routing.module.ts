import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from './pages-routing.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
  {
    path: 'dashboard',
    component: DashboardComponent,
      
  }, {
    path: 'charts',
    loadChildren: './charts/charts.module#ChartsModule', canActivate: [AuthGuard] 
  },   
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, 
  {
    path: 'tables',
    loadChildren: './tables/tables.module#TablesModule', canActivate: [AuthGuard]
  }, 
  {
    path: '**',
    component: NotFoundComponent,
  }
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
