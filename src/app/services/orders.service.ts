import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {GetOrdersResponseModel} from '../models/order.model';
import {catchError} from 'rxjs/operators';
import {UpdateStatusRequestModel} from '../models/update-status-request-model';
import {PagingModel} from '../models/paging.model';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = environment.apiBaseUrl + '/orders';  // Cambia l'endpoint per gli ordini

  constructor(private http: HttpClient) {
  }

  getOrders(params: HttpParams): Observable<PagingModel<GetOrdersResponseModel[]>> {
    return this.http.get<PagingModel<GetOrdersResponseModel[]>>(`${this.apiUrl}/all`, {
      params
    });
  }

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

    return this.http.post<any>(`${this.apiUrl}/${orderId}/upload-file`, fileData, {headers})
      .pipe(
        catchError(error => {
          console.error('Errore nel caricamento del file:', error);
          return throwError(() => error);
        })
      );
  }
}


