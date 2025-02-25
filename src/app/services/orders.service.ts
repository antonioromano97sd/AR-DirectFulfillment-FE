import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = environment.apiBaseUrl + '/orders';  // Cambia l'endpoint per gli ordini

  constructor(private http: HttpClient) {}

  // Chiamata API per ottenere gli ordini dal backend
  getOrders(): Observable<Order[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token non trovato! Utente non autenticato.');
      return throwError(() => new Error('Token non presente.'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<Order[]>(this.apiUrl, { headers }).pipe(
      tap(response => console.log('Dati ricevuti dal backend:', response)),
      catchError(error => {
        console.error('Errore nel caricamento degli ordini:', error);
        return throwError(() => error);
      })
    );
  }



  // Metodo per accettare un ordine
  acceptOrder(orderId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<void>(`${this.apiUrl}/${orderId}`, {status: 'ACCETTATO'}, {headers}).pipe(
      tap(() => console.log(`Ordine ${orderId} accettato`)),
      catchError(error => {
        console.error('Errore nell’accettare l’ordine:', error);
        return throwError(() => error);
      })
    );
  }


  // Metodo per rifiutare un ordine
  rejectOrder(orderId: number, reason: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<void>(`${this.apiUrl}/${orderId}`, {status: 'RIFIUTATO', reason}, {headers}).pipe(
      tap(() => console.log(`Ordine ${orderId} rifiutato con motivo: ${reason}`)),
      catchError(error => {
        console.error('Errore nel rifiutare l’ordine:', error);
        return throwError(() => error);
      })
    );
  }

  uploadOrderFile(orderId: number | null, fileData: FormData): Observable<any> {
    if (!orderId) {
      return throwError(() => new Error('Order ID non valido'));
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/${orderId}/upload-file`, fileData, { headers })
      .pipe(
      tap(() => console.log('File caricato con successo')),
      catchError(error => {
        console.error('Errore nel caricamento del file:', error);
        return throwError(() => error);
      })
    );
  }
}


