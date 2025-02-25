import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken(); // Otteniamo il token dal Local Storage

    if (token) {
      // Cloniamo la richiesta per aggiungere l'intestazione (header) Authorization
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Aggiungiamo il token nel header Authorization
        }
      });

      return next.handle(cloned); // Passiamo la richiesta clonata con il token
    }else{return next.handle(req);} // Se non c'è il token, procediamo con la richiesta originale
  }
}
