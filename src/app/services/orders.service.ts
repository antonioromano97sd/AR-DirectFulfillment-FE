import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order.model';

import { of, delay } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = environment.apiBaseUrl + '/orders';  // Cambia l'endpoint per gli ordini

  constructor(private http: HttpClient) { }

  // Chiamata API per ottenere gli ordini dal backend
  getOrders(): Observable<Order[]> {
      return of([
        new Order(1, '1234', 'ABC123', 10, '2025-02-18'),
        new Order(2, '5678', 'DEF456', 5, '2025-02-17'),
        new Order(3, '91011', 'GHI789', 3, '2025-02-16')
      ]).pipe(delay(1000)); // Simula un ritardo di 1 secondo come un'API reale

    //return this.http.get<Order[]>(this.apiUrl);
  }
}
