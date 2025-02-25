import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequestModel } from '../models/loginRequestModel';

import { tap } from 'rxjs/operators';
import {environment} from '../../environments/environment'; // tap per eseguire azioni sulla risposta

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiBaseUrl; // Usando il prefisso /api che verrà rediretto dal proxy

  constructor(private http: HttpClient) { }

  //metodo login
  login(credentials: LoginRequestModel): Observable<any> {
    console.log('Dati inviati al backend:', JSON.stringify(credentials));

    // Effettua una richiesta POST con i dati di login (username e password)
    return this.http.post<any>(`${this.apiUrl}/login`, credentials,
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      tap(response => {
        console.log('Risposta del server:', response);
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Salva il token nel Local Storage
          console.log('Token salvato:', response.token);
        } else {
          console.error('⚠️ Nessun token trovato nella risposta:', response);
        }
      })
    );
  }



  getToken(): string | null {
    // Recupera il token dal localStorage (se presente)
    return localStorage.getItem('token');
  }

  // Metodo per il logout
  logout(): void {
    localStorage.removeItem('token'); // Rimuove il token dal Local Storage al logout
    console.log('Logout eseguito, token rimosso.');
  }

}
