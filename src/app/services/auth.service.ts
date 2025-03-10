import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginRequestModel} from '../models/loginRequestModel';

import {tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
  }

  login(credentials: LoginRequestModel): Observable<any> {

    // Effettua una richiesta POST con i dati di login (username e password)
    return this.http.post<any>(`${this.apiUrl}/login`, credentials,
      {headers: {'Content-Type': 'application/json'}}
    ).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        } else {
          console.error('No token into response');
        }
      })
    );
  }


  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeTokenFromLocalStorage(): void {
    localStorage.removeItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  getClaim(claimKey: string): any {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken[claimKey] : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.getDecodedToken();
    if (!decodedToken || !decodedToken.exp) return false;

    const expirationDate = new Date(decodedToken.exp * 1000);
    return expirationDate > new Date(); // Controlla se il token è ancora valido
  }

}
