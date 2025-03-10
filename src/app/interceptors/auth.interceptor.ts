import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let cloneReq = req;
    const token: string | null = this.authService.getToken();
    if (token) {
      cloneReq = req.clone({ // Clona la richiesta e aggiunge l'header Authorization
        setHeaders: {Authorization: `Bearer ${token}`}
      });
    }
    return next.handle(cloneReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Errore 401 - Non autorizzato, reindirizzo al login.');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
