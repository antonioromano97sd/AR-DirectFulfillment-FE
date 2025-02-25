import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';
import {FormsModule} from '@angular/forms';
import {AuthService} from './services/auth.service';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {OrdersService} from './services/orders.service';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar.component';
import {LoginComponent} from './components/login/login.component';
import {OrdersDashboardComponent} from './components/orders-dashboard/orders-dashboard.component';
import {LayoutComponent} from './components/layout/layout.component';
import {RouterModule} from '@angular/router';
import {ProfileComponent} from './components/profile/profile.component';
import {SettingsComponent} from './components/settings/settings.component';
import {PrintModalComponent} from './components/orders-dashboard/print-modal/print-modal.component';


export function tokenGetter() {
  return localStorage.getItem('token'); // Prende il token dal localStorage
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OrdersDashboardComponent,
    NavbarComponent,
    LayoutComponent,
    ProfileComponent,
    SettingsComponent,
    PrintModalComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: ['localhost:3000/api/auth/login'] // Percorsi dove NON inviare il token
      }
    })
  ],
  providers: [
    OrdersService,
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'it'} // Imposta la lingua italiana
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
