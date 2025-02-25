import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetOrdersResponseModel } from '../models/order.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { of } from 'rxjs';
import {UpdateStatusRequestModel} from '../models/update-status-request-model';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = environment.apiBaseUrl + '/orders';  // Cambia l'endpoint per gli ordini

  constructor(private http: HttpClient) {}

  // Chiamata API per ottenere gli ordini dal backend
  getOrders(): Observable<GetOrdersResponseModel[]> {
    return this.http.get<GetOrdersResponseModel[]>(this.apiUrl);
  }



  // Metodo per modificare lo stato di un ordine
  updateStatusOrder(updateStatusRequestModel: UpdateStatusRequestModel): Observable<GetOrdersResponseModel[]> {
    return this.http.put<GetOrdersResponseModel[]>(`${this.apiUrl}/status`, updateStatusRequestModel);
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


