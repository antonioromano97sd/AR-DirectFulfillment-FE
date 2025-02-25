import { Injectable } from '@angular/core';
import { OrderStatus } from '../models/order-status.enum';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {

  // Funzione per ottenere la descrizione in italiano di uno stato

  getDescription(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.NEW: return 'Nuovo';
      case OrderStatus.CANCELLED: return 'Annullato';
      case OrderStatus.ACCEPTED: return 'Accettato';
      default: return status; // Ritorna il valore originale se non trovato
    }
  }
}
