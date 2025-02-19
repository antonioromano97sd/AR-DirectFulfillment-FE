import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { TokenInterceptorService } from './interceptors/token.service';
import { LoginComponent } from './components/login/login.component';

import { FormsModule } from '@angular/forms';// Importa FormsModule per la gestione dei form
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { OrdersDashboardComponent } from './components/orders-dashboard/orders-dashboard.component'; //importa l'interceptor
import { OrdersService } from './services/orders.service';

import { LOCALE_ID } from '@angular/core'; // Importa LOCALE_ID
import { registerLocaleData } from '@angular/common'; // Importa registerLocaleData
import localeIt from '@angular/common/locales/it'; // Importa la lingua italiana

registerLocaleData(localeIt);//importa la lingua italiana

export function tokenGetter() {
  return localStorage.getItem('token'); // Prende il token dal localStorage
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OrdersDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'], // Sostituire con il dominio del backend
        disallowedRoutes: ['localhost:3000/api/auth/login'] // Percorsi dove NON inviare il token
      }
    })
  ],
  providers: [
    OrdersService,
    AuthService,
    provideClientHydration(withEventReplay()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'it' } // Imposta la lingua italiana
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
