import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {OrdersDashboardComponent} from './components/orders-dashboard/orders-dashboard.component';
import {LayoutComponent} from './components/layout/layout.component';
import {ProfileComponent} from './components/profile/profile.component';
import {SettingsComponent} from './components/settings/settings.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    component: LayoutComponent, // Il layout con la navbar fissa
    children: [
      {path: 'orders/:status', component: OrdersDashboardComponent}, // Ordini attivi
      {path: 'cancelled-orders', component: OrdersDashboardComponent},  // Ordini cancellati
      {path: 'profile', component: ProfileComponent}, // profilo
      {path: 'settings', component: SettingsComponent},//impostazioni
    ]
  },
  {path: '**', redirectTo: 'login'}// Reindirizza alla login se l'URL è sbagliato
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
