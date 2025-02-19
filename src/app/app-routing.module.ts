import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OrdersDashboardComponent } from './components/orders-dashboard/orders-dashboard.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'orders-dashboard', component: OrdersDashboardComponent },
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
