import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = environment.apiBaseUrl + '/orders';  // Cambia l'endpoint per gli ordini

  constructor(private http: HttpClient) { }

  // Metodo per ottenere gli ordini
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);  // Chiamata GET per ottenere gli ordini
  }
}
